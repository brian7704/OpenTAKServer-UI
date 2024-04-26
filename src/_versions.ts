export interface TsAppVersion {
    version: string;
    name: string;
    description?: string;
    versionLong?: string;
    versionDate: string;
    gitCommitHash?: string;
    gitCommitDate?: string;
    gitTag?: string;
};
export const versions: TsAppVersion = {
    version: '0.0.0',
    name: 'opentakserver-ui',
    versionDate: '2024-04-26T02:55:26.578Z',
    gitCommitHash: 'gdb94e6a',
    gitCommitDate: '2024-04-25T20:20:56.000Z',
    versionLong: '0.0.0-gdb94e6a',
    gitTag: 'v1.1.1',
};
export default versions;
