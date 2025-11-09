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
    versionDate: '2025-11-09T21:45:30.785Z',
    gitCommitHash: 'g6be71cf',
    gitCommitDate: '2025-11-09T21:27:16.000Z',
    versionLong: '0.0.0-g6be71cf',
    gitTag: 'v1.6.0rc2',
};
export default versions;
