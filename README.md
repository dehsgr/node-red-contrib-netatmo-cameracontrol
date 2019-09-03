# node-red-contrib-netatmo-cameracontrol 

This provides nodes for controlling some functions of Netatmo cameras. It's using the official API to interact with the Netatmo servers. node-red-contrib-netatmo-cameracontrol delivers 2 nodes:

## Netatmo Config
Netatmo Config is a config node to set the userid, password, client id and client secret to login to Netatmo servers.

## Netatmo Camera Control
Netatmo Camera Control makes it possible to control the light (on|auto|off) and the monitoring (on|off). 

This might look like:

`{ light: "auto", monitoring: "off" }`