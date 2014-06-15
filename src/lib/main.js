(function() {
    var mongo_export_csv   = require ('./mongo_export_csv');
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
    mongo_export_csv.start(databaseUrl,collections,file);
}).call(this);