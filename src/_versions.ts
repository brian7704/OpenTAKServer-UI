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
    versionDate: '2024-11-14T20:10:09.875Z',
    gitCommitHash: 'g9a6030f',
    gitCommitDate: '2024-11-14T05:02:47.000Z',
    versionLong: '0.0.0-g9a6030f',
    gitTag: 'v1.4.1',
};
export default versions;
