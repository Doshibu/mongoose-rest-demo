var mongoose = require('mongoose');
mongoose.set('debug', true);
var Schema = mongoose.Schema;
var schema = mongoose.Schema({value: String});

var countrySchema = new Schema({
	name: {type: String, unique: true}, // Allemagne
	flag: String, // url(deu.jpg)
	pop: Number, // 80000000
	cities: [Schema.Types.ObjectId],
	hdi: String, // 0.74
	gdp: String, // 
	map: String
});
countrySchema.statics.getWorldPop = function(id,cb){
	
}

var citySchema = mongoose.Schema({
	name: {type: String, unique:true, required:[true,'City need a name!']},
	pop: {type:Number, required:[true,'City need a pop!']},
	quality: {type: String, enum: ['*', '**','***']},
	country: String //  Allemagne
});

var Countries = mongoose.model('countries',countrySchema);
var Cities = mongoose.model('cities',citySchema);
var Values = mongoose.model('values', schema);

module.exports = {
    connectDB : function() {
        mongoose.connect('mongodb://localhost:27017/geo',{useMongoClient:true});
    },

    getVal : function(res) {
        Values.find(function(err, result) {
            if (err) {
                console.log(err);
                res.send('database error');
                return
            }
            var values = {};
            for (var i in result) {
                var val = result[i];
                values[val["_id"]] = val["value"]
            }
            res.render('index', {title: 'Geo', values: values});
        });
    },

    sendVal : function(val, res) {
        var request = new Values({value: val});
        request.save(function (err, result) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({status: "error", value: "Error, db request failed"}));
                return
            }
            res.status(201).send(JSON.stringify({status: "ok", value: result["value"], id: result["_id"]}));
        });
    },
		updVal : function(id,val,res){
			console.log('update: '+id+' val: '+val);
			/*
			User.findOneAndUpdate({ 'username' : req.body.username}, user, (err, upd)  => {
           if(err) {
               res.status(400).json({
                   error: err,
                   errorMessage: err
               });
           }
           res.status(200).json({
               comment: 'success.',
               responseType: 'success'
           });
       });
			*/
			Values.findOneAndUpdate(
				{_id: id},
				{value: val}, 
				function(err, upd){
					if (err){
						console.log(err);
						return;
					}
					console.log(upd);
					res.status(201).send(JSON.stringify({status: "ok", value: upd["value"], id: upd["_id"]}));
				});
		},
    delVal : function(id) {
        Values.remove({_id: id}, function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
};