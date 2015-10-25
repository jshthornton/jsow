var Q = require('q');

module.exports = {
	retrieveDescriptions: function(opsworks, stackId) {
		var describeStacksParams = {
		  StackIds: [stackId]
		};

		var describeInstancesParams = {
		  StackId: stackId
		};

		var describeLayersParams = {
		  StackId: stackId
		};

		var stacksPromise = Q.nbind(opsworks.describeStacks, opsworks)(describeStacksParams);
		var layersPromise = Q.nbind(opsworks.describeLayers, opsworks)(describeLayersParams);
		var instancesPromise = Q.nbind(opsworks.describeInstances, opsworks)(describeInstancesParams);

		return Q.all([stacksPromise, layersPromise, instancesPromise]);
	}
};