/**
 * Data table component to show the results of a search.
 * 
 * Used on the main component "TwitterSearcher".
 * 
 * It is made up of the following components:
 *      - "DataTable": data table to display the list of results (tweets) of a performed search. 
 */

import React, { ReactElement } from 'react';
import { DataTable } from 'primereact/datatable';
import { StatusDTO, TWITTER_REST_DATE_FORMAT } from '../../models/twitter.model';
import { Column } from 'primereact/column';
import moment from 'moment';
import './twitter-data-table.component.scss';

export interface TwitterDataTableProps {
    rowsPerPage?: number;
    tweets?: StatusDTO[];
}

interface TwitterDataTableState {
    loading: boolean,
    tweets: StatusDTO[];
    rowsPerPage: number;
}

// Constants of the component
const DISPLAY_DATE_FORMAT = 'YYYY-MM-DD hh:mm:ss';

export class TwitterDataTable extends React.Component<TwitterDataTableProps, TwitterDataTableState> {

    constructor (props: any) {
        super(props);
        this.state = { 
            loading: false,
            tweets: this.props.tweets ? this.props.tweets : [],
            rowsPerPage: this.props.rowsPerPage != null ? this.props.rowsPerPage : 10 
        };
    }

    private onImageLoadError = (event: any): void => {
        event.target.src='';
    }

    private makeUrlClickables(text: string): string {
        return (text || '').replace(
            /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
            (match: string, space: string, url: string) => {
                let hyperlink = url;
                if (!hyperlink.match('^https?:\/\/')) {
                    hyperlink = 'http://' + hyperlink;
                }
                return space + `<a href="${hyperlink}" style="color: rgb(27, 149, 224)" target="_blank">${url}</a>`;
            }
        );
    }

    private stylizeHastags(text: string): string {
        return (text || '').replace(
            /(?<=[\s>]|^)#(\w*[A-Za-z_]+\w*)\b(?!;)/gi,
            (match: string) => {
                return `<span style="font-style: italic">${match}</span>`;
            }
        );
    }

    private stylizeUsers(text: string): string {
        return (text || '').replace(
            /(?<=[\s>]|^)@(\w*[A-Za-z_]+\w*)\b(?!;)/gi,
            (match: string) => {
                return `<span style="color: rgb(83, 100, 113); font-weight: bold">${match}</span>`;
            }
        );
    }

    private stylizeTweetText(text: string): string {
        let htmlTxt: string = this.makeUrlClickables(text);
        htmlTxt = this.stylizeHastags(htmlTxt);
        htmlTxt = this.stylizeUsers(htmlTxt);
        return htmlTxt;
    }
    
    render(): ReactElement {
        const { loading, tweets, rowsPerPage } = this.state;

        const createdAtBodyTemplate = (rowData: StatusDTO): ReactElement => {
            return <p>{moment(rowData.created_at, TWITTER_REST_DATE_FORMAT).format(DISPLAY_DATE_FORMAT)}</p>;
        }

        const imageBodyTemplate = (rowData: StatusDTO): ReactElement => {
            return <img src={rowData.user.profile_image_url} onError={this.onImageLoadError} />;
        }

        // Done in that way so as to display the text of the tweet more beautiful but 
        // it could be a security vulnerability. Someone could inject html/javascript 
        // code into a tweet. 
        const textBodyTemplate = (rowData: StatusDTO): ReactElement => {
            return <p dangerouslySetInnerHTML={{__html: this.stylizeTweetText(rowData.text)}}></p>
        }

        return (
            <div className="datatable-tweets">
                <div className="card">
                    <DataTable loading={loading} value={tweets} emptyMessage="No tweets found" paginator={true}
                            paginatorPosition='top' paginatorTemplate="CurrentPageReport PrevPageLink NextPageLink"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tweets" 
                            rows={rowsPerPage}>
                        <Column body={createdAtBodyTemplate} header="Created at"></Column>
                        <Column body={imageBodyTemplate} header="Image"></Column>
                        <Column field="user.name" header="Username"></Column>
                        <Column body={textBodyTemplate} header="Text"></Column>
                    </DataTable>
                </div>
            </div>
        );
    }

}