var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var request     = require('request');
var secret      = require("../settings/secret");

var apiKey       = secret.ytkey;
var accountSid   = secret.twilioSid; 
var authToken    = secret.twilioAuth; 
var client       = require('twilio')(accountSid, authToken); 
const from       = secret.number;

function sendMessage(recipient, message){
  client.messages.create({ 
    to: "+1" + recipient, 
    from: from, 
    body: message, 
  }, function(err, message) { 
    console.log(err);
    console.log(message.sid); 
  });
}


var ChannelSchema = new Schema({
    channelId: {type:String, required: true, index: {unique: true}},
    channelName:   {type: String, required: true},
    numbers:   Array,
    recentVideo: String
})
    
ChannelSchema.pre('save', function(next){
  // pull current video for new channels
  var channel = this;
  if (this.isNew) channel.checkUpdate(false);

  next();
});

// Add a subscriber to the channel
ChannelSchema.methods.newNumber = function(number, callback){
  var channel = this;
  var flag = true;

  channel.numbers.forEach(function(element){
  
    if (number == element) flag = false;
  });

  if (flag){
    console.log(channel);

    sendMessage(number, "You will now receive texts when " + channel.channelName + " uploads a new video!");
    channel.numbers.push(number);
    channel.save(function(err){
      if (err) console.log("error: " + err);
    });
    return true;
  }
  return false;
}

// Delete a subscriber of the channel
ChannelSchema.methods.deleteNumber = function(number, callback){
  var channel = this;
  var pos = -1;

  channel.numbers.forEach(function(element, index){
    if (number == element) pos = index;
  });

  if (pos != -1){
    channel.numbers.splice(pos, 1);
    channel.save();
    return true;
  }
  return false;
}

// Check if a new video is out, and if so, assign recent video to that title
// returns true if a new video is out, false if no new videos
ChannelSchema.methods.checkUpdate = function(msg , callback){

  var channel = this;

  var channelId = channel.channelId;
  var address = "https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=" + channelId + "&maxResults=1&key=" + apiKey;

  request(address ,function(error, response, body ){
    data = JSON.parse(body); 
        
    if (channel.recentVideo != data.items[0].snippet.title){
      channel.recentVideo = data.items[0].snippet.title;
      console.log(channel.recentVideo);

      channel.save(function(err){

        if (err) console.log("Unable to update channel video");
        if (msg) channel.textSubscribers(channel.recentVideo);
      });

    } else {
      return false;
    }
 
  });
}


// Method to text the subscribers, called when a new video is uploaded
ChannelSchema.methods.textSubscribers = function(message, callback){
  var channel = this;
  var users = channel.numbers;


  channel.numbers.forEach(function(number){
    sendMessage( number , channel.channelName + " has a new video out: " + channel.recentVideo + "!");
  });
  

}

module.exports = mongoose.model('Channel',ChannelSchema);