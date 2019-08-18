// @ts-ignore
import errors = require('restify-errors');
import Guild from '../../db/models/Guild';

export = server => {
  // Get all guilds

  server.get('/guilds', async (req, res, next) => {
    try {
      const Guilds = await Guild.find({});
      if (!Guilds) return res.send('There are no guilds');
      else res.send(Guilds);
    } catch (e) {
      return next(new errors.InvalidContentError(e));
    }
  });

  // Get specific guild
  server.get('/guild/:id', async (req, res, next) => {
    try {
      const data = await Guild.findOne({ guildID: req.params.id });
      if (!data)
        return next(
          new errors.ResourceNotFoundError(
            `Could not find a guild with the id: ${req.params.id}`
          )
        );
      res.send(data);
      next();
    } catch (error) {
      return next(
        new errors.ResourceNotFoundError(
          `Could not find a guild with the id: ${req.params.id}`
        )
      );
    }
  });
};
