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
    versionDate: '2026-11-05T15:50:31.137Z',
    gitCommitHash: 'geaf91c8',
    gitCommitDate: '2026-11-05T15:16:25.000Z',
    versionLong: '0.0.0-geaf91c8',
    gitTag: 'v1.8.0',
};
export default versions;
