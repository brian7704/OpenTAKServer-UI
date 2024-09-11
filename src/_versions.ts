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
    versionDate: '2024-09-11T02:45:20.485Z',
    gitCommitHash: 'g4db5690',
    gitCommitDate: '2024-09-10T21:39:47.000Z',
    versionLong: '0.0.0-g4db5690',
    gitTag: 'v1.2.0',
};
export default versions;
