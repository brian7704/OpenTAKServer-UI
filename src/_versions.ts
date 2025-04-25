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
    versionDate: '2025-04-25T20:41:21.091Z',
    gitCommitHash: 'g2cf0970',
    gitCommitDate: '2025-04-25T20:35:57.000Z',
    versionLong: '0.0.0-g2cf0970',
    gitTag: 'v1.4.2',
};
export default versions;
