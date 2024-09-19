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
    versionDate: '2024-09-19T18:56:36.004Z',
    gitCommitHash: 'g23e8ea2',
    gitCommitDate: '2024-09-19T15:05:54.000Z',
    versionLong: '0.0.0-g23e8ea2',
    gitTag: 'v1.3.0rc1',
};
export default versions;
