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
    versionDate: '2025-10-08T19:10:37.713Z',
    gitCommitHash: 'gdfa1d82',
    gitCommitDate: '2025-09-24T13:40:30.000Z',
    versionLong: '0.0.0-gdfa1d82',
    gitTag: 'v1.5.3',
};
export default versions;
