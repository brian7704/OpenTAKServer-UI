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
    versionDate: '2024-09-22T18:07:13.537Z',
    gitCommitHash: 'g8cdad47',
    gitCommitDate: '2024-09-21T22:05:59.000Z',
    versionLong: '0.0.0-g8cdad47',
    gitTag: 'v1.3.0rc3',
};
export default versions;
