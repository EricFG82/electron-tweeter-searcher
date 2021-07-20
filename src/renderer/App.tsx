/**
 * Main application component
 * 
 * Taking in mind that this application will evolve 
 * in the future, this component is prepared for that 
 * by using a routing mechanism. 
 */

import * as React from 'react';
import { ReactElement } from 'react';
import { Route, Redirect, RouteComponentProps, withRouter, Switch } from 'react-router-dom';
import { TwitterSearcher } from './components/twitter-searcher/twitter-searcher.component';
import { PageNotFound } from './components/page-not-found/page-not-found.component';
import { TwitterApiService } from './services/twitter-api.service';
import { SearchesStorageApiService } from './services/searches-storage-api.service';
import './App.scss';

interface AppProps extends RouteComponentProps {
}

interface AppState {
}

class App extends React.Component<AppProps, AppState> {

    private twitterApiService: TwitterApiService;
    private searchesStorageApiService: SearchesStorageApiService;

    constructor (props: AppProps) {
        super(props);

        this.twitterApiService = new TwitterApiService();
        this.searchesStorageApiService = new SearchesStorageApiService();

        this.goToHomePath();
    }

    private goToPath(path: string): void {
        const { history, location } = this.props;
        let { from } = location.state || { from: { pathname: path } } as any;
        history.replace(from);
    }

    private goToHomePath() {
        this.goToPath('/');
    }

    private onGotToHomeClick = (): void => {
        this.goToHomePath();
    }

    render(): ReactElement {
        return (
            <div className="app">
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/searcher" />
                    </Route>
                    <Route path="/searcher">
                        <TwitterSearcher twitterApiService={this.twitterApiService}  searchesStorageApiService={this.searchesStorageApiService}></TwitterSearcher>
                    </Route>
                    <Route path="*">
                        <PageNotFound onGotToHomeClick={this.onGotToHomeClick}></PageNotFound>
                    </Route>
                </Switch>
            </div>
        );
    }

}

export default withRouter(App);