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
    versionDate: '2024-09-10T21:37:22.178Z',
    gitCommitHash: 'g55bc647',
    gitCommitDate: '2024-09-10T18:56:08.000Z',
    versionLong: '0.0.0-g55bc647',
    gitTag: 'v1.2.0',
};
export default versions;
