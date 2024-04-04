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
    versionDate: '2024-04-03T20:28:53.898Z',
    gitCommitHash: 'g48bd399',
    gitCommitDate: '2024-03-28T18:30:44.000Z',
    versionLong: '0.0.0-g48bd399',
    gitTag: 'v1.0.0',
};
export default versions;
