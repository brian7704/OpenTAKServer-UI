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
    versionDate: '2025-08-14T13:29:15.212Z',
    gitCommitHash: 'g54f84c7',
    gitCommitDate: '2025-08-13T21:23:51.000Z',
    versionLong: '0.0.0-g54f84c7',
    gitTag: 'v1.5.1',
};
export default versions;
