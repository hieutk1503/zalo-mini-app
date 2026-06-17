export declare class UploadService {
    private readonly feedbackDir;
    constructor();
    buildPublicUrl(filename: string): string;
    saveFeedbackImages(files: Express.Multer.File[]): string[];
}
export declare function feedbackImageFilename(originalName: string): string;
