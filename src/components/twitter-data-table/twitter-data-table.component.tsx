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
    
    render(): ReactElement {
        const { loading, tweets, rowsPerPage } = this.state;

        const createdAtBodyTemplate = (rowData: StatusDTO): ReactElement => {
            return <p>{moment(rowData.created_at, TWITTER_REST_DATE_FORMAT).format(DISPLAY_DATE_FORMAT)}</p>;
        }

        const imageBodyTemplate = (rowData: StatusDTO): ReactElement => {
            return <img src={rowData.user.profile_image_url} onError={this.onImageLoadError} />;
        }

        return (
            <div className="datatable-tweets">
                <div className="card">
                    <DataTable loading={loading} value={tweets} emptyMessage="No tweets found" paginator={true}
                            paginatorPosition='top' paginatorTemplate="CurrentPageReport PrevPageLink NextPageLink"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} first tweets" 
                            rows={rowsPerPage}>
                        <Column body={createdAtBodyTemplate} header="Created at"></Column>
                        <Column body={imageBodyTemplate} header="Image"></Column>
                        <Column field="user.name" header="Username"></Column>
                        <Column field="text" header="Text"></Column>
                    </DataTable>
                </div>
            </div>
        );
    }

}