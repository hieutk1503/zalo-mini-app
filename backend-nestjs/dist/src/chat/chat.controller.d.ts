import { ChatService } from './chat.service';
import type { Response } from 'express';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    queryChat(query: string, history: any[], res: Response): Promise<void>;
}
