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
    versionDate: '2025-08-05T23:49:22.795Z',
    gitCommitHash: 'gc319224',
    gitCommitDate: '2025-08-05T23:46:42.000Z',
    versionLong: '0.0.0-gc319224',
    gitTag: 'v1.5.1',
};
export default versions;
