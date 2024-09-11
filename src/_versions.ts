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
    versionDate: '2024-09-11T15:08:32.347Z',
    gitCommitHash: 'g9cad299',
    gitCommitDate: '2024-09-11T02:51:58.000Z',
    versionLong: '0.0.0-g9cad299',
    gitTag: 'v1.2.0',
};
export default versions;
