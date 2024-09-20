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
    versionDate: '2024-09-20T03:04:26.403Z',
    gitCommitHash: 'g97101e9',
    gitCommitDate: '2024-09-20T02:42:26.000Z',
    versionLong: '0.0.0-g97101e9',
    gitTag: 'v1.3.0rc1',
};
export default versions;
