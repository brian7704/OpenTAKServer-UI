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
    versionDate: '2024-06-11T19:57:05.255Z',
    gitCommitHash: 'ga101862',
    gitCommitDate: '2024-06-10T21:32:59.000Z',
    versionLong: '0.0.0-ga101862',
    gitTag: 'v1.1.1',
};
export default versions;
