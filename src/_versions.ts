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
    versionDate: '2026-10-20T20:47:07.355Z',
    gitCommitHash: 'g4899482',
    gitCommitDate: '2026-10-20T19:02:17.000Z',
    versionLong: '0.0.0-g4899482',
    gitTag: 'v1.7.5',
};
export default versions;
