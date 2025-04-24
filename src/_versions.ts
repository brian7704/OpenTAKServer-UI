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
    versionDate: '2025-04-24T04:25:16.818Z',
    gitCommitHash: 'g64bdc96',
    gitCommitDate: '2025-03-30T02:15:33.000Z',
    versionLong: '0.0.0-g64bdc96',
    gitTag: 'v1.5.0rc1',
};
export default versions;
