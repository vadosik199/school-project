var mongoose = require("mongoose");

exports.connect = (url, callback) => {
	mongoose.connect(url, (err) => {
		if(err)
			callback(err);
		callback(null);
	});
}
