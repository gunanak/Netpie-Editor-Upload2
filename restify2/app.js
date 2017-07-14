var restify = require('restify');
// var config = require('./config');
var restifyBodyParser = require('restify-plugins').bodyParser;
var restifyFullResponse =  require('restify-plugins').fullResponse;
var restifyQueryParser =  require('restify-plugins').queryParser;

var server = restify.createServer();

server.use(restifyFullResponse());
server.use(restifyBodyParser({ mapParams: true }));
server.use(restifyQueryParser());


server.get('/hello',send);

function send(req,res,next){
	res.send('hello');
	next();
}

server.listen(8000,function(){
	console.log('server listening on port number',server.url);
});
var routes = require('./routes')(server);