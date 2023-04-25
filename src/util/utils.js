module.exports = {
  logger: require('tracer').console({
    level: process.env.LOGLEVEL || 'info',
    format: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})',
    dateformat: 'HH:MM:ss.L',
    preprocess: function (data) {
      data.title = data.title.toUpperCase();
    }
  })
};
