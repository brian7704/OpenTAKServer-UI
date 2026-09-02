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
    versionDate: '2026-06-11T12:59:56.934Z',
    gitCommitHash: 'gb212505',
    gitCommitDate: '2026-06-10T13:18:03.000Z',
    versionLong: '0.0.0-gb212505',
    gitTag: 'v1.7.5',
};
export default versions;
