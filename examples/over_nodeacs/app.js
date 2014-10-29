// initialize app
function start(app, express) {
	app.use(express.favicon(__dirname + '/public/images/favicon.ico')); //set favicon
	app.use(express.bodyParser());
}

// release resources
function stop() {

}
