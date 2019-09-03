module.exports = function(NodeRED) {
  function NetatmoNode(myConfig) {
      NodeRED.nodes.createNode(this, myConfig);
      this.userid = myConfig.userid;
      this.passwd = myConfig.passwd;
      this.clientid = myConfig.clientid;
      this.clientsecret = myConfig.clientsecret;
  }

  NodeRED.nodes.registerType("netatmo-config", NetatmoNode, {
      credentials: {
          userid: {type: "text"},
          passwd: {type: "password"},
          clientid: {type: "text"},
          clientsecret: {type: "text"}
      }
  });
};