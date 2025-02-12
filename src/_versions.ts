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
    versionDate: '2025-02-12T02:35:32.406Z',
    gitCommitHash: 'g4b96de5',
    gitCommitDate: '2025-02-12T01:42:10.000Z',
    versionLong: '0.0.0-g4b96de5',
    gitTag: 'v1.4.2',
};
export default versions;
