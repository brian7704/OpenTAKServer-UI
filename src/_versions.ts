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
    versionDate: '2025-05-24T15:59:51.373Z',
    gitCommitHash: 'g3a23d98',
    gitCommitDate: '2025-05-21T05:08:04.000Z',
    versionLong: '0.0.0-g3a23d98',
    gitTag: 'v1.5.0rc2',
};
export default versions;
