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
    versionDate: '2026-05-14T22:12:51.941Z',
    gitCommitHash: 'g3e78690',
    gitCommitDate: '2026-05-14T21:19:24.000Z',
    versionLong: '0.0.0-g3e78690',
    gitTag: 'v1.7.4',
};
export default versions;
