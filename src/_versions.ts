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
    versionDate: '2025-05-15T19:03:46.237Z',
    gitCommitHash: 'g513f2e6',
    gitCommitDate: '2025-05-15T18:42:48.000Z',
    versionLong: '0.0.0-g513f2e6',
    gitTag: 'v1.5.0rc1',
};
export default versions;
