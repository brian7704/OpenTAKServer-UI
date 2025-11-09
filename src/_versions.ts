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
    versionDate: '2025-11-09T21:24:53.766Z',
    gitCommitHash: 'g7c93dbc',
    gitCommitDate: '2025-11-09T17:14:10.000Z',
    versionLong: '0.0.0-g7c93dbc',
    gitTag: 'v1.6.0rc2',
};
export default versions;
