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
    versionDate: '2024-10-17T21:51:35.874Z',
    gitCommitHash: 'g1fb2ee8',
    gitCommitDate: '2024-10-16T12:44:43.000Z',
    versionLong: '0.0.0-g1fb2ee8',
    gitTag: 'v1.3.0',
};
export default versions;
