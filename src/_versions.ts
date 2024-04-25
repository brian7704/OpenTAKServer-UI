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
    versionDate: '2024-04-25T20:02:28.513Z',
    gitCommitHash: 'g3d3cb96',
    gitCommitDate: '2024-04-25T04:38:02.000Z',
    versionLong: '0.0.0-g3d3cb96',
    gitTag: 'v1.1.1',
};
export default versions;
