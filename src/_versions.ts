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
    versionDate: '2025-11-13T16:12:19.172Z',
    gitCommitHash: 'g83d2e9e',
    gitCommitDate: '2025-11-13T16:11:41.000Z',
    versionLong: '0.0.0-g83d2e9e',
    gitTag: 'v1.6.0',
};
export default versions;
