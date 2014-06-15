(function() {
    var mongo2csv   = require ('./mongo2csv');
    var argv        = require('yargs')
            .demand(['d','c','f'])
            .alias('d','database')
            .alias('c','collection')
            .alias('f','file')
            .describe('d','Mongo Database name')
            .describe('c','Mongo Collection name')
            .describe('f','Output csv file name')
            .argv;
    var databaseUrl = argv.database;
    var collections = [argv.collection];
    var file        = argv.file;
    mongo2csv.start(databaseUrl,collections,file);
}).call(this);