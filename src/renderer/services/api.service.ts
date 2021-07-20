interface Api {
    invoke(channel: string, data: any): Promise<any>;
    sendSync(channel: string, data: any): any;
    send(channel: string, data: any): void;
    receive(channel: string, func: (args: any) => {}): void;
}

export class ApiService {

    private api: Api;

    constructor() {
        this.api = (window as any).api;
    }

    invoke(channel: string, data: any): Promise<any> {
        return this.api.invoke(channel, data);
    }

    sendSync(channel: string, data: any): any {
        return this.api.sendSync(channel, data);
    }

    send(channel: string, data: any): void {
        this.api.send(channel, data);
    }

    receive(channel: string, data: any): void {
        this.api.receive(channel, data);
    }

}
