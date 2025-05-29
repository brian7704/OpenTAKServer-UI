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
    versionDate: '2025-05-29T04:38:38.167Z',
    gitCommitHash: 'g7749bbb',
    gitCommitDate: '2025-05-24T16:15:17.000Z',
    versionLong: '0.0.0-g7749bbb',
    gitTag: 'v1.5.0rc2',
};
export default versions;
