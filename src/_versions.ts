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
    versionDate: '2026-02-18T20:57:08.296Z',
    gitCommitHash: 'g9eaf822',
    gitCommitDate: '2026-02-05T20:34:15.000Z',
    versionLong: '0.0.0-g9eaf822',
    gitTag: 'v1.7.3',
};
export default versions;
