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
    versionDate: '2025-12-05T15:36:59.149Z',
    gitCommitHash: 'g7ed56fd',
    gitCommitDate: '2025-12-05T03:20:19.000Z',
    versionLong: '0.0.0-g7ed56fd',
    gitTag: 'v1.7.0rc1',
};
export default versions;
