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
    versionDate: '2024-07-17T21:06:53.747Z',
    gitCommitHash: 'g2bc28b7',
    gitCommitDate: '2024-06-11T20:01:51.000Z',
    versionLong: '0.0.0-g2bc28b7',
    gitTag: 'v1.2.0',
};
export default versions;
