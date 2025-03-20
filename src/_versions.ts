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
    versionDate: '2025-03-20T16:23:52.202Z',
    gitCommitHash: 'ga7d1f68',
    gitCommitDate: '2025-03-19T13:19:18.000Z',
    versionLong: '0.0.0-ga7d1f68',
    gitTag: 'v1.4.2',
};
export default versions;
