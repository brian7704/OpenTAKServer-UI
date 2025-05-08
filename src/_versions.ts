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
    versionDate: '2025-05-08T19:46:38.676Z',
    gitCommitHash: 'g134d0a9',
    gitCommitDate: '2025-05-08T17:38:56.000Z',
    versionLong: '0.0.0-g134d0a9',
    gitTag: 'v1.5.0rc1',
};
export default versions;
