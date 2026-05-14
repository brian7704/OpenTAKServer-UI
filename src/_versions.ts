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
    versionDate: '2026-05-14T20:40:56.156Z',
    gitCommitHash: 'g517b35b',
    gitCommitDate: '2026-05-14T18:38:03.000Z',
    versionLong: '0.0.0-g517b35b',
    gitTag: 'v1.7.4',
};
export default versions;
