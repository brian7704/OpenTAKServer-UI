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
    versionDate: '2025-08-27T15:54:14.343Z',
    gitCommitHash: 'gf881bd9',
    gitCommitDate: '2025-08-14T15:01:31.000Z',
    versionLong: '0.0.0-gf881bd9',
    gitTag: 'v1.5.2',
};
export default versions;
