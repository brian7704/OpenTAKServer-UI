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
    versionDate: '2026-10-07T21:28:12.971Z',
    gitCommitHash: 'g648690c',
    gitCommitDate: '2026-09-30T00:57:16.000Z',
    versionLong: '0.0.0-g648690c',
    gitTag: 'v1.7.5',
};
export default versions;
