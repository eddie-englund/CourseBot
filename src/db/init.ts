import * as mongoose from 'mongoose';

export const init = () => {
  const dbOptions = {
    useNewUrlParser: true,
    autoIndex: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 5,
    connectTimeoutMS: 10000,
    family: 4
  };
  mongoose.connect('mongodb://localhost:27017/Course', dbOptions);
  mongoose.set('useFindAndModify', false);
  mongoose.Promise = global.Promise;

  mongoose.connection.on('connected', () => {
    console.log('Sucsessfully connected to db');
  });

  mongoose.connection.on('err', err => {
    console.log('MongoDB connectio error', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB has disconnected');
  });
};
