import { HttpService } from '@nestjs/axios';
export declare class ChatService {
    private readonly httpService;
    private aiServiceUrl;
    constructor(httpService: HttpService);
    askAi(query: string, history?: any[]): Promise<any>;
}
