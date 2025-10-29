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
    versionDate: '2025-10-29T03:51:08.927Z',
    gitCommitHash: 'gccdf95c',
    gitCommitDate: '2025-10-28T20:45:52.000Z',
    versionLong: '0.0.0-gccdf95c',
    gitTag: 'v1.5.3',
};
export default versions;
