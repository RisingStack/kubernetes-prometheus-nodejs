const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 1338;

app.use(bodyParser.json());

const exampleInfoAboutUsers = {
  John: {
    blog: 'https://johnsblog.com/'
  },
  Adam: {
    blog: 'https://adamsblog.com/'
  },
  Eve: {
    blog: 'https://evesblog.com/'
  }
}

app.get('/api/v1/blogs', async (req, res) => {
  console.log('INFO: /GET - INFO');
  return res.status(200).json(exampleInfoAboutUsers);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
