import fs from 'fs';
import url from 'url';
import mime from 'mime';

/**
 * 简单的 http api 中间件请求处理,
 * 把 api 请求的按路径访问相应的json文件
 *
 * @param  {[object]} options   初始化选项
 * @return {[function]}         处理函数
 */
export default function serverApi(options) {

  return function(req, res, next) {
    // handle any requests at /api
    const urlName = 'tools/data' + req.url.split('?')[0] + '.json';

    fs.readFile(urlName, (err, markup) => {
      let resText = '';

      if(err) {
        resText = JSON.stringify({
          state: {
            code: 7001,
            msg: err.message
          }
        });
      } else {
        resText = markup;
      }
      //res.setHeader("Content-Range", "bytes");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader('Content-Type', mime.lookup(urlName) + '; charset=UTF-8');
      res.setHeader("Content-Length", resText.length);
      res.end(resText);
    });

  }
};
