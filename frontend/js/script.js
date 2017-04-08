$("#connect").click(function(){
  
  var chan = $('#channel').val();
  var num = $('#number').val();

  num = num.replace(/\D/g,'');

  if (num.length != 10){
    $( "#error" ).html("Your number must be 10 digits long! (US only)");
    return;
  }

  $.ajax({
    type: "POST",
    url: "/api/add",
    data: 
      {
        channel: chan,
        number: num
      },
    success: function(){
      $( "#error" ).html("<span class='green'> Success! " + num + " is now subscribed to " + chan + "!</span>");
      $('#number').val("");
      $('#channel').val("");

      setTimeout(function(){
        $( "#error" ).html("");
      },2000);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.responseJSON.message == "Channel with specified name doesn't exist!"){
        $( "#error" ).html("<span class='red'> No such channel, " + chan + ", exists!</span>");
      } else {
        $( "#error" ).html("<span class='red'> " + num + " is already subscribed to " + chan + "!</span>");
      }

      setTimeout(function(){
        $( "#error" ).html("");
      },2000);
    }
  }); 

});

$("#disconnect").click(function(){
  
  var chan = $('#channel').val();
  var num = $('#number').val();

  num = num.replace(/\D/g,'');

  if (num.length != 10){
    $( "#error" ).html("Your number must be 10 digits long! (US only)");
    return;
  }

  $.ajax({
    type: "POST",
    url: "/api/remove",
    data: 
      {
        channel: chan,
        number: num
      },
    success: function(){
      $( "#error" ).html("<span class='green'> Success! " + num + " is unsubscribed from " + chan + "!</span>");
      $('#number').val("");
      $('#channel').val("");

      setTimeout(function(){
        $( "#error" ).html("");
      },2000);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      $( "#error" ).html("<span class='red'> " + num + " is not subscribed to " + chan + "!</span>");
      setTimeout(function(){
        $( "#error" ).html("");
      },2000);
    }
  }); 

});





