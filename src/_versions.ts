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
    versionDate: '2024-09-10T18:49:36.189Z',
    gitCommitHash: 'g29af883',
    gitCommitDate: '2024-07-17T21:12:47.000Z',
    versionLong: '0.0.0-g29af883',
    gitTag: 'v1.2.0',
};
export default versions;
