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
    versionDate: '2024-12-24T04:05:32.845Z',
    gitCommitHash: 'g5ac85fd',
    gitCommitDate: '2024-12-17T15:32:33.000Z',
    versionLong: '0.0.0-g5ac85fd',
    gitTag: 'v1.4.2',
};
export default versions;
