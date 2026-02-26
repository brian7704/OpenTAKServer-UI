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
    versionDate: '2026-02-26T21:41:42.541Z',
    gitCommitHash: 'g368327e',
    gitCommitDate: '2026-02-26T15:23:17.000Z',
    versionLong: '0.0.0-g368327e',
    gitTag: 'v1.7.3',
};
export default versions;
