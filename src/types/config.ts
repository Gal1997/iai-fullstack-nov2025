
export type ConfigType = {
    configurationManager: {
        url: string;
        username: string;
        password: string;
    };
    branchSelection: {
        defaultBranch: string;
    };
    build: {
        command: string;
        outputDirectory: string;
    };
    copyToTarget: {
        targetDirectory: string;
    };
    vdd?: {
        versionNumber: string;
        releaseDate: string;
        recentFixes: string | string[];
        /*
    Since we get raw string from user, and only later we format the data so
    it will become array of strings, we have these 2 types
*/
    };
};
