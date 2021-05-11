module.exports = function(NodeRED) {
    'use strict';

    // ~~~ constructor / destructor ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function CameraControl(myNode)
    {
        NodeRED.nodes.createNode(this, myNode);

        var Platform = this;
    
        this.cameraid = myNode.cameraid;
        this.config = NodeRED.nodes.getNode(myNode.confignode);

        Platform.on('input', function (myMessage) {
			Platform.SendCommand(myMessage);
        });
    }

    NodeRED.nodes.registerType('netatmo-cameracontrol', CameraControl);

    // ~~~ functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    CameraControl.prototype.SendCommand = function(myMessage)
    {
        var Platform = this;

        const request = require('request');
        request.post({
            url: 'https://api.netatmo.net/oauth2/token',
            form: {'grant_type': 'password',
                'client_id': Platform.config.clientid,
                'client_secret': Platform.config.clientsecret,
                'username': Platform.config.userid,
                'password': Platform.config.passwd,
                'scope': 'read_station read_thermostat write_thermostat read_camera write_camera access_camera read_presence access_presence write_presence read_homecoach'
            }
        }, function(myError, myResponse, myBody) {
            if(myError) {
                Platform.warn('There was an Error authenticating: ' + myError);
            } else {
                request.get('https://api.netatmo.net/api/gethomedata?access_token=' + JSON.parse(myResponse.body).access_token + '&size=50',
                function(myError, myResponse, myBody) {
                    if(myError) {
                        Platform.warn('There was an Error getting Camera Data: ' + myError);
                    } else {
						try {
							var hs = JSON.parse(myResponse.body).body.homes;
						}
						catch (e) {
							Platform.warn('There was an Error getting Camera Data: ' + myResponse.body);
						}
                        for (var h = 0; h < (hs || []).length; h++) {
                            var cs = hs[h].cameras;
                            for (var c = 0; c < cs.length; c++) {
                                if (cs[c].id.toLowerCase() === Platform.cameraid.toLowerCase()) {
                                    if ('light' in myMessage.payload) {
                                        Platform.log('Setting Cameras Light Status to \'' + myMessage.payload.light + '\'');
                                        request.get(cs[c].vpn_url + '/command/floodlight_set_config?config={"mode": "' + myMessage.payload.light + '"}',
                                        function(myError, myResponse, myBody) {
                                            if(myError) {
                                                Platform.warn('There was an Error setting Cameras Light Status: ' + myError);
                                            }
                                        });
                                    }

                                    if ('monitoring' in myMessage.payload) {
                                        Platform.log('Setting Cameras Monitoring Status to \'' + myMessage.payload.monitoring + '\'');
                                        request.get(cs[c].vpn_url + '/command/changestatus?status=' + myMessage.payload.monitoring,
                                        function(myError, myResponse, myBody) {
                                            if(myError) {
                                                Platform.warn('There was an Error setting Cameras Monitoring Status: ' + myError);
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                });
            }
        });           
    }
};