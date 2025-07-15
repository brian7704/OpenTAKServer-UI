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
    versionDate: '2025-07-15T18:50:12.937Z',
    gitCommitHash: 'g512cd46',
    gitCommitDate: '2025-07-15T18:44:46.000Z',
    versionLong: '0.0.0-g512cd46',
    gitTag: 'v1.5.0rc3',
};
export default versions;
