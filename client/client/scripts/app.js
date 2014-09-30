// YOUR CODE HERE:
var app = {
  init: function(filter){app.fetch(function(data){
          for(var i=data.length-1; i>=0; i--){
            if(filter===undefined || data[i].roomname === filter){
              app.addMessage(data[i]);
            }
          }
        })},
  send: function(message){
    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:3000/",
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data){
        console.log('chatterbox: Message sent');
      },
      error: function(data){
        console.error("chatterbox: Failed to send message");
      }
    });
  },
  fetch: function(func){
    $.ajax({
      type: "GET",
      url: "http://127.0.0.1:3000/",
      contentType: 'application/json',
      data: {order: '-createdAt'},
      success: function(data){
          func(data.results);
      }
    });
  },
  clearMessages: function(){
    $('#chats').html('');
  },
  addMessage: function(message){
    var $chat = $('<div class = "chat"></div>');
    if (_.contains(friends,message.username)){
      $chat.addClass('friends');
    }
    $chat.append($('<span class="username"></span>').text(message.username));
    $chat.append($('<span class="roomname"></span>').text(message.roomname));
    $chat.append($('<div class="text"></div>').text(message.text));
    $('#chats').prepend($chat);
  },
  addRoom: function(roomName){
    $('#roomSelect').append('<div></div>');
  },
  addFriend: function(){console.log('added friend')},
  update: function(){
    app.fetch();
  }
};
/////////////////////////////////////////////////////////////////
var room;
var friends = [];

var addNewMessages = function(data){
  for(var i = 0; i < data.length; i++){
    if(+new Date(data[i].createdAt) > Date.now()-1000)
      app.addMessage(data[i]);
  }
};

var refresh = function(filter){
  app.fetch(addNewMessages);
  // app.clearMessages();
  // app.init(filter);
};

setInterval(function(){refresh(room)},60000);

$(document).ready(function(){
  app.init();
  $('button').on('click',function(){
    room = $('#roomname').val()
    app.send(
      {username:$('#username').val(), text:$('#text').val(), roomname: room}
      );
  });
  $(document).on('click','.username',function(){
    friends.push($(this).text());
    app.clearMessages();
    app.init();
  })
});




$('#main').on('click','.username',app.addFriend());

