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
    versionDate: '2026-05-31T22:22:44.594Z',
    gitCommitHash: 'gbbe538f',
    gitCommitDate: '2026-05-31T21:34:58.000Z',
    versionLong: '0.0.0-gbbe538f',
    gitTag: 'v1.7.5',
};
export default versions;
