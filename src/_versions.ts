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
    versionDate: '2026-04-24T18:25:40.831Z',
    gitCommitHash: 'g03803d9',
    gitCommitDate: '2026-04-21T15:30:39.000Z',
    versionLong: '0.0.0-g03803d9',
    gitTag: 'v1.7.4',
};
export default versions;
