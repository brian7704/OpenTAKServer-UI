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
    versionDate: '2025-07-15T18:36:50.384Z',
    gitCommitHash: 'gfcfc0b1',
    gitCommitDate: '2025-05-29T04:48:30.000Z',
    versionLong: '0.0.0-gfcfc0b1',
    gitTag: 'v1.5.0rc3',
};
export default versions;
