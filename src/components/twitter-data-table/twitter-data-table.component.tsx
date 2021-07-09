import React, { ReactElement } from 'react';
import { DataTable } from 'primereact/datatable';
import { StatusDTO } from '../../models/twitter.model';
import { Column } from 'primereact/column';
import './twitter-data-table.component.scss';

export interface TwitterDataTableProps {
    tweets?: StatusDTO[];
}

interface TwitterDataTableState {
    loading: boolean,
    tweets: StatusDTO[];
}

export class TwitterDataTable extends React.Component<TwitterDataTableProps, TwitterDataTableState> {

    constructor (props: any) {
        super(props);
        this.state = { 
            loading: false,
            tweets: this.props.tweets ? this.props.tweets : [] 
        };
    }
    
    render(): ReactElement {
        const { loading, tweets } = this.state;

        const imageBodyTemplate = (rowData: StatusDTO) => {
            return <img src={rowData.user.profile_image_url} onError={(e: any) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />;
        }

        return (
            <div className="datatable-tweets">
                <div className="card">
                    <DataTable loading={loading} value={tweets} emptyMessage="No tweets found" paginator={true}
                            paginatorPosition='top' paginatorTemplate="CurrentPageReport PrevPageLink NextPageLink"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tweets" rows={10} 
                            rowsPerPageOptions={[10,20,50]}>
                        <Column field="created_at" header="Created at"></Column>
                        <Column body={imageBodyTemplate} header="Image"></Column>
                        <Column field="user.name" header="Username"></Column>
                        <Column field="text" header="Text"></Column>
                    </DataTable>
                </div>
            </div>
        );
    }

}