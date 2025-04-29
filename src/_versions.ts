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
    versionDate: '2025-04-29T19:59:36.878Z',
    gitCommitHash: 'g3a91982',
    gitCommitDate: '2025-04-24T04:27:12.000Z',
    versionLong: '0.0.0-g3a91982',
    gitTag: 'v1.5.0rc1',
};
export default versions;
