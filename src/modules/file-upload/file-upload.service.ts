import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadService {
  async handleFileUpload(file: Express.Multer.File) {
    if (!file) {
      // throw new BadRequestException('no file uploaded');
      return '';
    }

    // validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('invalid file type');
    }

    // validate file size (e.g., max 5mb)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('file is too large!');
    }

    return `http://localhost:3000/uploads/${file.filename}`.replace(/\\/g, '/');
  }
}
