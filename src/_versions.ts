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
    versionDate: '2026-04-21T15:28:05.081Z',
    gitCommitHash: 'g88cf686',
    gitCommitDate: '2026-04-17T02:25:27.000Z',
    versionLong: '0.0.0-g88cf686',
    gitTag: 'v1.7.4',
};
export default versions;
