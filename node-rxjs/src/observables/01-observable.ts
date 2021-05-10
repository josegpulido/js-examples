/**
 * Cuando se importa directamente de 'rxjs', significa que
 * la dependencia en cuestión sirve para crear Observables
 * o que se está importando una interface para tipar.
 */

import {
  // Importando dependencia Observable para crear Observables
  Observable,
  /**
   * Observer que es una interfaz crear una variable que contenga
   * un objeto de suscripción (next, error, complete)
   */
  Observer,
  // El objeto Subscription encapsula una suscripción a un Observable
  Subscription
} from 'rxjs';

// Creando Observable
const observable$ = new Observable<String>(subscriber => {
  /**
   * .next() emite el valor que se le pase como parámetro
   * a todos los dependientes suscritos al Observable.
   */
  subscriber.next('Hola');
  subscriber.next('Mundo');
  /**
   * Forzando un error para que se dispare el callback error
   * del dependiente suscrito.
   */
  const a = undefined;
  a.nombre = 'Myname';
  /**
   * .complete() finiquita al Observable. Es decir,
   * cualquier emisión de streams no será notificada
   * a los dependientes, aunque estos sigan suscritos.
   */
  subscriber.complete();
  /**
   * El Observable puede retornar un callback que se ejecutará
   * cuando se llame al .unsubscribe() de un objeto Subscription.
   * Aunque el .unsubscribe() se llame muchas veces, este solo
   * podrá ejecutarse una vez (o más bien, mientras haya una
   * suscripción que limpiar).
   */
  return () => {
    console.log('Callback de suscripción');
  };
});

/**
 * Para que un Observable se ejecute, tiene que haber al menos
 * un dependiente, es decir, un .subscribe()
 * 
 * Forma 1 de suscribirse a un Observable y manipular los callbacks
 */
observable$.subscribe(
  // Callback cada que suceda un .next()
  stream => {
    console.log('onNext: ', stream);
  },
  // Callback cuando el Observable dispare un error
  error => {
    console.log('onError: ', error);
  },
  // Callback cuando suceda un .complete()
  () => {
    console.log('onComplete');
  }
);

/**
 * Forma 2 de suscribirse a un Observable y manipular los
 * callbacks a travé de un Observer
 * 
 * Creando Observer
 */
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
/**
 * Indicandole al Observable el Observer recien creado.
 * 
 * Además, encapsulando la suscripción a un objeto Subscription.
 * De esta forma, se puede desuscribir luego para liberar el espacio
 * en memoria que la suscripción ocupa.
 */
const subscription:Subscription = observable$.subscribe(observer);

// Finiquitando la suscripción
subscription.unsubscribe();

/**
 * Cuando se tienen muchas suscripciones y se espera desuscribirlas
 * todas, es conveniente concatenarlas con .add() para así llamar solo un
 * .unsubscribe() y de esa manera no tener código spaggetthi.
 */
const sub1:Subscription = observable$.subscribe(observer);
const sub2:Subscription = observable$.subscribe(observer);
const sub3:Subscription = observable$.subscribe(observer);
sub1.add(sub2).add(sub3);
sub1.unsubscribe();
