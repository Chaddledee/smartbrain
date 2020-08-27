const emailPattern = /^[\w!#$%&'*+-/=?^_`{|}~.]+@\w+(?:\.\w+)+$/;

const handleRegister = (req, res, db, bcrypt, salt) => {
	const { name, email, password} = req.body;
	if (!name) {
		res.status(400).json('Invalid name.');
	} else if (!email.match(emailPattern)) {
		console.log(email.match(emailPattern));
		res.status(400).json('Invalid email.');
	} else if (!password) {
		res.status(400).json('Invalid password.');
	} else {
		const hash = bcrypt.hashSync(password, salt);
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('Unable to register.'))
	}
}

module.exports = { handleRegister }