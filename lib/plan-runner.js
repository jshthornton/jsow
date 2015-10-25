var PlanRunner = function(plan) {
  this.plan = plan;
};

PlanRunner.prototype.run = function() {
  var result = Q(true);

  this.plan.steps.forEach(function (step) {
    result = result.then(step.execute);
  });
  return result;
};

module.exports = PlanRunner;