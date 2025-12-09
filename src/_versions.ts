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
    versionDate: '2025-12-09T14:48:11.669Z',
    gitCommitHash: 'g2d85c6c',
    gitCommitDate: '2025-12-09T04:16:47.000Z',
    versionLong: '0.0.0-g2d85c6c',
    gitTag: 'v1.7.0rc1',
};
export default versions;
