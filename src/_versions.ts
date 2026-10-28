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
    versionDate: '2026-10-28T13:23:01.151Z',
    gitCommitHash: 'g8e7f516',
    gitCommitDate: '2026-10-21T19:03:27.000Z',
    versionLong: '0.0.0-g8e7f516',
    gitTag: 'v1.7.5',
};
export default versions;
