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
    versionDate: '2024-09-12T17:24:48.928Z',
    gitCommitHash: 'g58cc9e7',
    gitCommitDate: '2024-09-12T15:37:22.000Z',
    versionLong: '0.0.0-g58cc9e7',
    gitTag: 'v1.2.0',
};
export default versions;
