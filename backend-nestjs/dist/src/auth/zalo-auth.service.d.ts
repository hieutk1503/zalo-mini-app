import { HttpService } from '@nestjs/axios';
export type ZaloProfile = {
    id: string;
    name?: string;
    picture?: {
        data?: {
            url?: string;
        };
    };
};
export declare class ZaloAuthService {
    private readonly httpService;
    constructor(httpService: HttpService);
    isConfigured(): boolean;
    private createAppSecretProof;
    verifyAccessToken(accessToken: string): Promise<ZaloProfile>;
}
