import { AiSyncService } from './ai-sync.service';
export declare class AiSyncController {
    private readonly aiSyncService;
    constructor(aiSyncService: AiSyncService);
    triggerAll(): Promise<{
        status: string;
        message: string;
    }>;
}
