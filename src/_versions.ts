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
    versionDate: '2024-12-17T15:23:31.774Z',
    gitCommitHash: 'ga792eaa',
    gitCommitDate: '2024-11-14T20:13:09.000Z',
    versionLong: '0.0.0-ga792eaa',
    gitTag: 'v1.4.2',
};
export default versions;
