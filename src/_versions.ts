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
    versionDate: '2025-05-09T18:48:56.580Z',
    gitCommitHash: 'g34bcd96',
    gitCommitDate: '2025-05-09T13:19:07.000Z',
    versionLong: '0.0.0-g34bcd96',
    gitTag: 'v1.5.0rc1',
};
export default versions;
