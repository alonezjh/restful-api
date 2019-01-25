import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

const checkFileExt = (ext, allow = true, rule= 'png|jpeg|jpg') => {
  if (!ext) return false;
  if (allow) return rule.includes(ext);
  return !rule.includes(ext);
};

// const baseDir = `public/uploads/${new Date().getFullYear() + (new Date().getMonth() + 1) + new Date().getDate()}`;
// fs.exists(baseDir, (exists) => {
//   if (!exists) {
//     console.log('目录不存在');
//     fs.mkdir(baseDir, (err) => {
//       if (err) console.error(err);
//       console.log('创建目录成功');
//     });
//   } else {
//     console.log('目录存在');
//   }
// });
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.resolve(baseDir));
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

const appendZero = (num) => {
  if (num < 10) {
    return "0" + num;
  } else {
    return num;
  }
};

const storage = multer.diskStorage({
  destination: `public/uploads/${new Date().getFullYear()}${appendZero(new Date().getMonth() + 1)}`,
  filename: (req, file, cb) => {
    const filenameArr = file.originalname.split('.');
    cb(null, Date.now() + '.' + filenameArr[filenameArr.length - 1]);
  },
});

const fileFilter = (req, file, cb) => {
  let ext = file.originalname.split('.');
  ext = ext[ext.length - 1];
  // 检查文件后缀是否符合规则
  if (checkFileExt(ext, true)) {
    cb(null, true);
  } else {
    // 不符合规则，拒绝文件并且直接抛出错误
    cb(null, false);
    cb(new Error('文件类型错误'));
  }
};

const limits = {
  fileSize: 1024 * 1000 * 2,
};

export const upload = multer({ storage, fileFilter, limits }).single('img');
