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
    versionDate: '2024-09-12T15:21:35.928Z',
    gitCommitHash: 'g8da0f5a',
    gitCommitDate: '2024-09-11T15:13:00.000Z',
    versionLong: '0.0.0-g8da0f5a',
    gitTag: 'v1.2.0',
};
export default versions;
