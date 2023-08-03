const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Auth = require('./auth-model.js');
const { JWT_SECRET, BCRYPT_ROUNDS } = require('../../config');
const { checkUsernameExists } = require('./auth-middleware.js');

router.post('/register', checkUsernameExists,  (req, res) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
 const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: 'username and password required' });
  } else {
    bcrypt.hash(password, BCRYPT_ROUNDS, (err, hash) => {
      if (err) {
        res.status(500).json({ message: 'error hashing password' });
      } else {
        req.body.password = hash;
        Auth.register(req.body)
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((err) => {
            res.status(500).json({ message: err.message });
          });
      }
    })
  }
      
});

router.post('/login', (req, res) => {
    if (!req.body.username || !req.body.password) {
    res.status(400).json({ message: 'username and password required' });
    } else {
      Auth.findByUsername(req.body.username)
        .then(([user]) => {
          if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const token = buildToken(user);
            res.status(200).json({
              message: `welcome, ${user.username}`,
              token,
            })
            console.log(`token: ${token}`)
            console.log(req.headers)
          } else {
            res.status(401).json({ message: 'invalid credentials' });
          }
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

const buildToken = (user) => {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: '1d',
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

module.exports = router;
