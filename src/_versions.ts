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
    versionDate: '2025-12-04T04:33:39.484Z',
    gitCommitHash: 'gfc8f3c3',
    gitCommitDate: '2025-11-21T21:07:59.000Z',
    versionLong: '0.0.0-gfc8f3c3',
    gitTag: 'v1.6.0',
};
export default versions;
