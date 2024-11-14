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
    versionDate: '2024-11-14T04:58:35.176Z',
    gitCommitHash: 'gf350eb6',
    gitCommitDate: '2024-11-13T03:32:10.000Z',
    versionLong: '0.0.0-gf350eb6',
    gitTag: 'v1.4.0',
};
export default versions;
