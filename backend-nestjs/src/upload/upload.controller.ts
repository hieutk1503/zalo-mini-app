import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { FileFilterCallback } from 'multer';
import { join } from 'path';
import { SoftAuthGuard } from '../auth/soft-auth.guard';
import { env } from '../config/env';
import {
  feedbackImageFilename,
  UploadService,
} from './upload.service';

const imageFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(null, false);
    return;
  }
  cb(null, true);
};

@Controller('upload')
@UseGuards(SoftAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('images')
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: join(process.cwd(), env.uploadDir, 'feedbacks'),
        filename: (_req, file, cb) => {
          cb(null, feedbackImageFilename(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: imageFilter,
    }),
  )
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const urls = this.uploadService.saveFeedbackImages(files || []);
    return { urls };
  }
}
