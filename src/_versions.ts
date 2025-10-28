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
    versionDate: '2025-10-28T19:52:03.001Z',
    gitCommitHash: 'gb5a69d5',
    gitCommitDate: '2025-10-25T22:21:31.000Z',
    versionLong: '0.0.0-gb5a69d5',
    gitTag: 'v1.5.3',
};
export default versions;
