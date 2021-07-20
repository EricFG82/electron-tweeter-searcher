/**
 * IPC Electron service to store recent searches
 * 
 * Used to call exposed methods of Electron ipcRenderer.
 * Done in that way for security reasons.
 * 
 * See for more details comments of files: 
 * /src/main/main.ts
 * /src/electron.preload.js
 */

import { RecentSearchStorageDTO } from "_/models/storage.model";
import { ApiService } from "./api.service";

// Constants of the component
const STORAGE_RECENT_SEARCHES_KEY = 'TWITTER_RECENT_SEARCHES';

export class SearchesStorageApiService extends ApiService {

    loadRecentSearches(): Promise<RecentSearchStorageDTO[]> {
        return new Promise<RecentSearchStorageDTO[]>(async (resolve: any, reject: any) => {
            try {
                let data = await this.invoke('getRecentSearches', STORAGE_RECENT_SEARCHES_KEY);
                data = (data && Array.isArray(data) ? data : []);
                
                resolve(data);

            } catch (error: any) {
                reject(error);
            }    
        });
    }

    async setRecentSearches(recentSearches: RecentSearchStorageDTO[]): Promise<void> {
        await this.invoke('setRecentSearches', recentSearches);
    }

}
