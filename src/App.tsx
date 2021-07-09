import React, { ReactElement } from 'react';
import { Switch, Route, Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { TwitterSearcher } from './components/twitter-searcher/twitter-searcher.component';
import { PageNotFound } from './components/page-not-found/page-not-found.component';
import { TwitterService } from './services/twitter.service';
import './App.scss';
import { StorageService } from './services/storage.service';

interface AppProps extends RouteComponentProps {
}

interface AppState {
}

class App extends React.Component<AppProps, AppState> {

    private storageService: StorageService;
    private twitterService: TwitterService;

    constructor (props: AppProps) {
        super(props);
        this.storageService = new StorageService();
        this.twitterService = new TwitterService(this.storageService);
    }

    goToPath(path: string): void {
        const { history, location } = this.props;
        let { from } = location.state || { from: { pathname: path } } as any;
        history.replace(from);
    }

    onGotToHomeClick = (): void => {
        this.goToPath('/');
    }

    render(): ReactElement {
        return (
            <div className="app">
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/searcher" />
                    </Route>
                    <Route path="/searcher">
                        <TwitterSearcher storageService={this.storageService} twitterService={this.twitterService}></TwitterSearcher>
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