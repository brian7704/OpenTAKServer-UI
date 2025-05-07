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
    versionDate: '2025-05-07T19:33:58.406Z',
    gitCommitHash: 'gf8b0843',
    gitCommitDate: '2025-05-02T20:50:58.000Z',
    versionLong: '0.0.0-gf8b0843',
    gitTag: 'v1.5.0rc1',
};
export default versions;
