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
    versionDate: '2025-10-28T23:00:04.857Z',
    gitCommitHash: 'gd80daaa',
    gitCommitDate: '2025-10-21T23:03:54.000Z',
    versionLong: '0.0.0-gd80daaa',
    gitTag: 'v1.5.3',
};
export default versions;
