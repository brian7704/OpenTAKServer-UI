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
    versionDate: '2024-10-18T03:22:38.216Z',
    gitCommitHash: 'gbc7a9ba',
    gitCommitDate: '2024-10-18T01:32:43.000Z',
    versionLong: '0.0.0-gbc7a9ba',
    gitTag: 'v1.3.0',
};
export default versions;
