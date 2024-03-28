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
    version: '1.0.0',
    name: 'opentakserver-ui',
    versionDate: '2024-03-28T18:26:33.527Z',
    gitCommitHash: '41176bb',
    versionLong: '1.0.0-41176bb',
    gitTag: 'null',
};
export default versions;
