import { initCommonIPC } from './ipcCommon';
import { initCompressorIPC } from './ipcCompressor';
import { initConverterIPC } from './ipcConverter';

export function initializeIPC() {
    initCommonIPC();
    initCompressorIPC();
    initConverterIPC();
}