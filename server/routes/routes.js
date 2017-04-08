var express         = require('express');
var jwt             = require('jsonwebtoken');
var Channel         = require('../model/channel')
var request         = require('request');
var secret          = require('../settings/secret');

var app = module.exports = express();
var apiKey = secret.ytkey;


// add a new number
app.post('/add',function(req,res){

  if (!req.body.channel)
    return res.status(400).send({ message:"Must provide channel name!"});
  if (!req.body.number)
    return res.status(400).send({ message:"Must provide phone number!"}); 


  request('https://www.googleapis.com/youtube/v3/channels?key=' + apiKey + '&forUsername=' + req.body.channel + '&part=id', 
  function(error, response, body){
    data = JSON.parse(body); 

    if (!data.items || data.items.length == 0){
      return res.status(400).send({ message:"Channel with specified name doesn't exist!"});
    } else {
      addNum(data.items[0].id);
    }
  });

  function addNum(channelId){

    Channel.findOne({
      channelId: channelId
    }).select('numbers channelName').exec( function(err, channel){
      if (!channel){

        var channel = new Channel();
        channel.channelId = channelId;
        channel.channelName = req.body.channel;
        channel.numbers = [req.body.number];
        channel.recentVideo = "";
        
        channel.save(function (err){
          if (err) {
            console.log(err);
            return res.status(400).send({message: "Unsuccessful creation of channel in database"});
          }
          return res.send({message: "Success!"});
        });


      } else {
        if (channel.newNumber(req.body.number)){
          return res.send({message: "Success!"});
        } else {
          return res.status(400).send({ message:"Number already subscribed to this channel"});
        }   
      }
    }) 
  }
    
});

// Delete number from channel
app.post('/remove',function(req,res){

  if (!req.body.channel)
    return res.status(400).send({ message:"Must provide channel name!"});
  if (!req.body.number)
    return res.status(400).send({ message:"Must provide phone number!"}); 


  request('https://www.googleapis.com/youtube/v3/channels?key=' + apiKey + '&forUsername=' + req.body.channel + '&part=id', 
  function(error, response, body){
    data = JSON.parse(body); 

    if (!data.items || data.items.length == 0){
      return res.status(400).send({ message:"Channel with specified name doesn't exist!"});
    } else {
      removeNum(data.items[0].id);
    }
  });


  function removeNum(channelId){

    Channel.findOne({
      channelId: channelId
    }).select('numbers ').exec( function(err, channel){
      if (!channel){
        return res.status(400).send({message: "No such channel exists in our database!"});
      } else {
        if (channel.deleteNumber(req.body.number)){
          return res.send({message: "Deletion success!"});
        } else {
          return res.status(400).send({ message:"Number is not subscribed to this channel"});
        }   
    }
    }) 
  }
    
});

