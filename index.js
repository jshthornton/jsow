var AWS = require('aws-sdk');
var Q = require('q');
var _ = require('lodash');
var deployment = require('./lib/deployment');
var DeployStep = require('./lib/steps/deploy');
var Plan = require('./lib/plan');
var PlanRunner = require('./lib/plan-runner');

var opsworks = new AWS.OpsWorks({
	'region': 'us-east-1'
});

var filterInstances = function(stacks, layers, instances) {
	var layer = _.find(layers.Layers, function(layer) {
		if(layer.Name === 'hhvm') {
			return true;
		}
	});

	return _.filter(instances.Instances, function(instance) {
		return instance.LayerIds[0] === layer.LayerId && instance.Status === 'online';
	});
};

var staggerInstances = function(stacks, layers, instances) {
	var partition = (instances.length / 2) >> 0;

	var rightSide = instances.splice(0);
	var leftSide = rightSide.splice(0, partition);

	return [
		leftSide,
		rightSide
	];
};

var stackId = 'XXX';
var appId = 'XXX';

deployment.retrieveDescriptions(opsworks, stackId).spread(function(stacks, layers, instances) {
	var filteredInstances = filterInstances(stacks, layers, instances);
	var staggeredInstances = staggerInstances(stacks, layers, filteredInstances);


	var deployStepLeft = new DeployStep(opsworks, stackId, appId, _.pluck(staggeredInstances[0], 'InstanceId'));
	var deployStepRight = new DeployStep(opsworks, stackId, appId, _.pluck(staggeredInstances[1], 'InstanceId'));
	var plan = new Plan([
		deployStepLeft,
		deployStepRight
	]);

	var runner = new PlanRunner(plan);

	//return runner.run();

/*	deployStep.execute().then(function() {
		console.log('hello');
	}, function() {
		console.log(arguments);
	});*/
}).catch(function() {
	console.log(arguments);
});



module.exports = {
	
};