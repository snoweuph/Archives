import { EventEmitter } from 'events';
import { Connection } from 'mysql2/promise';
import connection from './db';

class StateManger extends EventEmitter {
    connection: Connection;

    constructor() {
        super();
        connection.then((connection: Connection) => {
            console.log('Database connected');
            this.connection = connection;
        });
    }
}

export default new StateManger();