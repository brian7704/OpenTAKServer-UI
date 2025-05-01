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
    versionDate: '2025-05-01T17:11:23.076Z',
    gitCommitHash: 'gbe1ae50',
    gitCommitDate: '2025-05-01T13:18:20.000Z',
    versionLong: '0.0.0-gbe1ae50',
    gitTag: 'v1.5.0rc1',
};
export default versions;
