/**
 * Twitter service
 * 
 * Used to call Twitter REST API.
 * 
 * Note: As the Axios client used for REST API calls returns responses of type AxiosResponse, 
 * I have simplified the use of all the functions of this service by directly returning a promise 
 * with the expected DTO object.
 */

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
const API_KEY = process.env.TWITTER_API_KEY ?? 'NOAPIKEY';
const API_SECRET_KEY = process.env.TWITTER_API_SECRET_KEY ?? 'NOAPISECRETKEY';

export class TwitterService {

    constructor(
        private storageService: StorageService) {
    }

    /**
     * Function to generate a OAuth2 bearer token using basic authentication. 
     * 
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
                auth: { // Authorization Basic
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
     * 
     * I have done it like this to demonstrate how a Bearer Token is generated using basic 
     * authentication (by using the API Key and API Secret Key) but it really would not 
     * be necessary. We could use the Bearer Token directly generated from the Twitter 
     * developer portal. Also, it is not necessary to check if the token is still valid 
     * as it does not expire. 
     * 
     * See documentation of the Bearers Tokens here: https://developer.twitter.com/en/docs/authentication/oauth-2-0/bearer-tokens
     * See documentation of this API here: https://developer.twitter.com/en/docs/authentication/api-reference/token
     * @returns Promise<string>
     */ 
    private getOAuth2BearerToken(): Promise<string> {
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
     * 
     * See documentation here: https://developer.twitter.com/en/docs/twitter-api/v1/tweets/search/api-reference/get-search-tweets
     * @param query
     * @param count
     * @returns Promise<SearchAllResp>
     */ 
    searchTweets(query: string, count?: number): Promise<SearchTweetsRespDTO> {
        return new Promise<SearchTweetsRespDTO>(async (resolve: any, reject: any) => {
            try {
                const url: string = `${API_URL}/1.1/search/tweets.json`;
                const bearerToken: string = await this.getOAuth2BearerToken();
                const config: AxiosRequestConfig = {
                    params: {
                        'q': query,
                        'count': count
                    },
                    headers: {
                        'Authorization': `Bearer ${bearerToken}`
                    }
                };

                const resp: AxiosResponse<SearchTweetsRespDTO> = await axios.get<SearchTweetsRespDTO>(url, config);
                resolve(resp.data);

            } catch (error: any) {
                reject(error);
            }
        });
    }

}