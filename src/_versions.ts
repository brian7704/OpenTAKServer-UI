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
    versionDate: '2025-05-01T19:08:38.246Z',
    gitCommitHash: 'gd14de61',
    gitCommitDate: '2025-05-01T18:45:12.000Z',
    versionLong: '0.0.0-gd14de61',
    gitTag: 'v1.5.0rc1',
};
export default versions;
