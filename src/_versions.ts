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
    versionDate: '2024-04-25T04:35:31.050Z',
    gitCommitHash: 'g3b01e44',
    gitCommitDate: '2024-04-05T14:30:30.000Z',
    versionLong: '0.0.0-g3b01e44',
    gitTag: 'v1.1.1',
};
export default versions;
