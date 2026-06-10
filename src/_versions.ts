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
    versionDate: '2026-06-10T13:17:13.146Z',
    gitCommitHash: 'g3424957',
    gitCommitDate: '2026-06-10T04:47:44.000Z',
    versionLong: '0.0.0-g3424957',
    gitTag: 'v1.7.5',
};
export default versions;
