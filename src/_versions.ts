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
    versionDate: '2024-09-20T13:16:21.241Z',
    gitCommitHash: 'g1624544',
    gitCommitDate: '2024-09-20T03:07:05.000Z',
    versionLong: '0.0.0-g1624544',
    gitTag: 'v1.3.0rc1',
};
export default versions;
