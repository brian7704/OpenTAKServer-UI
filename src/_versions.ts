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
    versionDate: '2026-06-10T04:45:24.599Z',
    gitCommitHash: 'ga7dc853',
    gitCommitDate: '2026-06-05T22:46:44.000Z',
    versionLong: '0.0.0-ga7dc853',
    gitTag: 'v1.7.5',
};
export default versions;
