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
    versionDate: '2026-04-03T20:20:02.811Z',
    gitCommitHash: 'gcadae0e',
    gitCommitDate: '2026-03-20T02:18:59.000Z',
    versionLong: '0.0.0-gcadae0e',
    gitTag: 'v1.7.4',
};
export default versions;
