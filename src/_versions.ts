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
    versionDate: '2025-03-22T03:06:15.150Z',
    gitCommitHash: 'g9aa98b3',
    gitCommitDate: '2025-03-20T16:25:42.000Z',
    versionLong: '0.0.0-g9aa98b3',
    gitTag: 'v1.4.2',
};
export default versions;
