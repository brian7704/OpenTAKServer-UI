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
    versionDate: '2024-12-24T15:47:06.509Z',
    gitCommitHash: 'g5458ce3',
    gitCommitDate: '2024-12-24T04:47:17.000Z',
    versionLong: '0.0.0-g5458ce3',
    gitTag: 'v1.4.2',
};
export default versions;
