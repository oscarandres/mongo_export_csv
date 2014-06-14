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
    process.stdout.write('Writting file...');
    file        = fs.openSync(output, 'a')
    fs.writeSync(file,headers.join(';')+'\n');
    var value   = null;
    var line    = null;
    data.forEach(
        function(registry){
            line = [];
            headers.forEach(
                function(header){
                    try{
                        value   = eval('registry'+header);
                    }catch(err){
                        value   = '';
                    }
                    if(value=="undefined"){
                        value='';
                    }
                    line.push(value);
                }
            );
            fs.writeSync(file,line.join(';')+'\n');
        }
    );
    fs.closeSync(file);
    process.stdout.write("OK\n");
    process.stdout.write(output+" created.\n");
    process.exit();
}

exports.start	= function(){
    var argv        = require('yargs')
            .demand(['d','c','f'])
            .alias('d','database')
            .alias('c','collection')
            .alias('f','file')
            .describe('d','Mongo Database name')
            .describe('c','Mongo Collection name')
            .describe('f','Output csv file name')
            .argv;
    databaseUrl = argv.database;
    collections = [argv.collection];
    db          = require("mongojs").connect(databaseUrl,collections);
    var file    = argv.file;
    var collection  = eval('db.'+argv.collection);
    collection.find({}, function(err, results) {
        process.stdout.write('Getting data...');
        results.forEach( function(result) {
            getHeaders(result);
            data.push(result);
      } );
    process.stdout.write("OK\n");
    getDataByHeaders(file);
    });
}
