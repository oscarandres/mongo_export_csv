var databaseUrl	= "crossfit";
var collections	= ["affiliates","athletes","results"];
var db		= require("mongojs").connect(databaseUrl,collections);
var headers	= [];
var data        = [];
var fs          = require('fs');

function getHeaders(obj,prefix){
    var alter_key;
    for(key in obj){
        alter_key   = (prefix)?prefix+'[\''+key+'\']':'[\''+key+'\']';
        if(headers.indexOf(alter_key)==-1&&key!='_id'){
            if(typeof obj[key]!='object'){
                headers.push(alter_key);
            }else{
                getHeaders(obj[key],alter_key);
            }
        }
    }
}

function getDataByHeaders(output){
    file        = fs.createWriteStream(output, {'flags': 'a'});
    file.write(headers.join(',')+'\n');
    var aux     = null;
    var value   = null;
    var line    = null;
    data.forEach(
        function(registry){
            line = [];
            headers.forEach(
                function(header){
                    value   = eval('registry'+header);
                    if(value=="undefined"){
                        value='';
                    }
                    line.push(value);
                }
            );
            file.write(line.join(',')+'\n');
        }
    );
}

exports.start	= function(){
	db.results.find({}, function(err, results) {
	    var keys    = [];
	    var key     = null;
	    results.forEach( function(result) {
		getHeaders(result);
                data.push(result);
	  } );
	    getDataByHeaders('prueba.csv');
//            process.exit();
	});
}
