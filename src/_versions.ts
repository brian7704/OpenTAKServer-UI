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
    versionDate: '2025-08-13T21:21:04.777Z',
    gitCommitHash: 'g04c714c',
    gitCommitDate: '2025-08-05T23:50:53.000Z',
    versionLong: '0.0.0-g04c714c',
    gitTag: 'v1.5.1',
};
export default versions;
