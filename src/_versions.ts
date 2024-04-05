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
    versionDate: '2024-04-05T14:28:53.976Z',
    gitCommitHash: 'g9fcf957',
    gitCommitDate: '2024-04-04T15:22:25.000Z',
    versionLong: '0.0.0-g9fcf957',
    gitTag: 'v1.1.0',
};
export default versions;
