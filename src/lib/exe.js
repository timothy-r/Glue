var request = require('request'),
    Payload = require('./payload');

/**
 * Executes an array of Command objects
 * Passes the response from each command into the next command
 *
 * parser provides commands in order to be executed
 * callback used when the execution of the commands is completed
*/
function Exe(parser, callback) {
    this.parser = parser;
    this.callback = callback;
};

/**
 * Start running the commands from the script
 */
Exe.prototype.start = function() {
    console.log('Start');
    this.runNext(new Payload(''));
};

/**
 * Actually we just want the content-type / mime-type of the body string
 * not all the previous response headers. Maybe use a composite type of string and mime-type
 */
Exe.prototype.runNext = function(payload) {

    var command = this.parser.next();

    if (command) {
        if (command.operator == 'split'){
            // split body, expect json array
            // caution - payload might be an array if split appears twice in the script...
            this.runNext(payload.split());
        } else {
            if (payload instanceof Array){
                this.request_count = payloads.length;
                // generate a request per item
                for(var key in payloads) {
                    this.request(command, payloads[key];
                }
            } else {
                this.request_count = 1;
                this.request(command, payload);
            }
        }
    } else {
        this.end(join(payload));
    }
};

Exe.prototype.request(command, payload) {
    var exe = this;
    command['body'] = payload.content;
    command['headers'] = [];
    command['headers']['content-type'] = payload.type;

    console.log('request(): making request to : ' + command.uri + ' : ' + JSON.stringify(command[headers]) + ' ' + exe.request_count);
    request(command, function(error, response, response_body) {
        if (!error && response.statusCode == 200){
            console.log('Success');
            // call receiveResponse 
            exe.receiveResponse(new Payload(response_body));
        } else {
            // end the script here and respond
            exe.end('Failure: ' + error);
        }
    });
};

/*
 * Callback from each request
*/
Exe.prototype.receiveResponse = function(payload) {
    this.incoming_payloads.push(payload);
    // if incoming_payloads equals request_count then call runNext
    if (this.incoming_payloads.length == this.request_count){
        this.request_count = 0;
        // join incoming_payloads and run next command
        this.runNext(join(this.incoming_payloads));
    }
}

Exe.prototype.end = function(result) {
    console.log('End');
    // return the result as a string
    this.callback && this.callback(result);
};

/**
 * Should / can this be on Payload class?
 */
function join(payload) {
    if (payload instanceof Array){
        var all = [];
        for(var item in payload){
            all.push(payload.content);
        }
        return JSON.stringify(all);
    } else {
        return payload;
    }
}

module.exports = Exe;
