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
    versionDate: '2025-12-04T21:44:03.629Z',
    gitCommitHash: 'gb03af77',
    gitCommitDate: '2025-12-04T20:26:32.000Z',
    versionLong: '0.0.0-gb03af77',
    gitTag: 'v1.7.0rc1',
};
export default versions;
