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
    versionDate: '2026-10-08T19:57:14.360Z',
    gitCommitHash: 'gb38fa9e',
    gitCommitDate: '2026-10-07T21:30:32.000Z',
    versionLong: '0.0.0-gb38fa9e',
    gitTag: 'v1.7.5',
};
export default versions;
