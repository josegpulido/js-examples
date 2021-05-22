// Importaciones de terceros
import express, { Application } from 'express';
import dotenv from 'dotenv';
dotenv.config();

class Server {

  private app:Application;
  private port:string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || '8080';
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor iniciado en puerto ${this.port}`);
    });
  }

}

export default Server;