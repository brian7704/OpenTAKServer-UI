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
    versionDate: '2025-10-31T18:54:31.377Z',
    gitCommitHash: 'g7792fc7',
    gitCommitDate: '2025-10-31T18:52:00.000Z',
    versionLong: '0.0.0-g7792fc7',
    gitTag: 'v1.5.3',
};
export default versions;
