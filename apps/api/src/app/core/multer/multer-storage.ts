import { ResizeResult, ResizeTask } from '@svv/core/models';
import { Request } from 'express';
import * as fs from 'fs';
import * as p from 'path';
import * as multer from 'multer';
import * as sharp from 'sharp';

/**
 * Constructs a new instance of the custom `Multer Storage`.
 *
 * @param options The options for the new `Multer Storage` instance.
 */
export function multerStorageEngine(options?: MulterOptions) {
  return new MulterStorage(options);
}

class MulterStorage implements multer.StorageEngine {
  constructor(private options?: MulterOptions) {
    this.getDestination = options.destination || this.getDestination;
    this.getFilename = options.filename || this.getFilename;
  }

  /**
   * The default method for establishing the destination where the file(s)
   * should be stored.
   *
   * @param request The HTTP request
   * @param file The file from the HTTP request
   * @param callback The callback function which returns the path.
   */
  getDestination(
    request: Request,
    file: Express.Multer.File,
    callback: (error: Error, destination: string) => void,
  ) {
    const path = './';
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    callback(null, path);
  }

  /**
   * The default method for creating the default file name(s).
   *
   * @param request The HTTP request
   * @param file The file from the HTTP request
   * @param callback The callback function which returns the name of the
   * specific file.
   */
  getFilename(
    request: Request,
    file: Express.Multer.File,
    callback: (error: Error, filename: string) => void,
  ) {
    callback(null, file.originalname);
  }

  /**
   * Handles the process of storing the file on the file system.
   *
   * @param request The HTTP request
   * @param file The file from the HTTP request
   */
  _handleFile(
    request: Request,
    file: Express.Multer.File,
    callback: (error: Error, result?: any) => void,
  ) {
    this.getDestination(request, file, (error, destination) => {
      if (error) {
        return callback(error);
      }

      if (!this.options.tasks) {
        return callback(new Error('No tasks defined'));
      }

      const upload = async (task: ResizeTask) => {
        return new Promise<ResizeResult>((resolve, reject) => {
          this.getFilename(request, file, (error, filename) => {
            if (error) {
              return reject();
            }

            const path = p.join(
              destination,
              task.suffix
                ? `${filename}_${task.suffix}.${task.format}`
                : `${filename}.${task.format}`,
            );

            const outputStream = fs.createWriteStream(path);
            const resizer =
              file.mimetype === 'image/png'
                ? sharp()
                    .resize(task.width, task.height)
                    .flatten({ background: { r: 255, g: 255, b: 255 } })
                    .toFormat(task.format)
                : sharp().resize(task.width, task.height).toFormat(task.format);

            file.stream.pipe(resizer).pipe(outputStream);

            outputStream.on('error', () => reject());
            outputStream.on('finish', () => {
              sharp(path)
                .metadata()
                .then(meta => {
                  resolve({
                    path,
                    width: meta.width,
                    height: meta.height,
                  });
                });
            });
          });
        });
      };

      // Each task gets process individually so at the end multiple files will
      // be stored on the file system based one the given tasks.
      const tasks = this.options.tasks.map(task => upload(task));
      Promise.all(tasks).then(results => {
        callback(null, {
          results,
        });
      });
    });
  }

  /**
   * This method is needed in order to remove the created file from the file
   * system if an error occured while the process was ongoing.
   *
   * @param request The HTTP request
   * @param file The file from the HTTP request
   */
  _removeFile(
    request: Request,
    file: Express.Multer.File,
    callback: fs.NoParamCallback,
  ) {
    fs.unlink(file.path, callback);
  }
}

interface MulterOptions {
  filename?: (
    request: Request,
    file: Express.Multer.File,
    callback: (error: Error, filename: string) => void,
  ) => void;
  destination?: (
    request: Request,
    file: Express.Multer.File,
    callback: (error: Error, destination: string) => void,
  ) => void;
  tasks?: ResizeTask[];
}
