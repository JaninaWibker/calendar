const express = require('express'),
      body_parser = require('body-parser'),
      app = express(),
      port = 9123

let data = {
  _123: {
    text: 'this is the text for 123',
    title: '123'
  }
}

app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: true }))

let routes = require('./routes/routes.js')(app)

const server = app.listen(port, () => {
	console.log('Server started on port ' + port)
})
