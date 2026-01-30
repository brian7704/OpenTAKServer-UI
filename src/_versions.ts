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
    versionDate: '2026-01-30T02:56:27.958Z',
    gitCommitHash: 'g30cde45',
    gitCommitDate: '2026-01-15T04:52:04.000Z',
    versionLong: '0.0.0-g30cde45',
    gitTag: 'v1.7.2',
};
export default versions;
