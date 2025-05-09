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
    versionDate: '2025-05-09T13:17:56.858Z',
    gitCommitHash: 'g6f259d0',
    gitCommitDate: '2025-05-08T19:52:41.000Z',
    versionLong: '0.0.0-g6f259d0',
    gitTag: 'v1.5.0rc1',
};
export default versions;
