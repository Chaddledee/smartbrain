const Clarifai = require('clarifai');

const clarApp = new Clarifai.App({
  apiKey: '1461e82e9e6d49fba3ad268ccfe425ab'
})

const handleApiCall = (req, res) => {
	clarApp.models.predict(
		"a403429f2ddf4b49b307e318f00e528b", 
		req.body.input)
	.then(data => {
		res.json(data);
	})
	.catch(err => res.status(400).json('API call failed.'))
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where({id})
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0])
	}).catch(err => res.status(400).json('Unable to retrieve count.'))
}

module.exports = { handleImage, handleApiCall }