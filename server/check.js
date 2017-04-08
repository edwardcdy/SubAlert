var Repeat          = require('repeat');
var Channel         = require('./model/channel')
var request         = require('request');

module.exports = function(timeout){
  var i = 0; 

  function checkUpdate(){

    var stream = Channel.find().stream();
      
    stream.on('data', function (channel) {
      channel.checkUpdate(true); 
    });

  }

  Repeat(checkUpdate).every(timeout, 's').start();
}
