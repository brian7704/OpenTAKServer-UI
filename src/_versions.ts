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
    versionDate: '2025-12-30T15:48:59.663Z',
    gitCommitHash: 'ga6a8691',
    gitCommitDate: '2025-12-22T20:57:00.000Z',
    versionLong: '0.0.0-ga6a8691',
    gitTag: 'v1.7.1',
};
export default versions;
