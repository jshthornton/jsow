var Plan = function(steps) {
	this.steps = steps;
};

module.exports = Plan;

/*module.exports = {
	parse: function(plan) {
		return _.map(plan, function(stage) {
			if(_.isFunction(stage)) {
				return Q.fbind(stage);
			}

			if(_.isArray(stage)) {
				return _.partial(deployBatch, stage);
			}

			if(_.isPlainObject(stage)) {
				return _.partial(deployBatch, [stage]);
			}

			throw new Error('Unable to parse plan stage');
		});
	},

	run: function(plan) {
		var result = Q(true);
		plan.forEach(function (f) {
			result = result.then(f);
		});
		return result;
	}
};*/