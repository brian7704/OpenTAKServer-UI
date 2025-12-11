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
    versionDate: '2025-12-11T13:42:17.834Z',
    gitCommitHash: 'g05b921e',
    gitCommitDate: '2025-12-11T12:38:52.000Z',
    versionLong: '0.0.0-g05b921e',
    gitTag: 'v1.7.0',
};
export default versions;
