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
    versionDate: '2026-05-31T21:31:30.671Z',
    gitCommitHash: 'g03d4db0',
    gitCommitDate: '2026-05-30T22:31:40.000Z',
    versionLong: '0.0.0-g03d4db0',
    gitTag: 'v1.7.5',
};
export default versions;
