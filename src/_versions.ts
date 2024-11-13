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
    versionDate: '2024-11-13T03:28:33.027Z',
    gitCommitHash: 'g60de512',
    gitCommitDate: '2024-11-13T03:27:09.000Z',
    versionLong: '0.0.0-g60de512',
    gitTag: 'v1.4.0',
};
export default versions;
