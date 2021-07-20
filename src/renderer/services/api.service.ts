/**
 * IPC Electron service base
 * 
 * Used to call exposed methods of Electron ipcRenderer.
 * Done in that way for security reasons.
 * 
 * See for more details comments of files: 
 * /src/main/main.ts
 * /src/electron.preload.js
 */

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

    protected invoke(channel: string, data: any): Promise<any> {
        return this.api.invoke(channel, data);
    }

    protected sendSync(channel: string, data: any): any {
        return this.api.sendSync(channel, data);
    }

    protected send(channel: string, data: any): void {
        this.api.send(channel, data);
    }

    protected receive(channel: string, data: any): void {
        this.api.receive(channel, data);
    }

}
