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
    versionDate: '2024-10-04T01:00:13.691Z',
    gitCommitHash: 'g15524f6',
    gitCommitDate: '2024-09-23T20:03:02.000Z',
    versionLong: '0.0.0-g15524f6',
    gitTag: 'v1.3.0',
};
export default versions;
