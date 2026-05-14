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
    versionDate: '2026-05-14T18:32:52.289Z',
    gitCommitHash: 'ga2ccf37',
    gitCommitDate: '2026-05-07T17:31:08.000Z',
    versionLong: '0.0.0-ga2ccf37',
    gitTag: 'v1.7.4',
};
export default versions;
