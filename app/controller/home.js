'use strict';

const Controller = require('egg').Controller;
const sendToWormhole = require('stream-wormhole');
const toArray = require('stream-to-array');
const path = require('path');
const fs = require('fs');
const ueditor = require('ueditor');
var crypto = require('crypto'); // 加密库

let  join = require('path').join;

function md5(str) {
  var ret = crypto.createHash('md5').update(str.toString()).digest("hex");
  return ret;
}

class HomeController extends Controller {
  async index() {
    await this.ctx.render('news/ueditor.tpl');
  }

  async uploadsImg() {
    //客户端上传文件设置
    let imgDir = '../public/img/ueditor/';
    console.log('upload img');
    let ActionType = this.ctx.query.action;
    try {
      if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        let file_url = imgDir;//默认图片上传地址
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
          file_url = '../public/file/ueditor/'; //附件
        }
        if (ActionType === 'uploadvideo') {
          file_url = '../public/video/ueditor/'; //视频
        }
        this.ctx.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        this.ctx.setHeader('Content-Type', 'text/html');
      }
      // 客户端发起其它请求
      else {
        this.ctx.redirect('/public/ueditor/nodejs/config.json');
      }
    } catch (error) {
      await sendToWormhole(stream);
      throw err;
    }

  };

  async uploadsImgPOST() {

    //客户端上传文件设置
    const stream = await this.ctx.getFileStream();
    let imgDir = '../public/img/ueditor/';
    let ActionType = this.ctx.query.action;
    let buf;
    let parts;
    //console.log('action',ActionType);
    try {
      if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        let file_url = imgDir;//默认图片上传地址
        console.log(file_url);
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
          file_url = '../public/file/ueditor/'; //附件
          console.log('file post');
        }
        if (ActionType === 'uploadvideo') {
          file_url = '../public/video/ueditor/'; //视频
        }
        parts = await toArray(stream);
        buf = Buffer.concat(parts);
        const filename = md5(parts) + path.extname(stream.filename).toLowerCase();
        const target = path.join(__dirname, file_url, filename);
        await fs.writeFileSync(target, buf);
        return this.ctx.body = {url: file_url.slice(2) + filename, state: 'SUCCESS'};
      }
      // 客户端发起其它请求
      else {
        this.ctx.redirect('/public/ueditor/nodejs/config.json');
      }
    } catch (err) {
      await sendToWormhole(stream);
      throw err;
    }
  };




  async uploadHtml() {

    let body = this.ctx.request.body;
    let content = body.content;
    console.log("content=====" + content);

    //删除所有文件夹中，conetent中没有用到过的图片资源
    this.ctx.service.file.findSync('../egg-ueditor/app/public/img/ueditor/',content);

    console.log('fileNames==='+fileNames[0]);


  };


}




module.exports = HomeController;
