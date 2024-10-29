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
    versionDate: '2024-10-29T03:23:42.940Z',
    gitCommitHash: 'g3a0ace3',
    gitCommitDate: '2024-10-22T13:48:35.000Z',
    versionLong: '0.0.0-g3a0ace3',
    gitTag: 'v1.4.0rc1',
};
export default versions;
