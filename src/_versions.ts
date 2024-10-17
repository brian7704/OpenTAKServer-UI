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
    versionDate: '2024-10-16T13:13:56.999Z',
    gitCommitHash: 'gcbf9b9e',
    gitCommitDate: '2024-10-16T13:13:16.000Z',
    versionLong: '0.0.0-gcbf9b9e',
    gitTag: 'v1.3.1',
};
export default versions;
