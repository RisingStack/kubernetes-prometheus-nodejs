const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const app = express();
const port = process.env.PORT || 1337;

app.use(bodyParser.json());

const exampleUsers = {
  John: {
    username: 'John',
    password: 'John',
    email: 'John@gmail.com'
  },
  Adam: {
    username: 'Adam',
    password: 'Adam',
    email: 'Adam@gmail.com'
  },
  Eve: {
    username: 'Eve',
    password: 'Eve',
    email: 'Eve@gmail.com'
  }
}

app.get('/api/v1/users/list', async (req, res) => {
  console.log('USERS: /GET - USERS');
  return res.status(200).json(exampleUsers);
})

app.post('/api/v1/users/login', async(req, res) => {
  console.log('USERS: /POST - USERS/LOGIN');
  if (req.body.username === '' || req.body.password === '') {
    return res.status(400).json({message: 'Missing username and password.'});
  } else {
    let found = false;
    _.forEach(exampleUsers, (value, key) => {
      if (value.username === req.body.username && value.password === req.body.password ) {
        found = true;
        return;
      }
    })
    return ((found) ? res.status(200).json({message: 'Successfull Login.'}) : res.status(404).send());
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))