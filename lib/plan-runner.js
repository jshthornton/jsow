var Q = require('q');

var PlanRunner = function(plan) {
  this.plan = plan;
};

PlanRunner.prototype.run = function() {
  var result = Q(null);

  this.plan.steps.forEach(function (step) {
    result = result.then(step.execute.bind(step));
  });

  return result;
};

module.exports = PlanRunner;