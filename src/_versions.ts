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
    versionDate: '2025-02-12T03:52:53.216Z',
    gitCommitHash: 'gdea346c',
    gitCommitDate: '2025-02-12T03:17:15.000Z',
    versionLong: '0.0.0-gdea346c',
    gitTag: 'v1.4.2',
};
export default versions;
