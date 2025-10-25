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
    versionDate: '2025-10-25T22:13:55.719Z',
    gitCommitHash: 'g13c2926',
    gitCommitDate: '2025-10-08T19:12:49.000Z',
    versionLong: '0.0.0-g13c2926',
    gitTag: 'v1.5.3',
};
export default versions;
