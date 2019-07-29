// Here are the main project controls
const CLIENT_NAME = 'amps-view-server-demo';
const TRANSPORT = 'ws';
const HOST = 'localhost';
const PROTOCOL = 'amps';
const MESSAGE_TYPE = 'json';
const PORT = '9008';
const URI = TRANSPORT + '://' + HOST + ':' + PORT + '/' + PROTOCOL + '/' + MESSAGE_TYPE;


module.exports = {
    CLIENT_NAME: CLIENT_NAME,
    TRANSPORT: TRANSPORT,
    HOST: HOST,
    PROTOCOL: PROTOCOL,
    MESSAGE_TYPE: MESSAGE_TYPE,
    PORT: PORT,
    URI: URI
};
