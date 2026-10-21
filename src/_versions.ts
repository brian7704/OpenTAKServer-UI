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
    versionDate: '2026-10-21T19:01:09.850Z',
    gitCommitHash: 'ge227c3f',
    gitCommitDate: '2026-10-20T20:59:03.000Z',
    versionLong: '0.0.0-ge227c3f',
    gitTag: 'v1.7.5',
};
export default versions;
