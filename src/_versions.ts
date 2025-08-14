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
    versionDate: '2025-08-14T13:45:58.029Z',
    gitCommitHash: 'gb78d377',
    gitCommitDate: '2025-08-14T13:36:38.000Z',
    versionLong: '0.0.0-gb78d377',
    gitTag: 'v1.5.1',
};
export default versions;
