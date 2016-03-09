var APP_ID = 'amzn1.echo-sdk-ams.app.b2201586-9f97-45b8-a753-83aa156eeb99';
var AlexaSkill = require('./AlexaSkill');

var handleSwitchRequest = function(intent, session, response, callback){
  //var status = Number(intent.slots.state.value);
  var status = intent.slots.state.value
  var net = require('net');
  var fs = require('fs');
  var HOST = fs.readFileSync('host.txt').toString("utf-8",0,12);
  var PORT = fs.readFileSync('port.txt').toString("utf-8",0,4);

  var client = new net.Socket();
  client.connect(PORT, HOST, function() {
      console.log('CONNECTED TO: ' + HOST + ':' + PORT);
      if(status == ON) {
           console.log('sending status one to jetson');
           client.write('1');
      }
      else if(status == OFF) {
           console.log('sending status zero to jetson');
           client.write('0');
      }
      //client.end();
  });

  client.on('error', function(err) {
      console.log("Error: " + err);
  });
  
  client.on('data', function(data) {
      console.log('DATA: ' + data);
      client.destroy();
      callback();
  });

  client.on('close', function() {
       console.log('Connection closed');
  });
};

var Jetson = function(){
  AlexaSkill.call(this, APP_ID);
};

Jetson.prototype = Object.create(AlexaSkill.prototype);
Jetson.prototype.constructor = Jetson;

Jetson.prototype.eventHandlers.onLaunch = function(launchRequest, session, response){
  var output = 'Welcome to R and M’s home. ' +
    'You can control the ikea lamp with your voice.';

  var reprompt = 'Do you want to switch on or off the ikea lamp?';

  response.ask(output, reprompt);
};

Jetson.prototype.intentHandlers = {
  SwitchLightIntent: function(intent, session, response){
    handleSwitchRequest(intent, 
                        session, 
                        response, 
                        function callback(){
                            var text = 'You asked to switch the light' + intent.slots.state.value;
                            var cardText = text;
                            var heading = 'Welcome to R and Ms smart home';
                            response.tellWithCard(text, heading, cardText);
			});
  },

  HelpIntent: function(intent, session, response){
    var speechOutput = 'Do you want to switch on or off the ikea lamp?';
    response.ask(speechOutput);
  }
};

exports.handler = function(event, context) {
    var skill = new Jetson();
    skill.execute(event, context);
};
