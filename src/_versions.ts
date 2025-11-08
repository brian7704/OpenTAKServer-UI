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
    versionDate: '2025-11-08T17:00:05.405Z',
    gitCommitHash: 'g4677314',
    gitCommitDate: '2025-11-08T01:18:38.000Z',
    versionLong: '0.0.0-g4677314',
    gitTag: 'v1.6.0rc1',
};
export default versions;
