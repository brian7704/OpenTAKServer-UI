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
    versionDate: '2025-05-01T13:11:33.229Z',
    gitCommitHash: 'gf254a24',
    gitCommitDate: '2025-04-29T20:04:03.000Z',
    versionLong: '0.0.0-gf254a24',
    gitTag: 'v1.5.0rc1',
};
export default versions;
