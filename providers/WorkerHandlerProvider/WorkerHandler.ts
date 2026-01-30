/* eslint-disable prettier/prettier */
import { Iupdatable } from '../../services/IUpdatable';
import Env from '@ioc:Adonis/Core/Env'


export default class WorkerHandler {
    private updater: Iupdatable
    constructor(updater: Iupdatable){
        this.updater = updater
        setInterval(
            async () => {
                console.log('updated')
                await this.updater.updateArticles()
            },
            Env.get('UPDATE_TIME', 1) * 60000
        )
    }
}
