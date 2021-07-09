/**
 * Storage service
 * 
 * Used to store data of the app.
 */

// TODO: save/load data using a better way (instead of localStorage)
export class StorageService {

    constructor() {
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
        let valueToSave: string = '';
        if (typeof value == 'string') {
            valueToSave = value;
        } else if (value) {
            valueToSave = JSON.stringify(value);
        }
        localStorage.setItem(key, valueToSave);
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
    get(key: string): string | null {
        return localStorage.getItem(key);
    }

    /**
     * Function to get data from the storage.
     * 
     * The returned data is of type any.
     * 
     * @param key
     * @param value
     * @returns any
     */ 
    getAsObj(key: string): any | null {
        const storedValue: string | null = localStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue);   
        }
        return null;
    }

}
