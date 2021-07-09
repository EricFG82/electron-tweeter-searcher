/**
 * Storage service
 * 
 * Used to store data of the app.
 */

// TODO: save/load data using a better way (instead of localStorage)
export class StorageService {

    constructor() {
    }

    set(key: string, value: string | any): void {
        let valueToSave: string = '';
        if (typeof value == 'string') {
            valueToSave = value;
        } else if (value) {
            valueToSave = JSON.stringify(value);
        }
        localStorage.setItem(key, valueToSave);
    }

    get(key: string): string | null {
        return localStorage.getItem(key);
    }

    getAsObj(key: string): any | null {
        const storedValue: string | null = localStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue);   
        }
        return null;
    }

}
