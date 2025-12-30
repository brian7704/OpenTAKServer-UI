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
    versionDate: '2025-12-30T20:41:13.761Z',
    gitCommitHash: 'g65f0326',
    gitCommitDate: '2025-12-30T16:27:32.000Z',
    versionLong: '0.0.0-g65f0326',
    gitTag: 'v1.7.1',
};
export default versions;
