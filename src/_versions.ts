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
    versionDate: '2025-12-04T20:24:29.476Z',
    gitCommitHash: 'g2fcc36d',
    gitCommitDate: '2025-12-04T19:50:03.000Z',
    versionLong: '0.0.0-g2fcc36d',
    gitTag: 'v1.7.0rc1',
};
export default versions;
