const { model, Schema } = require('mongoose');

const ClientSchema = new Schema({
    client: {
        type: String,
        default: 'Course'
    },
    commandsFinished: {
        type: Number,
        default: 0
    },
    lastCommand: String
});

const Client = model('client', ClientSchema);
module.exports = Client;
