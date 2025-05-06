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
    versionDate: '2025-05-06T12:45:36.137Z',
    gitCommitHash: 'g6158992',
    gitCommitDate: '2025-04-25T20:44:14.000Z',
    versionLong: '0.0.0-g6158992',
    gitTag: 'v1.4.3',
};
export default versions;
