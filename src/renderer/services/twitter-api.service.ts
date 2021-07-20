/**
 * IPC Electron service for Twitter API
 * 
 * Used to call exposed methods of Electron ipcRenderer.
 * Done in that way for security reasons.
 * 
 * See for more details comments of files: 
 * /src/main/main.ts
 * /src/electron.preload.js
 */

import { SearchTweetsQueryDTO, SearchTweetsRespDTO } from "_/models/twitter.model";
import { ApiService } from "./api.service";

export class TwitterApiService extends ApiService {
 
    async search(searchQuery: SearchTweetsQueryDTO): Promise<SearchTweetsRespDTO> {
        return await this.invoke('searchTweets', searchQuery);
    }
    
}
