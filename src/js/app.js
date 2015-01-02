/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Accel = require('ui/accel');
var ajax = require('ajax');
var timerHandle = null;
var g_hostName = '192.168.65.11';

// REST call
function executeLightsAudioMethod(methodName, methodParams) {
    console.log('executeRemoteMethod enetered!');

    var ourl = 'http://' + g_hostName + ':8080/crest/obj/lights_audio';
    obj = {};
    obj["method"] = methodName;
    obj["params"] = methodParams;

    ajax(
      { url: ourl,
        method: 'post',
        data: obj,
        type: 'json'
      },
      function(data, stat) {
          console.log('Stat: ' + stat);
          console.log('Fetched data: ' + data);
      },
      function(error, stat) {
          console.log('Stat: ' + stat);
          if (stat != 204) {
              console.log('Error: ' + JSON.stringify(error));
              clearInterval(timerHandle);
              lightMenu.hide();
              audioMenu.hide();
              main.show();
          }
      }
      );
}

function getSystemInfo() {
    console.log('getSystemInfo enetered!');

    var ourl = 'http://' + g_hostName + ':8080/crest/obj/system';

    ajax(
      { url: ourl,
        method: 'get',
        data: null,
        type: 'json'
      },
      function(data, stat) {
          console.log('Stat: ' + stat);
          var sysName = data.object_properties.system_name;
          console.log('System name: ' + sysName);
          var sysUptime = data.object_properties.web_svc_uptime;
          console.log('Uptime: ' + sysUptime);
          main.body(sysName + '\n' + sysUptime);
      },
      function(error, stat) {
          console.log('Stat: ' + stat);
          if (stat != 204) {
              console.log('Error: ' + JSON.stringify(error));
              clearInterval(timerHandle);
              lightMenu.hide();
              audioMenu.hide();
              main.show();
          }
      }
      );
}

// Main menu handlers
function handleHomeSelect() {
    console.log('handleHomeSelect enetered!');
    var params = ["mode_home"];
    executeLightsAudioMethod("set_mode", params);
}

function handleByeSelect() {
    console.log('handleByeSelect enetered!');
    var params = ["mode_away"];
    executeLightsAudioMethod("set_mode", params);
}

function handleAudioSelect() {
    console.log('handleAudioSelect enetered!');
    audioMenu.show();
}

function handleLightingSelect() {
    console.log('handleLightingSelect enetered!');
    lightMenu.show();
}

// Lighting handlers
function lightsOnSelect() {
    console.log('lightsOnSelect enetered!');
    var params = ["lr_lights_on"];
    executeLightsAudioMethod("set_lighting_level", params);
}

function lightsOffSelect() {
    console.log('lightsOffSelect enetered!');
    var params = ["lr_lights_off"];
    executeLightsAudioMethod("set_lighting_level", params);
}

function lightsUpSelect() {
    console.log('lightsUpSelect enetered!');
    var params = ["lr_lights_up"];
    executeLightsAudioMethod("set_lighting_level", params);
}

function lightsDownSelect() {
    console.log('lightsDownSelect enetered!');
    var params = ["lr_lights_down"];
    executeLightsAudioMethod("set_lighting_level", params);
}

// Audio handlers
function audioMuteSelect() {
    console.log('audioMuteSelect enetered!');
    var params = ["audio_volume_mute"];
    executeLightsAudioMethod("set_audio_mode", params);
}

function audioUnmuteSelect() {
    console.log('audioUnmuteSelect enetered!');
    var params = ["audio_volume_mute"];
    executeLightsAudioMethod("set_audio_mode", params);
}

function audioUpSelect() {
    console.log('audioUpSelect enetered!');
    var params = ["audio_volume_up"];
    executeLightsAudioMethod("set_audio_mode", params);
}

function audioDownSelect() {
    console.log('audioDownSelect enetered!');
    var params = ["audio_volume_down"];
    executeLightsAudioMethod("set_audio_mode", params);
}

// Main menu
var menu = new UI.Menu({
sections: [{
  items: [{
    title: 'Hello!',
    subtitle: 'Just came home'
  }, {
    title: 'Bye!',
    subtitle: 'Leaving home'
  }, {
    title: 'Audio',
    subtitle: 'Control Audio'
  }, {
    title: 'Lighting',
    subtitle: 'Control Lights'
  }]
}]
});

menu.on('select', function(e) {
console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
console.log('The item is titled "' + e.item.title + '"');
  
  if (e.itemIndex == 0) {
        // Arrived home
        handleHomeSelect();
  }
  else if (e.itemIndex == 1) {
        // Leaving home
        handleByeSelect();
  }
  else if (e.itemIndex == 2) {
        // Audio control
        handleAudioSelect();
  }
  else if (e.itemIndex == 3) {
        // Audio control
        handleLightingSelect();
  }
});

// Lights menu
var lightMenu = new UI.Card({
    title: "Lights",
    subtitle: "Lighting Control",
    action: {
        up: 'images/up_arrow.png',
        down: 'images/down_arrow.png'
    },
    style: 'large'
});

lightMenu.on('click', 'up', function() {
    console.log('Lights menu up was clicked');
    lightsUpSelect();
});

lightMenu.on('click', 'down', function() {
    console.log('Lights menu down was clicked');
    lightsDownSelect();
});

lightMenu.on('longClick', 'up', function() {
    console.log('Lights menu long up was clicked');
    lightsOnSelect();
});

lightMenu.on('longClick', 'down', function() {
    console.log('Lights menu long down was clicked');
    lightsOffSelect();
});

// Audio menu
var audioMenu = new UI.Card({
    title: "Audio",
    subtitle: "Volume Control",
    action: {
        up: 'images/volume_up.png',
        select: 'images/volume_mute.png',
        down: 'images/volume_down.png'
    },
    style: 'large'
});

audioMenu.on('click', 'up', function() {
    console.log('Audio menu up was clicked');
    // Audio muted
    audioUpSelect();
});

audioMenu.on('click', 'down', function() {
    console.log('Audio menu down was clicked');
    // Audio muted
    audioDownSelect();
});

audioMenu.on('click', 'select', function() {
    console.log('Audio menu select was clicked');
    // Audio muted
    audioMuteSelect();
});

// Main splash
var main = new UI.Card({
  title: 'Rosetta Demo',
  banner: 'images/crestron_logo_large.png',
  body: 'Press any button',
  style: 'large'
});

main.on('click', 'up', function(e) {
  clearInterval(timerHandle);
  menu.show();
});

main.on('click', 'select', function(e) {
  clearInterval(timerHandle);
  menu.show();
});

main.on('click', 'down', function(e) {
  clearInterval(timerHandle);
  menu.show();
});

// One time initialization
Accel.init();
Accel.on('tap', function(e) {
    // Toggle audio mute when user flicks his wrist
    audioMuteSelect();
});

main.show();
timerHandle = setInterval(function() {menu.show(); clearInterval(timerHandle);}, 3000);
getSystemInfo();

