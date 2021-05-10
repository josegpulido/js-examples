import {
  Observable,
  Observer,
  Subscription,
  // Subject es un tipo especial de Observable
  Subject
} from 'rxjs';

const observer:Observer<any> = {
  next: stream => {
    console.log('onNext: ', stream);
  },
  error: error => {
    console.log('onError: ', error);
  },
  complete: () => {
    console.log('onComplete');
  }
};

// Creando Observable
const observable$ = new Observable<number>(subscriber => {
  /**
   * Este Observable emite cada 3s un stream que contiene
   * un número aleatorio.
   */
  const i = setInterval(() => {
    subscriber.next(Math.random());
  }, 3000);
  // Callback del .unsubscribe()
  return () => {
    clearInterval(i);
  };
});

/**
 * Subject sirve para tener varias suscripciones que apunten
 * solo a un Observable. Cuando un .subscribe sucede, normalmente
 * se está ejecutando su contenido de forma idependiente. Subject
 * permite levantar múltiples suscripciones previniendo este
 * comportamiento. A esto se le conoce como difusión multicast.
 * 
 * Para lograr lo anterior, el Subject actúa como Observer (lo
 * cual le otorga su .next(), .error() y .complete()),
 * y entonces los Subscription se suscriben al Subject.
 */
const subject$ = new Subject();
observable$.subscribe(subject$);
subject$.next(3.1416);
subject$.complete();
/**
 * Cuando la data es producida por el Observable, es considerado un
 * Cold Observable. Cuando la data es producida fuera del Observable,
 * se considera un Hot Observable.
 */

/**
 * Un Subject puede ejecutarse de forma indefinida, hasta que
 * se ejecuten los .unsubscribe correspondiente, o hasta que
 * el Observable emita un .complete().
 * 
 * Suscribiendose al Subject
 */
const sub1:Subscription = subject$.subscribe(observer);
const sub2:Subscription = subject$.subscribe(observer);
