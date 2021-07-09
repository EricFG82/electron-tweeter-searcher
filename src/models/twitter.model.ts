export const TWITTER_REST_DATE_FORMAT = 'ddd MMM DD HH:mm:ss ZZ YYYY';

export interface UserMentionDTO {
    screen_name: string;
    name: string;
    id: any;
    id_str: string;
    indices: number[];
}

export interface UrlDTO {
    url: string;
    expanded_url: string;
    display_url: string;
    indices: number[];
}

export interface EntitiesDTO {
    hashtags: any[];
    symbols: any[];
    user_mentions: UserMentionDTO[];
    urls: UrlDTO[];
}

export interface MetadataDTO {
    iso_language_code: string;
    result_type: string;
}

export interface DescriptionDTO {
    urls: any[];
}

export interface UserEntitieUrlDTO {
    urls: UrlDTO[];
}

export interface UserEntitiesDTO {
    url?: UserEntitieUrlDTO;
    description: DescriptionDTO;
}

export interface UserDTO {
    id: number;
    id_str: string;
    name: string;
    screen_name: string;
    location: string;
    description: string;
    url?: any;
    entities: UserEntitiesDTO;
    protected: boolean;
    followers_count: number;
    friends_count: number;
    listed_count: number;
    created_at: string;
    favourites_count: number;
    utc_offset?: any;
    time_zone?: any;
    geo_enabled: boolean;
    verified: boolean;
    statuses_count: number;
    lang?: any;
    contributors_enabled: boolean;
    is_translator: boolean;
    is_translation_enabled: boolean;
    profile_background_color: string;
    profile_background_image_url: string;
    profile_background_image_url_https: string;
    profile_background_tile: boolean;
    profile_image_url: string;
    profile_image_url_https: string;
    profile_banner_url?: string;
    profile_link_color: string;
    profile_sidebar_border_color: string;
    profile_sidebar_fill_color: string;
    profile_text_color: string;
    profile_use_background_image: boolean;
    has_extended_profile: boolean;
    default_profile: boolean;
    default_profile_image: boolean;
    following?: any;
    follow_request_sent?: any;
    notifications?: any;
    translator_type: string;
    withheld_in_countries: any[];
}

export interface RetweetedStatusDTO {
    created_at: string;
    id: any;
    id_str: string;
    text: string;
    truncated: boolean;
    entities: EntitiesDTO;
    metadata: MetadataDTO;
    source: string;
    in_reply_to_status_id?: any;
    in_reply_to_status_id_str?: any;
    in_reply_to_user_id?: any;
    in_reply_to_user_id_str?: any;
    in_reply_to_screen_name?: any;
    user: UserDTO;
    geo?: any;
    coordinates?: any;
    place?: any;
    contributors?: any;
    is_quote_status: boolean;
    retweet_count: number;
    favorite_count: number;
    favorited: boolean;
    retweeted: boolean;
    possibly_sensitive: boolean;
    lang: string;
}

export interface StatusDTO {
    created_at: string;
    id: any;
    id_str: string;
    text: string;
    truncated: boolean;
    entities: EntitiesDTO;
    metadata: MetadataDTO;
    source: string;
    in_reply_to_status_id?: any;
    in_reply_to_status_id_str?: any;
    in_reply_to_user_id?: any;
    in_reply_to_user_id_str?: any;
    in_reply_to_screen_name?: any;
    user: UserDTO;
    geo?: any;
    coordinates?: any;
    place?: any;
    contributors?: any;
    is_quote_status: boolean;
    retweet_count: number;
    favorite_count: number;
    favorited: boolean;
    retweeted: boolean;
    possibly_sensitive: boolean;
    lang: string;
    retweeted_status: RetweetedStatusDTO;
}

export interface SearchMetadataDTO {
    completed_in: number;
    max_id: number;
    max_id_str: string;
    next_results: string;
    query: string;
    refresh_url: string;
    count: number;
    since_id: number;
    since_id_str: string;
}

export interface SearchTweetsRespDTO {
    statuses: StatusDTO[];
    search_metadata: SearchMetadataDTO;
}

export interface OAuth2TokenRespDTO {
    token_type: string;
    access_token: string;
}
