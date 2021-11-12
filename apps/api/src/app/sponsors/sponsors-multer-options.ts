import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ErrorType } from '@svv/core/models';
import { ApiException } from '@svv/api/core/error';
import { multerStorageEngine } from '@svv/api/core/multer';
import * as fs from 'fs';

/**
 * The multer configuration which is used by the custom `Multer Storage`.
 */
export const sponsorsMulterOptions: MulterOptions = {
  limits: {
    files: 1,
  },
  fileFilter: (request: any, file: any, callback: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      callback(null, true);
    } else {
      callback(new ApiException(ErrorType.UNSUPPORTED_IMAGE_TYPE), false);
    }
  },
  storage: multerStorageEngine({
    destination: (request, file, callback) => {
      const path = './images/sponsors';
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }

      callback(null, path);
    },
    filename: (request, file, callback) => {
      return callback(null, request.params.id);
    },
    tasks: [
      {
        format: 'jpeg',
      },
    ],
  }),
};
