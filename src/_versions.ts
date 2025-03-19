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
    versionDate: '2025-03-19T13:12:26.447Z',
    gitCommitHash: 'gc86d427',
    gitCommitDate: '2025-03-18T17:13:49.000Z',
    versionLong: '0.0.0-gc86d427',
    gitTag: 'v1.4.2',
};
export default versions;
