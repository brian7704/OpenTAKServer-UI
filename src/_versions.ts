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
    versionDate: '2026-02-05T20:24:35.809Z',
    gitCommitHash: 'g5a10800',
    gitCommitDate: '2026-01-30T05:20:07.000Z',
    versionLong: '0.0.0-g5a10800',
    gitTag: 'v1.7.3rc1',
};
export default versions;
