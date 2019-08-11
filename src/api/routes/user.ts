// @ts-ignore
const errors = require('restify-errors');
import Profile from '../../db/models/Profile';

export = server => {
  // Get all users

  server.get('/users', async (req, res, next) => {
    try {
      const Users = await Profile.find({});
      if (!Users) return res.send('There are no users');
      else res.send(Users);
    } catch (e) {
      return next(new errors.InvalidContentError(e));
    }
  });

  // Get specific user
  server.get('/user/:id', async (req, res, next) => {
    try {
      const User = await Profile.findOne({ userID: req.params.id });
      if (!User)
        return next(
          new errors.ResourceNotFoundError(`Could not find a user with the id: ${req.params.id}`)
        );
      res.send(User);
      next();
    } catch (error) {
      return next(
        new errors.ResourceNotFoundError(`Could not find a user with the id: ${req.params.id}`)
      );
    }
  });
};
