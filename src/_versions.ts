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
    versionDate: '2026-01-03T03:25:31.159Z',
    gitCommitHash: 'g399010f',
    gitCommitDate: '2025-12-30T21:08:28.000Z',
    versionLong: '0.0.0-g399010f',
    gitTag: 'v1.7.1',
};
export default versions;
