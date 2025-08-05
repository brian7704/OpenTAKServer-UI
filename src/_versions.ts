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
    versionDate: '2025-08-05T23:41:24.585Z',
    gitCommitHash: 'gf121886',
    gitCommitDate: '2025-07-15T19:20:05.000Z',
    versionLong: '0.0.0-gf121886',
    gitTag: 'v1.5.0rc3',
};
export default versions;
