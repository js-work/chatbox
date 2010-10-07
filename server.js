/*
 *  Chatbox by Daniel J. Pritchett
 *  
 *  Use npm to install the packages by name e.g. npm install socket.io
 *
 *  Development begun September 2010 as a JS exploration
 *
 *  Contacts: 
 *    daniel@sharingatwork.com
 *    http://github.com/dpritchett
 *    http://twitter.com/dpritchett
 *
 */

var $PORT = 80,
    $DB_SERVER = 'dpritchett.couchone.com',
    $DB_PORT = 80;

var Connect = require('connect'),
    sys = require('sys'),
    uuid = require('uuid'),
    io = require('socket.io'),

    couchdb = require('couchdb'),
    couchClient = couchdb.createClient($DB_PORT, $DB_SERVER),
    db = couchClient.db('chatbox');

// Connect middleware serves static files and can handle additional
// features I might want to add later
var server = Connect.createServer(
                Connect.logger(),
                Connect.staticProvider(__dirname + '/public'),

                function(req, res) {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.write('Hello World');
                        res.end();
                }
                );
server.listen($PORT);
console.log("Listening on port " + $PORT + " with backend at " +
                $DB_SERVER + ":" + $DB_PORT);

var $ = JSON.stringify;
var usernames = new Array();
var users = 0;
var userList = function(){
        var list = "";
        for(var i in usernames)
                list += usernames[i] + ' ';
        return (list || "none.");
};

// Socket.io hooks into the server above and intercepts socket comms
var socket = io.listen(server);
socket.on('connection', function(client){
        users++;

        client.send($(
                        { content: "Welcome to chatbox! Other users online: " + userList(),
                                name: "chatbot" }
                     ));
        

        client.on('message', function(message){
                if(usernames[client.sessionId]){
                        client.broadcast($({
                                name: "chatbot",
                                content: usernames[client.sessionId] + " is now " +
                                message.name
                        }
                        ));
                }
                else {
                        client.broadcast($({
                                name: "chatbot",
                                content: message.name + " connected."
                        }));
                }
        usernames[client.sessionId] = message.name;
        if(message.system) return;
        //passing user message to Couch
        db.saveDoc(uuid.generate(), message, function (er, ok) {
                if (er) {
                        console.log('DB error on input: ' +
                                $(message) +
                                $(er));
                        throw new Error($(er)); 
                }	
                else {
                        client.broadcast($(message));
                        console.log('Wrote to couch: ' +
                                sys.inspect(message));}
        });
        });
        client.on('disconnect', function(){
                client.broadcast(
                        $({
                                content: usernames[client.sessionId] + ' disconnected',
                                name: "chatbot"}));
                delete usernames[client.sessionId];
                users--;
        });
});
