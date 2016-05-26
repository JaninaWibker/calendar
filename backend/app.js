'use strict'

const Hapi = require('hapi')
const fs = require('fs')
const path = './data.json'

const server = new Hapi.Server()
server.connection({ port: 9123, routes: { cors: true } })

let getData = (request, reply) => {
	let l_id = encodeURIComponent(request.params.id)
	console.log(l_id, 'GET')
	if(store().get(l_id)){
		reply(store().get(l_id))
	} else {
		reply('[]')
	}
}

let setData = (request, reply) => {
	let l_id = encodeURIComponent(request.params.id)
	console.log(request.payload.key)
	console.log(l_id, 'POST')
	if(store().get(l_id)){
		store().change(l_id, JSON.parse(request.payload.key))
		console.log(_stores)
		reply(store().get(l_id))
	} else {
		reply('[]')
	}
}

let newId = (request, reply) => {
	let l_id = Math.random().toString(36).substring(2,26)
	store().create(l_id, [])
	reply(l_id)
}

server.route({ method: 'GET', path: '/api/{id}', handler: getData})
server.route({ method: 'POST', path: '/api/{id}', handler: setData})
server.route({ method: 'GET', path: '/api/new', handler: newId})

server.start((err) => {
	if(err) {
		throw err
	}
	console.log('Server started on', server.info.uri)
})



let _stores = {}
let store = () => {
  return {
    create: function(name, data) {
      _stores[name] = {'data': data, 'callback': []}
    },
    subscribe: function(name, callback) {
      _stores[name].callback[_stores[name].callback.length] = callback
    },
    change: function(name, data) {
			if(Array.isArray(data)){
				_stores[name].data = data
			} else {
	      for (let i = 0; i < Object.keys(_stores[name].data).length; i++) {
	        if(data[Object.keys(_stores[name].data)[i]]) {
	          _stores[name].data[Object.keys(_stores[name].data)[i]] = data[Object.keys(_stores[name].data)[i]]
	        }
	      }
	      for (let i = 0; i < _stores[name].callback.length; i++) {
	        _stores[name].callback[i].call(this, _stores[name].data)
	      }
			}
    },
    get: function(name) {
			if(_stores[name]) {
      	return _stores[name].data
			} else {
				return null
			}
    }
  }
}

let read = () =>{
  fs.readFile(path, 'utf8', function(err, data){
		if (err) throw err;
		_stores = JSON.parse(data)
	})
}

let write = () => {
	fs.writeFile(path, JSON.stringify(_stores), function(err){
		if (err) throw err;
	})
}
read()
setInterval(write, 5000)
