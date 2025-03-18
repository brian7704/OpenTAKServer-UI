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
    versionDate: '2025-03-14T22:20:52.096Z',
    gitCommitHash: 'g60fed56',
    gitCommitDate: '2025-03-13T05:25:39.000Z',
    versionLong: '0.0.0-g60fed56',
    gitTag: 'v1.4.2',
};
export default versions;
