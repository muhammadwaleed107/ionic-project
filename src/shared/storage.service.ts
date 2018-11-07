import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable()
export class StorageService {

    constructor() { }


    setProperty(key: any, value: any) {
        let v = JSON.stringify(value);
        window.localStorage.setItem(key, v);
    }

    getProperty(key: any) {
        let property = window.localStorage.getItem(key);
        try {
            return JSON.parse(property);
        }
        catch (e) {
            return [];
        }
    }

    removeProperty(key: string) {
        window.localStorage.removeItem(key);
    }

    removeAll() {
        window.localStorage.clear();
    }


}
