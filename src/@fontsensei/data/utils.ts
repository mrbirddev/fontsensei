import fs from "fs";

export const readRawJson = (filePath: string): Promise<object> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        return reject(err);
      }
      const parsed = JSON.parse(data);
      resolve(parsed);
    });
  });
};

