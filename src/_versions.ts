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
    versionDate: '2025-05-11T21:14:56.222Z',
    gitCommitHash: 'g3fa1e90',
    gitCommitDate: '2025-05-09T18:54:45.000Z',
    versionLong: '0.0.0-g3fa1e90',
    gitTag: 'v1.5.0rc1',
};
export default versions;
