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
    versionDate: '2024-09-19T14:30:01.058Z',
    gitCommitHash: 'g7a61750',
    gitCommitDate: '2024-09-19T13:56:58.000Z',
    versionLong: '0.0.0-g7a61750',
    gitTag: 'v1.3.0rc1',
};
export default versions;
