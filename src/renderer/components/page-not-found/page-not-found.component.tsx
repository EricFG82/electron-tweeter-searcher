/**
 * Component to show a message that page is not found.
 * 
 * It is made up of the following html tags and components:
 *      - Html tag "p": to show the error message.
 *      - "Button": a button to go to the home page.
 */

import * as React from 'react';
import { ReactElement } from 'react';
import { Button } from 'primereact/button';
import './page-not-found.component.scss';

export interface PageNotFoundProps {
    onGotToHomeClick?: () => void;
}

export interface PageNotFoundState {
}

export class PageNotFound extends React.Component<PageNotFoundProps, PageNotFoundState> {

    constructor (props: any) {
        super(props);
    }

    private onGotToHomeClickEv = (): void => {
        const { onGotToHomeClick } = this.props;
        if (onGotToHomeClick) {
            onGotToHomeClick();
        }
    }
    
    render(): ReactElement {
        return (
            <div className="page-not-found-content">
                <i className="pi pi-twitter"></i>
                <p>Oops, you've found a dead link</p>
                <Button label="Go to the home page" className="p-button-rounded" onClick={this.onGotToHomeClickEv} />
            </div>
        );
    }
    
  }