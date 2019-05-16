const express = require('express')
const rpn = require('request-promise-native')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

if (process.env.USERS_SERVICE_HOST === undefined) {
  process.env.USERS_SERVICE_HOST = 'localhost';
  process.env.USERS_SERVICE_PORT = '1337';
}
if (process.env.INFO_SERVICE_HOST === undefined) {
  process.env.INFO_SERVICE_HOST = 'localhost';
  process.env.INFO_SERVICE_PORT = '1338';
}

const users = `http://${process.env.USERS_SERVICE_HOST}:${process.env.USERS_SERVICE_PORT}`
const info = `http://${process.env.INFO_SERVICE_HOST}:${process.env.INFO_SERVICE_PORT}`

const serviceUrls = {
  users,
  info,
};

/**
 * In kubernetes when you are ssh into a pod and run `printnev`
 * you will get all of the environment variables. 
 * In these you can find your service host and port also.
 * It uses the name you gave to your service. (kubectl get svc)
 * You can use these to access other pods.
 * 
 * The key point here is, when a new service is created/deployed 
 * for the first time, the old services wont get those envvars, so you need
 * to restart your old pods.
 * 
 * Example:
 * $ kubectl get pod
 * $ kubectl exec -it some_pod -- sh
 * #podname printenv
 * PLAYGROUND_SERVICE_SERVICE_PORT=80
 * PLAYGROUND_SERVICE_SERVICE_HOST=X.X.X.X
 * which is referring to: <YOUR_SERVICE_NAME>_SERVICE_HOST and <YOUR_SERVICE_NAME>_SERVICE_PORT
 * if you have multiple ports in your service they will be tagged there too as: <YOUR_SERVICE_NAME>_SERVICE_PORT_<NAMETAG_OF_PORT>
 * so you can refer to these all the time.
 */

const exampleAuthMiddleware = (req, res, next) => {
  console.log('MIDDLEWARE - example auth middleware running in API-Gateway requests...')
  if (req.headers['authorization'] && req.headers['authorization'] === 's4mpl3t0k3n') {
    console.log('Successfull authentication using a token...');
    next()
  } else {
    console.log('Missing token...')
    return res.status(401).json({message: 'Unauthorized.'});
  }
}

app.post('/api/v1/login', async (req, res) => {
  let result;
  try {
    result = await rpn({
      uri: `${serviceUrls.users}/api/v1/users/login`,
      method: 'POST',
      body: req.body,
      json: true,
    })
  } catch (err) {
    switch (err.statusCode) {
      case 404:
        console.log('API-GATEWAY: POST - /api/v1/login - User not found.');
        return res.status(404).send();
      case 500:
        console.log('API-GATEWAY: POST - /api/v1/login - Error:', err);
        return res.status(500).send();
    }
    // res.status(500).json({message: 'Server Error.'});
  }
  console.log('API-GATEWAY: POST - /api/v1/users/login - Success', result);
  return res.status(200).json(result);
})

app.get('/api/v1/users', exampleAuthMiddleware, async (req, res) => {
  let result;

  try { 
    result = await rpn({
      method: 'GET',
      uri: `${serviceUrls.users}/api/v1/users/list`,
      json: true,
    });
  } catch (err) {
    return res.status(500).json({message: 'Server error.'});
  }

  console.log('API-GATEWAY: GET - /api/v1/users');
  return res.status(200).json(result);
})

app.get('/api/v1/info', exampleAuthMiddleware, async (req, res) => {
  let result;

  try {
    result = await rpn({
      method: 'GET',
      uri: `${serviceUrls.info}/api/v1/blogs`,
      json: true,
    });
  } catch (err) {
    return res.status(500).json({message: 'Server error.'});
  }
  console.log('API-GATEWAY: GET - /api/v1/info');
  return res.status(200).json(result);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))