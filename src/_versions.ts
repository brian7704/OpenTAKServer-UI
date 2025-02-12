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
    versionDate: '2025-02-12T01:20:42.174Z',
    gitCommitHash: 'g75bcf09',
    gitCommitDate: '2024-12-24T15:50:45.000Z',
    versionLong: '0.0.0-g75bcf09',
    gitTag: 'v1.4.2',
};
export default versions;
