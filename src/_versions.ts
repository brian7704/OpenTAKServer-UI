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
    versionDate: '2025-05-01T19:22:15.388Z',
    gitCommitHash: 'gcfb5c6c',
    gitCommitDate: '2025-05-01T19:10:25.000Z',
    versionLong: '0.0.0-gcfb5c6c',
    gitTag: 'v1.5.0rc1',
};
export default versions;
