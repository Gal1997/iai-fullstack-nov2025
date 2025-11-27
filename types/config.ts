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
        recentFixes: string[];
    };
};
