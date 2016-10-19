const util      = require('util');
const winston   = require('winston');
const mqtt      = require('mqtt');
const path      = require('path');

const MqttTransport = winston.transports.MqttTransport = function MqttTransport(options) {
  this.name       = options.name  || getAppName();
  this.level      = options.level || 'info';
  this.mqttClient = mqtt.connect(options.host || 'mqtt://localhost:1883');
  this.topic      = options.topic;
};

/** @extends winston.Transport */
util.inherits(MqttTransport, winston.Transport);

/**
 * Define a getter so that `winston.transports.MongoDB`
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
    transport: 'mqtt'
  };
  this.mqttClient.publish(this.topic, JSON.stringify(message));
  callback(null, true);
};

const getAppName = () => {
  if (process.env.APP_NAME) {
    return process.env.APP_NAME;
  }
  if (process.env.USER) {
    return process.env.USER;
  }
  if (process.env.HOME) {
    return path.basename(process.env.HOME);
  }
  return 'unknown';
};

module.exports = MqttTransport;
