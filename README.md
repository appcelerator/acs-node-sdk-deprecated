acs-node: The sdk of acs for Node.js
==================

ACS SDK for Node.js

You can install it using npm.
    [sudo] npm install acs-node
    
Usage
-----

Example, do ACS user login:

- var ACS = require('acs-node');
- function login(req, res) {
-	var un = req.body.username;
-	var pw = req.body.password;
-	ACS.Users.login({login: un, password: pw}, function(data) {
-		if(data.success) {
-			var user = data.users[0];
-			if(user.first_name && user.last_name) {
-				user.name = user.first_name + ' ' + user.last_name;
-			} else {
-				user.name = user.username;
-			}
-			req.session.user = user;
-			res.redirect('/');
-		} else {
-			res.render('login', {message: data.message});
-		}
-	});
- }

More examples and how to use a generic method, please look up in the folder test.


Legal
------
This code is proprietary and confidential. 
Copyright (c) 2012 by Appcelerator, Inc.
