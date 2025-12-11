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
    versionDate: '2025-12-11T12:37:25.969Z',
    gitCommitHash: 'gda561a6',
    gitCommitDate: '2025-12-11T12:09:37.000Z',
    versionLong: '0.0.0-gda561a6',
    gitTag: 'v1.7.0',
};
export default versions;
