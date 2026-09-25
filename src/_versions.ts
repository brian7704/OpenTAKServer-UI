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
    versionDate: '2026-09-25T21:06:28.584Z',
    gitCommitHash: 'g52007a3',
    gitCommitDate: '2026-09-25T04:02:00.000Z',
    versionLong: '0.0.0-g52007a3',
    gitTag: 'v1.7.5',
};
export default versions;
