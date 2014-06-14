//var databaseUrl	= "crossfit";
var databaseUrl;
//var collections	= ["affiliates","athletes","results"];
var collections;
var db;
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
    file.write(headers.join(';')+'\n');
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
            file.write(line.join(';')+'\n');
        }
    );
}

exports.start	= function(){
    var args    = process.argv;
    if(args.length<5){
        console.log("Use:\nmongo2csv database collection output_file");
        process.exit();
    }
    databaseUrl = args[2];
    collections = [args[3]];
    db          = require("mongojs").connect(databaseUrl,collections);
    var file    = args[4];
    db.results.find({}, function(err, results) {
        results.forEach( function(result) {
            getHeaders(result);
            data.push(result);
      } );
    getDataByHeaders(file);
    });
}
