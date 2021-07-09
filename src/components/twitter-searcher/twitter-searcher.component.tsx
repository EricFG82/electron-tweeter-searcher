import React, { ReactElement } from 'react';
import { SearchTweetsRespDTO } from '../../models/twitter.model';
import { StorageService } from '../../services/storage.service';
import { TwitterService } from '../../services/twitter.service';
import { SearchBar, SearchBarSearchClickEvent } from '../search-bar/search-bar.component';
import { TwitterDataTable } from '../twitter-data-table/twitter-data-table.component';
import './twitter-searcher.component.scss';

// Constants
const TOTAL_TWEETS_TO_SEARCH = 30;

export interface TwitterSearcherProps {
    storageService: StorageService;
    twitterService: TwitterService;
}

interface TwitterSearcherState {
}

export class TwitterSearcher extends React.Component<TwitterSearcherProps, TwitterSearcherState> {

    private storageService: StorageService;
    private twitterService: TwitterService;
    private searchBarRef: React.RefObject<SearchBar>;
    private datatableRef: React.RefObject<TwitterDataTable>;

    constructor (props: any) {
        super(props);
        
        this.storageService = this.props.storageService;
        this.twitterService = this.props.twitterService;

        this.datatableRef = React.createRef<TwitterDataTable>();
        this.searchBarRef = React.createRef<SearchBar>();
    }

    private onSearchClickEv = async (event: SearchBarSearchClickEvent) => {
        try {
            this.datatableRef.current?.setState({ loading: true });
            this.searchBarRef.current?.setState({ loading: true });

            const token: string = await this.twitterService.getOAuth2BearerToken();
            const searchResp: SearchTweetsRespDTO = await this.twitterService.searchTweets(token, event.searchValue, TOTAL_TWEETS_TO_SEARCH);
            
            this.datatableRef.current?.setState({ loading: false, tweets: searchResp.statuses });
            this.searchBarRef.current?.setState({ loading: false });
        } catch (error) {
            console.error('Error: ', error); // TODO: show a message to the user
        }
    }
    
    render(): ReactElement {
        return (
            <div className="tweets-searcher">
                <SearchBar storageService={this.storageService} onSearchClick={this.onSearchClickEv} ref={this.searchBarRef}></SearchBar>
                <TwitterDataTable ref={this.datatableRef}></TwitterDataTable>
            </div>
        );
    }

}