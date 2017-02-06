# botkit-script-loader

[![Greenkeeper badge](https://badges.greenkeeper.io/ponko2/botkit-script-loader.svg)](https://greenkeeper.io/)
[![npm version](https://badge.fury.io/js/%40ponko2%2Fbotkit-script-loader.svg)](https://badge.fury.io/js/%40ponko2%2Fbotkit-script-loader)
[![Build Status](https://travis-ci.org/ponko2/botkit-script-loader.svg?branch=master)](https://travis-ci.org/ponko2/botkit-script-loader)

# Installation

```sh
npm install @ponko2/botkit-script-loader --save
```

## Usage

```js
var Path         = require('path');
var Botkit       = require('botkit');
var ScriptLoader = require('@ponko2/botkit-script-loader');

var controller = Botkit.slackbot({
  debug: false
});

controller.spawn({
  token: process.env.BOTKIT_SLACK_TOKEN
}).startRTM(function (err, bot) {
  if (err) {
    throw new Error(err);
  }

  var loader  = new ScriptLoader(controller, bot);
  var scripts = Path.resolve(__dirname, 'scripts');

  loader.load(scripts);
});
```
