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
    versionDate: '2024-06-10T21:30:25.776Z',
    gitCommitHash: 'g09ff442',
    gitCommitDate: '2024-06-10T21:23:13.000Z',
    versionLong: '0.0.0-g09ff442',
    gitTag: 'v1.1.1',
};
export default versions;
