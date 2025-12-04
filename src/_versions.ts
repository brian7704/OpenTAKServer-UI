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
    versionDate: '2025-12-04T05:41:48.472Z',
    gitCommitHash: 'ge213e76',
    gitCommitDate: '2025-12-04T05:02:13.000Z',
    versionLong: '0.0.0-ge213e76',
    gitTag: 'v1.7.0rc1',
};
export default versions;
