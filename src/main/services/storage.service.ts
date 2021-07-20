/**
 * Storage service
 * 
 * Used to store data of the app.
 */

import ElectronStore from 'electron-store';

export class StorageService {

    store: ElectronStore;

    constructor() {
        this.store = new ElectronStore({ name: 'storage' });
    }

    /**
     * Procedure to set data to the storage.
     * 
     * Data can be an string or an object. 
     * if data is of type object, internally we save the data as a JSON string.
     * 
     * @param key
     * @param value
     */ 
    set(key: string, value: string | any): void {
        this.store.set(key, value);
    }

    /**
     * Function to get data from the storage.
     * 
     * The returned data is of type string.
     * 
     * @param key
     * @param value
     * @returns string
     */ 
    get(key: string): any | undefined {
        return this.store.get(key);
    }

    /**
     * Function to remove data from the storage.
     * 
     * @param key
     */ 
    remove(key: string): void {
        this.store.delete(key);
    }

}
