const express = require("express");
const router = express.Router();

const Acounter = require('../models/acounter');
const User = require('../models/user');

/**
 * GET user list.
 *
 * @return user list | empty.
 */
router.get('/', (req, res, next) => {
  try {
    Acounter.findOne({ _id: 'users' })
      .then((counter) => {
        req.body.id = counter.seq + 1;

        User.create(req.body)
          .then((data) => {
            Acounter.findOneAndUpdate({ _id: 'users' }, { $inc: { seq: 1 } }, { new: true }).then();
            res.json(data);
          })
          .catch((error) => {
            if (error.code === 11000) {
              res.status(409).json({ error: 'Duplicate record found' });
            } else {
              res.status(500).json({ error: 'Internal server error' });
            }
            next(error);
          });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        next(error);
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

/**
 * GET single user.
 *
 * @return user details | empty.
 */
router.get('/:id', (req, res, next) => {
  try {
    User.findOne({ _id: req.params.id }).then((data) => res.json(data)).catch(next);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

/**
 * POST new user.
 *
 * @return user details | empty.
 */
router.post('/', (req, res, next) => {
  if (req.body.username) {
    Acounter.findOne({ _id: 'users' })
      .then((counter) => {
        req.body.id = counter.seq + 1;

        User.create(req.body)
          .then((data) => {
            Acounter.findOneAndUpdate({ _id: 'users' }, { $inc: { seq: 1 } }, { new: true }).then();
            res.json(data);
          })
          .catch((error) => {
            if (error.code === 11000) {
              res.status(409).json({ error: 'Duplicate record found' });
            } else {
              res.status(500).json({ error: 'Internal server error' });
            }
            next(error);
          });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        next(error);
      });
  } else {
    res.json({ error: 'An input field is either empty or invalid', });
  }
});


/**
 * POST edit user.
 *
 * @return user details | empty.
 */
router.post('/:id', (req, res, next) => {
  let myquery = { _id: ObjectId(req.params.id) };
  if (req.body.title) {
    User.updateOne(myquery, req.body, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    }).then((data) => res.json(data)).catch(next);
  } else {
    res.json({ error: 'An input field is either empty or invalid', });
  }
});

/**
 * DELETE a user.
 *
 * @return delete result | empty.
 */
router.delete('/:id', (req, res, next) => {
  User.findOneAndDelete({ _id: req.params.id }).then((data) => res.json(data)).catch(next);
});

module.exports = router;