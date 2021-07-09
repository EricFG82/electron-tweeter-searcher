import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { OAuth2TokenRespDTO, SearchTweetsRespDTO } from '../models/twitter.model';
import { StorageService } from './storage.service';

// Used a bridge as Twitter's API does not support CORS. 
// That means requests will only work if made from server-side, not from the browser.
const CORS_BRIDGE_URL = 'https://cors.bridged.cc';
const TWITTER_API_URL = 'https://api.twitter.com';
const API_URL = `${CORS_BRIDGE_URL}/${TWITTER_API_URL}`;

// Twitter Developer portal constants
// Url: https://developer.twitter.com/en/portal/dashboard
const API_KEY = 'jALa1ZUmUzPQsxTIHdnfno7B9';
const API_SECRET_KEY = 'uRPzkM5QkKYZBTCRnH3zJhODaTJrG923L4ZNLnQDoq4zx1ZtxL';

export class TwitterService {

    constructor(
        private storageService: StorageService) {
    }

    /**
     * Function to get OAuth2 bearer token. 
     * See documentation here: https://developer.twitter.com/en/docs/authentication/api-reference/token
     * @param apiKey
     * @param apiSecretKey
     * @returns Promise<OAuth2TokenResponse>
     */ 
    private requestOAuth2BearerToken(apiKey: string, apiSecretKey: string): Promise<OAuth2TokenRespDTO> {
        return new Promise<OAuth2TokenRespDTO>((resolve: any, reject: any) => {
            const url: string = `${API_URL}/oauth2/token`;
            const config: AxiosRequestConfig = {
                params: {
                    'grant_type': 'client_credentials' // Only client_credentials is allowed
                },
                auth: {
                    username: apiKey,
                    password: apiSecretKey
                }
            };
            axios.post<OAuth2TokenRespDTO>(url, null, config).then(
                (resp: AxiosResponse) => {
                    resolve(resp.data);
                }).catch((error: any) => {
                    reject(error);
                }
            );
        });
    }

    /**
     * Function to get OAuth2 bearer token. If it is not stored, it asks the server again.
     * See documentation here: https://developer.twitter.com/en/docs/authentication/api-reference/token
     * @returns Promise<string>
     */ 
    getOAuth2BearerToken(): Promise<string> {
        const storagePropertyKey = 'TWITTER_ACCESS_TOKEN';
        return new Promise<string>(async (resolve: any, reject: any) => {
            let bearerToken: string | null = this.storageService.get(storagePropertyKey);
            if (bearerToken) {
                resolve(bearerToken);
            } else {
                try {
                    const resp: OAuth2TokenRespDTO = await this.requestOAuth2BearerToken(API_KEY, API_SECRET_KEY);
                    bearerToken = resp.access_token;
                    this.storageService.set(storagePropertyKey, bearerToken);
                    resolve(bearerToken);
                } catch (error: any) {
                    reject(error);
                }
            }
        });
    }

    /**
     * Function to search tweets using REST API.
     * See documentation here: https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-all
     * @param bearerToken
     * @param query
     * @param maxResults
     * @returns Promise<SearchAllResp>
     */ 
    searchTweets(bearerToken: string, query: string, count?: number): Promise<SearchTweetsRespDTO> {
        return new Promise<SearchTweetsRespDTO>((resolve: any, reject: any) => {
            const url: string = `${API_URL}/1.1/search/tweets.json`;
            const config: AxiosRequestConfig = {
                params: {
                    'q': query,
                    'count': count
                },
                headers: {
                    'Authorization': `Bearer ${bearerToken}`
                }
            };
            axios.get<SearchTweetsRespDTO>(url, config).then(
                (resp: AxiosResponse<SearchTweetsRespDTO>) => {
                    resolve(resp.data);
                }).catch((error: any) => {
                    reject(error);
                }
            );
        });
    }

}