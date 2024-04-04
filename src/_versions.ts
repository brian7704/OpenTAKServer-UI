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
    versionDate: '2024-04-04T15:16:14.389Z',
    gitCommitHash: 'gdf413d7',
    gitCommitDate: '2024-04-04T14:35:33.000Z',
    versionLong: '0.0.0-gdf413d7',
    gitTag: 'v1.0.0',
};
export default versions;
