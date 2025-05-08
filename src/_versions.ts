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
    versionDate: '2025-05-08T17:33:12.811Z',
    gitCommitHash: 'gef48134',
    gitCommitDate: '2025-05-07T19:37:14.000Z',
    versionLong: '0.0.0-gef48134',
    gitTag: 'v1.5.0rc1',
};
export default versions;
