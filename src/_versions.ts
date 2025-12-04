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
    versionDate: '2025-12-04T19:49:27.258Z',
    gitCommitHash: 'g444635c',
    gitCommitDate: '2025-12-04T05:43:19.000Z',
    versionLong: '0.0.0-g444635c',
    gitTag: 'v1.7.0rc1',
};
export default versions;
