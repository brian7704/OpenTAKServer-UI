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
    versionDate: '2025-11-09T17:07:30.369Z',
    gitCommitHash: 'gbe8645b',
    gitCommitDate: '2025-11-08T18:11:09.000Z',
    versionLong: '0.0.0-gbe8645b',
    gitTag: 'v1.6.0rc2',
};
export default versions;
