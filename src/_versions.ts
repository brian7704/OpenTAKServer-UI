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
    versionDate: '2024-10-16T13:00:44.095Z',
    gitCommitHash: 'g7e2d033',
    gitCommitDate: '2024-10-04T01:33:49.000Z',
    versionLong: '0.0.0-g7e2d033',
    gitTag: 'v1.3.0',
};
export default versions;
