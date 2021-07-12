/**
 * Twitter service
 * 
 * Used to call Twitter REST API.
 * 
 * Note: As the Axios client used for REST API calls returns responses of type AxiosResponse, 
 * I have simplified the use of all the functions of this service by directly returning a promise 
 * with the expected DTO object.
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
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

// Constants
const ACCESSTOKEN_STORAGE_KEY = 'TWITTER_ACCESS_TOKEN';

export class TwitterService {

    constructor(
        private storageService: StorageService) {
    }

    // Axios interceptor for HTTP 401 Unauthorized
    // If the token is invalid or has expired, we regenerate a new token and then call the original REST again.
    private createAxiosResponseUnauthorizedInterceptor(axiosInstance: AxiosInstance) {
        const interceptor = axiosInstance.interceptors.response.use(
            response => response,
            async (error: AxiosError) => {
                // if error response is not HTTP 401, we do a reject to not process this error 
                if (!error.response || error.response.status !== 401) {
                    return Promise.reject(error);
                }
    
                // When response code is HTTP 401 Unauthorized, try to refresh the token.
                // Eject the interceptor so it doesn't loop in case
                // token refresh causes the 401 response
                axiosInstance.interceptors.response.eject(interceptor);

                try {
                    // Deletes the token from the storage and then call the REST API to get a new one
                    this.storageService.remove(ACCESSTOKEN_STORAGE_KEY);
                    const bearerToken: string = await this.getOAuth2BearerToken();

                    error.response.config.headers['Authorization'] = `Bearer ${bearerToken}`;
                    return axiosInstance(error.response.config);

                } catch (error2: any | AxiosError) {
                    return Promise.reject(error);
                } finally {
                    this.createAxiosResponseUnauthorizedInterceptor(axiosInstance);
                }
            }
        );
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
                }).catch((error: any | AxiosError) => {
                    reject(error);
                }
            );
        });
    }

    /**
     * Internal function to get OAuth2 bearer token. If it is not stored, it asks the server again.
     * 
     * I have done it like this to demonstrate how a Bearer Token is generated using basic 
     * authentication (by using the API Key and API Secret Key) but it really would not 
     * be necessary. We could use the Bearer Token directly generated from the Twitter 
     * developer portal.
     * 
     * See documentation of the Bearers Tokens here: https://developer.twitter.com/en/docs/authentication/oauth-2-0/bearer-tokens
     * See documentation of this API here: https://developer.twitter.com/en/docs/authentication/api-reference/token
     * @returns Promise<string>
     */ 
    private getOAuth2BearerToken(): Promise<string> {
        return new Promise<string>(async (resolve: any, reject: any) => {
            let bearerToken: string | null = this.storageService.get(ACCESSTOKEN_STORAGE_KEY);
            if (bearerToken) {
                resolve(bearerToken);
            } else {
                try {
                    const resp: OAuth2TokenRespDTO = await this.requestOAuth2BearerToken(API_KEY, API_SECRET_KEY);
                    bearerToken = resp.access_token;
                    this.storageService.set(ACCESSTOKEN_STORAGE_KEY, bearerToken);
                    resolve(bearerToken);
                } catch (error: any | AxiosError) {
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

                const axiosInstance: AxiosInstance = axios.create(config);
                this.createAxiosResponseUnauthorizedInterceptor(axiosInstance);

                const resp: AxiosResponse<SearchTweetsRespDTO> = await axiosInstance.get<SearchTweetsRespDTO>(url);
                resolve(resp.data);

            } catch (error: any | AxiosError) {
                reject(error);
            }
        });
    }

}