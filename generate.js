var argv = require('optimist')
    .usage('Usage: $0 -b <number of batches to generate> [-u <number of users>] [-w <number of worlds>] [-pc <number of pooled content items>]')
    
    .demand('b')
    .alias('b', 'batches')
    .describe('b', 'Number of batches to generate')
    
    .alias('u', 'users')
    .describe('u', 'Number of users per batch')
    .default('u', 500)
    
    .alias('w', 'worlds')
    .describe('w', 'Number of worlds per batch')
    .default('w', 250)

    .alias('c', 'pooledcontent')
    .describe('c', 'Number of pooled content items per batch')
    .default('c', 2000)
    .argv;

var general = require("./api/general.js");
var user = require("./api/user.model.js");
var contacts = require("./api/contacts.model.js");
var world = require("./api/world.model.js");
var pooledcontent  = require("./api/pooledcontent.model.js");

//////////////////////////////////////
// OVERALL CONFIGURATION PARAMETERS //
//////////////////////////////////////

var SCRIPT_FOLDER = "scripts";

var TOTAL_BATCHES = argv.batches;
var USERS_PER_BATCH = argv.users;
var WORLDS_PER_BATCH = argv.worlds;
var CONTENT_PER_BATCH = argv.pooledcontent;
var COLLECTIONS_PER_BATCH = 0;

////////////////////
// KICK OFF BATCH //
////////////////////

var batches = [];

var run = function(){
    for (var i = 0; i < TOTAL_BATCHES; i++){
        var batch = generateBatch(i);
        // Write users to file
        general.writeFileIntoArray("./" + SCRIPT_FOLDER + "/users/" + i + ".txt", batch.users);
        // Write contacts to file
        general.writeFileIntoArray("./" + SCRIPT_FOLDER + "/contacts/" + i + ".txt", batch.contacts);
        // Write worlds to file
        general.writeFileIntoArray("./" + SCRIPT_FOLDER + "/worlds/" + i + ".txt", batch.worlds);
        // Write content to file
        general.writeFileIntoArray("./" + SCRIPT_FOLDER + "/pooledcontent/" + i + ".txt", batch.pooledcontent);
        // Write collections to file
        // TODO
        // Write sharing to file
        // TODO
        // Write areas to file
        // TODO
        // Write messages to file
        // TODO
        batches.push(batch);
    }
};

var generateBatch = function(id){
    console.log("Generating Batch " + id);
    var batch = {};
    batch.users = [];
    for (var u = 0; u < USERS_PER_BATCH; u++){
        try {
            batch.users.push(new user.User(id));
        } catch (err){u--;}
    }
    batch.contacts = contacts.generateContacts(batch.users);
    batch.worlds = [];
    for (var w = 0; w < WORLDS_PER_BATCH; w++){
        try {
            batch.worlds.push(new world.World(id, batch.users));
        } catch (err2){w--;}
    }
    batch.worlds = world.setWorldMemberships(id, batch.worlds, batch.users);
    batch.pooledcontent = [];
    for (var c = 0; c < CONTENT_PER_BATCH;c++) {
        try {
            batch.pooledcontent.push(new pooledcontent.PooledContent(id, batch.users));
        } catch (err2){c--;console.log(err2);}
    }

    console.log("Finished Generating Batch " + id);
    console.log("=================================");
    return batch;
};

run();
