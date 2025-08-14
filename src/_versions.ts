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
    versionDate: '2025-08-14T14:55:43.106Z',
    gitCommitHash: 'g41c443a',
    gitCommitDate: '2025-08-14T13:48:08.000Z',
    versionLong: '0.0.0-g41c443a',
    gitTag: 'v1.5.1',
};
export default versions;
