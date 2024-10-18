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
    versionDate: '2024-10-18T00:02:52.297Z',
    gitCommitHash: 'g95b3372',
    gitCommitDate: '2024-10-17T22:39:50.000Z',
    versionLong: '0.0.0-g95b3372',
    gitTag: 'v1.3.0',
};
export default versions;
