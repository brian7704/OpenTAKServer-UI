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
    versionDate: '2024-09-21T22:03:14.259Z',
    gitCommitHash: 'gbe01a7d',
    gitCommitDate: '2024-09-20T13:23:45.000Z',
    versionLong: '0.0.0-gbe01a7d',
    gitTag: 'v1.3.0rc2',
};
export default versions;
