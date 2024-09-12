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
    versionDate: '2024-09-12T18:03:14.823Z',
    gitCommitHash: 'g9480cfc',
    gitCommitDate: '2024-09-12T17:31:51.000Z',
    versionLong: '0.0.0-g9480cfc',
    gitTag: 'v1.2.0',
};
export default versions;
