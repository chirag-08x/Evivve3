import { defaults } from 'lodash';
import { getSocket } from '../views/pages/present/components/GameAdmin.js';

//only use for game dashboard
class _SafeSocketProvider {
    listeners;
    isLoaded;

    constructor () {
        this.isLoaded = false;
        this.listeners = {};
    }

    initiate () {
        if (!this.isLoaded) {
            if (getSocket() == null)
                throw new Error("Socket is not initiated.");

            for (let listener in this.listeners) {
                for (let onFunc of this.listeners[listener]) {
                    getSocket().on(listener, onFunc);
                }
            }

            this.isLoaded = true;
        }
    }

    on (listener, func) {
        if (getSocket() == null) {
            if (!this.listeners[listener]) {
                this.listeners[listener] = [];
            }

            this.listeners[listener].push(func);
            return;
        }

        getSocket().on(listener, func);
    }

    off (listener, func) {
        if (getSocket() != null) {
            if (this.listeners[listener]) {
                getSocket().off(listener, func);
                delete this.listeners[listener];
                return;
            }
        }
    }
}

const SafeSocketProvider = new _SafeSocketProvider();
export default SafeSocketProvider;
