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
    versionDate: '2025-12-30T21:06:33.338Z',
    gitCommitHash: 'g2d9b620',
    gitCommitDate: '2025-12-30T20:54:35.000Z',
    versionLong: '0.0.0-g2d9b620',
    gitTag: 'v1.7.1',
};
export default versions;
