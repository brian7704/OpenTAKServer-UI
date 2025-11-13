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
    versionDate: '2025-11-11T14:24:22.788Z',
    gitCommitHash: 'g70b396c',
    gitCommitDate: '2025-11-09T21:49:00.000Z',
    versionLong: '0.0.0-g70b396c',
    gitTag: 'v1.6.0rc3',
};
export default versions;
