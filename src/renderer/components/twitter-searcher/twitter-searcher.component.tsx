/**
 * Main component to search tweets and show the results.
 * 
 * It is made up of the following components:
 *      - "SearchBar": Toolbar to perform a search.
 *      - "TwitterDataTable": Data table to show all results.
 *      - "Toast": A message panel to show errors of the search.
 */

import * as React from 'react';
import { ReactElement } from 'react';
import { Toast } from 'primereact/toast';
import { SearchBar, SearchBarSearchClickEvent } from '../search-bar/search-bar.component';
import { TwitterDataTable } from '../twitter-data-table/twitter-data-table.component';
import './twitter-searcher.component.scss';
import { SearchTweetsRespDTO, StatusDTO } from '_/models/twitter.model';
import { ApiService } from '_/renderer/services/api.service';

// Constants of the component
const TOTAL_TWEETS_TO_SEARCH = 30;

export interface TwitterSearcherProps {
    apiService: ApiService;
}

interface TwitterSearcherState {
}

export class TwitterSearcher extends React.Component<TwitterSearcherProps, TwitterSearcherState> {

    private apiService: ApiService;
    
    private searchBarRef: React.RefObject<SearchBar>;
    private datatableRef: React.RefObject<TwitterDataTable>;
    private toastRef: React.RefObject<Toast>;

    constructor (props: any) {
        super(props);

        this.apiService = props.apiService;

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
            const searchResp: SearchTweetsRespDTO = await this.apiService.invoke('searchTweets', { query: searchValue, count: TOTAL_TWEETS_TO_SEARCH });

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
                <SearchBar apiService={this.apiService} onSearchClick={this.onSearchClickEv} ref={this.searchBarRef}></SearchBar>
                <TwitterDataTable ref={this.datatableRef}></TwitterDataTable>
            </div>
        );
    }

}