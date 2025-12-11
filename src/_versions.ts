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
    versionDate: '2025-12-10T20:06:15.853Z',
    gitCommitHash: 'g3cc52c2',
    gitCommitDate: '2025-12-10T19:55:22.000Z',
    versionLong: '0.0.0-g3cc52c2',
    gitTag: 'v1.7.0',
};
export default versions;
