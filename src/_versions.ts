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
    versionDate: '2025-10-31T18:50:17.636Z',
    gitCommitHash: 'g4a89ea5',
    gitCommitDate: '2025-10-29T04:06:08.000Z',
    versionLong: '0.0.0-g4a89ea5',
    gitTag: 'v1.5.3',
};
export default versions;
