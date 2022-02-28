//load Config
import { config } from 'dotenv';
config();
//import api,statemanager and bot
import api from './api/indexApi';
import bot from './bot/indexBot';

//start the state manager
import stateManager from './utils/stateManager';

async function start() {
    while (typeof (stateManager.connection) == 'undefined') {
        console.log('Waiting for database connection...');
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    await bot();
    api.listen(api.get('port'), () => {
        console.log(`Server started on port ${api.get('port')}`);
    });
}

start();