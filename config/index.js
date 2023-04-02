const fs = require('fs');
const config = require('./config.js');
const path = require('path');

fs.watch(path.join(__dirname + '/config.js'), (event, filename) => {
  if (event === 'change') {
    console.log(`${filename} has been changed.`);

    try {
      // 重新加载配置文件
      delete require.cache[require.resolve('./config.js')];
      const newConfig = require('./config.js');
      Object.assign(config, newConfig);
    } catch (e) {
      // do nothing
    }
  }
});

module.exports = config