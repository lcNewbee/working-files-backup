import fs from 'fs';
import path from 'path';
import mime from 'mime';

/**
 * 简单的 http api connect 中间件请求处理,
 * 把特定路径请求的按路径访问相应的json文件
 *
 * @param  {[object]} options   初始化选项
 * @return {[function]}         处理函数
 */
export default function serverApi(options) {
  return (req, res) => {
    // handle any requests at /api
    const rootUrl = 'tools/data';
    const reqFilename = `${path.basename(req.url).split('?')[0]}.json`;
    const fileMime = mime.lookup(reqFilename);
    let isDone = false;

    function readDone(resText, url) {
      let msg = resText;

      if (isDone) {
        return null;
      }

      if (!resText) {
        msg = JSON.stringify({
          state: {
            code: 4004,
            msg: `${url} is Not Found!`,
          },
        });
      }

      isDone = true;
      // res.setHeader("Content-Range", "bytes");
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', `${fileMime}; charset=UTF-8`);
      res.setHeader('Content-Length', msg.length);
      res.end(msg);

      return null;
    }

    function readFile(readurl, done) {
      fs.readdir(readurl, (err, files) => {
        if (err) {
          return done(null);
        }
        let pending = files.length;

        if (!pending) {
          return done(null, readurl);
        }

        files.forEach((filename) => {
          let resText = null;
          const thisUrlName = path.join(readurl, filename);

          fs.stat(thisUrlName, (errs, stats) => {
            if (errs) throw errs;

            // 是文件
            if (stats.isFile()) {
              // 如果是正在请求的文件
              if (reqFilename === filename) {
                resText = fs.readFileSync(thisUrlName);
                done(resText, thisUrlName, true);
              } else if (!--pending) {
                done(null, path.join(readurl, reqFilename));
              }

              // 是子目录
            } else if (stats.isDirectory()) {
              readFile(thisUrlName, (reT, urls, isDoneOk) => {
                if (!--pending || isDoneOk) done(reT, urls);
              });
            }
          });
        });
      });
    }

    readFile(rootUrl, readDone);
  };
}
