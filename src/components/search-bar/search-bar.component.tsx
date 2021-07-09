import React, { ReactElement } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ListBox, ListBoxChangeParams } from 'primereact/listbox';
import { StorageService } from '../../services/storage.service';
import './search-bar.component.scss';

export interface SearchBarSearchClickEvent extends Event {
    searchValue: string; 
}

export interface SearchBarProps {
    storageService: StorageService;
    onSearchClick?: (event: SearchBarSearchClickEvent) => void;
}

interface SearchBarState {
    searchValue: string;
    loading: boolean;
    recentSearches: RecentSearchStorage[];
}

interface RecentSearchStorage {
    search: string;
}

const STORAGE_RECENT_SEARCHES_KEY = 'TWITTER_RECENT_SEARCHES';

export class SearchBar extends React.Component<SearchBarProps, SearchBarState> {

    private storageService: StorageService;
    private overtlayPanelRef: React.RefObject<OverlayPanel>;

    constructor (props: any) {
        super(props);

        this.storageService = this.props.storageService;
        this.overtlayPanelRef = React.createRef<OverlayPanel>();

        this.state = { searchValue: '', loading: false, recentSearches: this.loadRecentSearches() };
    }

    private isSearchValueValid(searchValue: string): boolean {
        return (searchValue != null && searchValue.trim() != '');
    }

    private onSearchTextFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
        const { recentSearches } = this.state;
        if (recentSearches.length > 0) {
            this.overtlayPanelRef.current?.show(event, event.target);
        }
    }

    private onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { recentSearches } = this.state;
        this.setState({ searchValue: event.target.value });
        if (recentSearches.length > 0) {
            this.overtlayPanelRef.current?.show(event, event.target);
        }
    }

    private loadRecentSearches(): RecentSearchStorage[] {
        const data: RecentSearchStorage[] = this.storageService.getAsObj(STORAGE_RECENT_SEARCHES_KEY);
        return (data ? data : []);
    }

    private saveSearchValue(searchValue: string): void {
        const { recentSearches } = this.state;
        while (recentSearches.length >= 5) {
            recentSearches.pop();
        }
        recentSearches.unshift({ search: searchValue });
        this.storageService.set(STORAGE_RECENT_SEARCHES_KEY, recentSearches);
    }

    private search(searchValue: string): void {
        const { onSearchClick } = this.props;
        if (this.isSearchValueValid(searchValue)) {
            this.overtlayPanelRef.current?.hide();
            this.saveSearchValue(searchValue);
            if (onSearchClick) {
                onSearchClick({ searchValue: searchValue } as SearchBarSearchClickEvent);
            }
        }
    }

    private onSearchClickEv = (): void => {
        const { searchValue } = this.state;
        this.search(searchValue);
    }

    private onSearchKeyDownEv = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key == 'Enter') {
            event.preventDefault();
            this.onSearchClickEv();
        }
    }

    private onRecentSearchClick = (event: ListBoxChangeParams): void => {
        const searchValue: string = event.value.search;
        this.setState({ searchValue: searchValue }); 
        this.search(searchValue);
    }
    
    render(): ReactElement {
        const { searchValue, loading, recentSearches } = this.state;
        const leftContents: ReactElement = (
            <React.Fragment>
                <i className="pi pi-twitter twitter-logo" style={{'fontSize': '40px', 'color': 'rgb(29, 161, 242)'}}></i>
                <InputText autoFocus={true} disabled={loading} className="p-d-block" style={{'width': '300px'}}  placeholder="Search Twitter" 
                    value={searchValue} onChange={this.onSearchInputChange} onKeyDown={this.onSearchKeyDownEv} onFocus={this.onSearchTextFocus} />
                <Button disabled={loading || !this.isSearchValueValid(searchValue)} icon="pi pi-search" className="p-mr-2" 
                    onClick={this.onSearchClickEv} />
            </React.Fragment>
        );
        return (
            <div className="search-bar">
                <Toolbar left={leftContents} />
                <OverlayPanel ref={this.overtlayPanelRef} showCloseIcon={false} id="overlay_panel" style={{width: '450px'}} 
                    className="overlaypanel-recent-searches">
                    <b>Recent</b>
                    <ListBox options={recentSearches} optionLabel="search" style={{ width: '100%', border: 'none' }} onChange={this.onRecentSearchClick} />
                </OverlayPanel>
            </div>
        );
    }

}