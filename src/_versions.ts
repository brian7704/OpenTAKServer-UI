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
    versionDate: '2025-05-02T20:44:18.252Z',
    gitCommitHash: 'ge42812d',
    gitCommitDate: '2025-05-01T19:23:59.000Z',
    versionLong: '0.0.0-ge42812d',
    gitTag: 'v1.5.0rc1',
};
export default versions;
