import { HttpService } from '@nestjs/axios';
import { Readable } from 'stream';
export declare class ChatService {
    private readonly httpService;
    private aiServiceUrl;
    constructor(httpService: HttpService);
    askAiStream(query: string, history?: any[]): Promise<Readable>;
}
