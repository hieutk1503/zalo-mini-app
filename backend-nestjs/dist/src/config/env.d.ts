export declare const env: {
    nodeEnv: string;
    port: number;
    databaseUrl: string;
    aiServiceUrl: string;
    apiPublicUrl: string;
    uploadDir: string;
    zaloAppId: string | undefined;
    zaloAppSecret: string | undefined;
    zaloAuthDevMode: boolean;
};
export declare function isZaloAuthConfigured(): boolean;
export declare function allowDevHeaderAuth(): boolean;
