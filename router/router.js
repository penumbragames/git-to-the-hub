/**
 * @fileoverview This file contains the code for the different routes on the
 *   web server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

// Dependencies
var express = require('express');

var AccountManager = require('../lib/AccountManager');

var accountManager = AccountManager.create();
var router = express.Router();

// Routing
router.get('/', function(request, response) {
  response.render('index', {
    dev_mode: request.app.locals.dev_mode,
    username: request.session.username
  });
});

router.get('/game', function(request, response) {
  if (request.session.username) {
    response.render('game', {
      dev_mode: request.app.locals.dev_mode,
      username: request.session.username
    });
  } else {
    response.render('index', {
      dev_mode: request.app.locals.dev_mode,
      message: "You must be logged in to play."
    });
  }
})

router.get('/register', function(request, response) {
  response.redirect('/');
});

router.post('/register', function(request, response) {
  var username = request.body.username;
  var password = request.body.password;
  var confirmPassword = request.body.confirmPassword;
  var email = request.body.email;

  if (request.session.username) {
    response.json({
      success: false,
      message: 'You must log out in order to register a user!'
    });
  }
  if (!AccountManager.isValidUsername(username)) {
    response.json({
      success: false,
      message: 'Invalid username!'
    });
  }
  if (!AccountManager.isValidPassword(password)) {
    response.json({
      success: false,
      message: 'Your password is too short.'
    });
  }
  if (password != confirmPassword) {
    response.json({
      success: false,
      message: 'Your passwords do not match!'
    });
  }

  accountManager.registerUser(username, password, email, function(status) {
    if (status) {
      request.session.username = username;
      response.json({
        success: true,
        message: 'Successfully registered!'
      })
    } else {
      response.json({
        success: false,
        message: 'Your username is taken.'
      })
    }
  });
});

router.get('/login', function(request, response) {
  response.redirect('/');
});

router.post('/login', function(request, response) {
  var username = request.body.username;
  var password = request.body.password;

  if (request.session.username) {
    response.json({
      success: false,
      message: 'You are already logged in.'
    });
  }
  accountManager.isUserAuthenticated(username, password, function(status) {
    if (status) {
      request.session.username = username;
      response.json({
        success: true,
        message: 'Successfully logged in!'
      });
    } else {
      response.json({
        success: false,
        message: 'Invalid credentials.'
      });
    }
  });
});

router.get('/logout', function(request, response) {
  request.session.username = null;
  response.redirect('/');
});

router.post('/logout', function(request, response) {
  request.session.username = null;
  response.redirect('/');
});

router.get('/test', function(request, response) {
  if (request.app.locals.dev_mode) {
    console.log(request.session.username);
    response.render('test', {
      dev_mode: true
    });
  }
  response.redirect('/')
});

module.exports = router;
