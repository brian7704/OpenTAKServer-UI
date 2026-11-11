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
    versionDate: '2026-11-11T02:03:13.768Z',
    gitCommitHash: 'gd822e25',
    gitCommitDate: '2026-11-11T01:51:09.000Z',
    versionLong: '0.0.0-gd822e25',
    gitTag: 'v1.8.1',
};
export default versions;
