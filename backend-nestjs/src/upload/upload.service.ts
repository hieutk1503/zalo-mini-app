import { Injectable } from '@nestjs/common';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { env } from '../config/env';

@Injectable()
export class UploadService {
  private readonly feedbackDir = join(process.cwd(), env.uploadDir, 'feedbacks');

  constructor() {
    mkdirSync(this.feedbackDir, { recursive: true });
  }

  buildPublicUrl(filename: string) {
    return `${env.apiPublicUrl.replace(/\/$/, '')}/uploads/feedbacks/${filename}`;
  }

  saveFeedbackImages(files: Express.Multer.File[]) {
    return files.map((file) => this.buildPublicUrl(file.filename));
  }
}

export function feedbackImageFilename(originalName: string) {
  const ext = originalName.includes('.')
    ? originalName.slice(originalName.lastIndexOf('.'))
    : '.jpg';
  return `${randomUUID()}${ext.toLowerCase()}`;
}
