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
    versionDate: '2025-09-11T15:41:53.375Z',
    gitCommitHash: 'g350e033',
    gitCommitDate: '2025-08-27T15:58:43.000Z',
    versionLong: '0.0.0-g350e033',
    gitTag: 'v1.5.3',
};
export default versions;
