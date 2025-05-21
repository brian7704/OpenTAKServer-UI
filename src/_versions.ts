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
    versionDate: '2025-05-21T04:53:59.108Z',
    gitCommitHash: 'gf8cb4b8',
    gitCommitDate: '2025-05-16T20:41:35.000Z',
    versionLong: '0.0.0-gf8cb4b8',
    gitTag: 'v1.5.0rc1',
};
export default versions;
