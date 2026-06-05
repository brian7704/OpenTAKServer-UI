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
    versionDate: '2026-06-05T22:42:45.475Z',
    gitCommitHash: 'ge93ed80',
    gitCommitDate: '2026-05-31T22:25:28.000Z',
    versionLong: '0.0.0-ge93ed80',
    gitTag: 'v1.7.5',
};
export default versions;
