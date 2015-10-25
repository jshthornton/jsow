var Gogen = require('gogen');
var Q = require('q');
var _ = require('lodash');

var DeployStep = function(opsworks, stackId, appId, instanceIds) {
  this.opsworks = opsworks;
  this.stackId = stackId;
  this.appId = appId;
  this.instanceIds = instanceIds;
};

DeployStep.prototype._waitUntilDeployed = function(data) {
  var params = {
    DeploymentIds: [data.DeploymentId]
  };

  var operation = _.partial(Q.nbind(this.opsworks.describeDeployments, this.opsworks), params);
  var condition = function(data) {
    switch(data.Deployments[0].Status) {
      case 'successful':
        return true;
      case 'failed':
        throw new Error('Deployment Failed');
      case 'running':
        return false;
      default:
        throw new Error('Something has gone horribly wrong with the response. Status: ' + data.Deployments[0].Status);
    }
  };

  var gogen = new Gogen(operation, condition, {});

  return gogen.start();

};

DeployStep.prototype.execute = function() {

  var createDeploymentParams = {
    Command: {
      Name: 'deploy',
      Args: {}
    },
    StackId: this.stackId,
    AppId: this.appId,
    InstanceIds: this.instanceIds
  };

  return Q.nbind(this.opsworks.createDeployment, this.opsworks)(createDeploymentParams).then(function(data) {
    console.log('moooo');

    return this._waitUntilDeployed(data);
  }.bind(this), function() {
    console.log(arguments);
  });
};

module.exports = DeployStep;
