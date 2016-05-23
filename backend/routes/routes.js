let appRouter = (app, dataObj) => {
	var data = dataObj
	app.get('/:id', (req, res) => {
		console.log(req.params.id)
		res.send(JSON.stringify(data['_' + req.params.id]))
	})
}

module.exports = appRouter
