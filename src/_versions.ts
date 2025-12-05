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
    versionDate: '2025-12-05T03:00:44.654Z',
    gitCommitHash: 'g7a864c0',
    gitCommitDate: '2025-12-05T00:31:43.000Z',
    versionLong: '0.0.0-g7a864c0',
    gitTag: 'v1.7.0rc1',
};
export default versions;
