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
    versionDate: '2024-05-21T20:01:58.374Z',
    gitCommitHash: 'gc1773ff',
    gitCommitDate: '2024-04-26T02:58:53.000Z',
    versionLong: '0.0.0-gc1773ff',
    gitTag: 'v1.1.1',
};
export default versions;
