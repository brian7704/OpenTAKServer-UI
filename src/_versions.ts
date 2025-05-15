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
    versionDate: '2025-05-15T18:38:48.917Z',
    gitCommitHash: 'g103a3f4',
    gitCommitDate: '2025-05-15T15:19:32.000Z',
    versionLong: '0.0.0-g103a3f4',
    gitTag: 'v1.5.0rc1',
};
export default versions;
