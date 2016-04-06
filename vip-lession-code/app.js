var app = require('base2')({
  // debug: true,
  // root:__dirname,
  "views": "app/views",
  "routes": "app/routes",
  "public": "app/public",
})

// console.log(app);
// app.mount_routes(__dirname + '/routes2');
// app.mount_plugins(__dirname + '/plugins');
app.start(3019);