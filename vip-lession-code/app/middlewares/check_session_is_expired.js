/*!
 * Moajs Middle
 * Copyright(c) 2015-2019 Alfred Sang <shiren1118@126.com>
 * MIT Licensed
 */

// 检查用户会话
module.exports = function(req, res, next) {
  if (req.session.open_id) {
    console.log('session user open_id=' + req.session.open_id);
    if ( req.originalUrl === '/wechats/oauth' ) {
      // return res.redirect('/');
    }
    return next();
  } else {
    console.log('no session user')
    return res.redirect('/wechats/oauth');
  }
};