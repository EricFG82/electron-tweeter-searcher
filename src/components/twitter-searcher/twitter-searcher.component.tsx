/**
 * Main component to search tweets and show the results.
 * 
 * It is made up of the following components:
 *      - "SearchBar": Toolbar to perform a search.
 *      - "TwitterDataTable": Data table to show all results.
 *      - "Toast": A message panel to show errors of the search.
 */

import React, { ReactElement } from 'react';
import { Toast } from 'primereact/toast';
import { SearchTweetsRespDTO, StatusDTO } from '../../models/twitter.model';
import { StorageService } from '../../services/storage.service';
import { TwitterService } from '../../services/twitter.service';
import { SearchBar, SearchBarSearchClickEvent } from '../search-bar/search-bar.component';
import { TwitterDataTable } from '../twitter-data-table/twitter-data-table.component';
import './twitter-searcher.component.scss';

// Constants of the component
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
    private toastRef: React.RefObject<Toast>;

    constructor (props: any) {
        super(props);
        
        this.storageService = this.props.storageService;
        this.twitterService = this.props.twitterService;

        this.datatableRef = React.createRef<TwitterDataTable>();
        this.searchBarRef = React.createRef<SearchBar>();
        this.toastRef = React.createRef<Toast>();
    }

    private sanitizeSearch(searchValue: string): string {
        if (searchValue) {
            return searchValue.replace('@', 'from:');
        }
        return searchValue;
    }
 
    private onSearchClickEv = async (event: SearchBarSearchClickEvent): Promise<any> => {
        let tweets: StatusDTO[] = [];
        try {
            const searchValue: string = this.sanitizeSearch(event.searchValue);

            // Set states of child components (SearchBar and DataTable component)
            this.searchBarRef.current?.setState({ loading: true });
            this.datatableRef.current?.setState({ loading: true });

            // Search tweets by using the Twitter REST API
            const searchResp: SearchTweetsRespDTO = await this.twitterService.searchTweets(searchValue, TOTAL_TWEETS_TO_SEARCH);

            tweets = searchResp.statuses;

        } catch (error: any) {
            this.toastRef.current?.show({ severity:'error', summary: 'Error', detail: `${error}`, life: 3000 });
        } finally {
            // Set states of child components (SearchBar and DataTable component)
            this.searchBarRef.current?.setState({ loading: false });
            this.datatableRef.current?.setState({ loading: false, tweets: tweets });
        }
    }
    
    render(): ReactElement {
        return (
            <div className="tweets-searcher">
                <Toast ref={this.toastRef} />
                <SearchBar storageService={this.storageService} onSearchClick={this.onSearchClickEv} ref={this.searchBarRef}></SearchBar>
                <TwitterDataTable ref={this.datatableRef}></TwitterDataTable>
            </div>
        );
    }

}