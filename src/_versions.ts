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
    version: '0.1.0',
    name: 'opentakserver-ui',
    versionDate: '2024-03-27T18:47:57.219Z',
    gitCommitHash: '4fb7799',
    versionLong: '0.1.0-4fb7799',
    gitTag: 'null',
};
export default versions;
