'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/ueditorPage', controller.home.index);

  router.get('/public/ueditor/ue',controller.home.uploadsImg);
  router.post('/public/ueditor/ue',controller.home.uploadsImgPOST);

};
