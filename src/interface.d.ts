export interface IElectronAPI {
    notify: (message: string) => Promise<void>;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}