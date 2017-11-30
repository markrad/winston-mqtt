const util     = require('util');
const winston  = require('winston');
const mqtt     = require('mqtt');

const MqttTransport = winston.transports.MqttTransport = function MqttTransport(options) {
  if (!options.name) {
    throw new Error('winston-mqtt requires a "name" property to be provided');
  }
  this.name       = options.name;
  this.topic      = options.topic || 'logs';
  this.level      = options.level || 'info';
  this.mqttClient = mqtt.connect(options.host || 'mqtt://localhost:1883');
};

/** @extends winston.Transport */
util.inherits(MqttTransport, winston.Transport);

/**
 * Define a getter so that `winston.transports.MqttTransport`
 * is available and thus backwards compatible.
 */
winston.transports.MqttTransport = MqttTransport;

/**
 * Closes the mqttClient connection.
 * Used by winston Logger.close on transports
 */
MqttTransport.prototype.close = function close() {
  if (this.mqttClient) {
    this.mqttClient.end();
  }
};

function buildTopic(transport, message) {
  return `${transport.topic}/${message.level}`;
}

/**
 * Core logging method exposed to Winston. Metadata is optional.
 * @function log
 * @member MqttTransport
 * @param level {string} Level at which to log the message.
 * @param msg {string} Message to log.
 * @param meta {?Object} Additional metadata to attach.
 * @param callback {function} Continuation to respond to when complete.
 */
MqttTransport.prototype.log = function log(level, msg, meta, callback) {
  const message = {
    level,
    meta,
    from:      this.name,
    message:   msg,
    transport: 'mqtt',
    inserted  : (new Date()).toISOString()
  };
  this.mqttClient.publish(buildTopic(this, message), JSON.stringify(message));
  callback(null, true);
};

module.exports = MqttTransport;
