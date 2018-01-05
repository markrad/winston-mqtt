# winston-mqtt
A Winston transport for logging via MQTT

This transport will log to a given topic in JSON format.

# Installation
```bash
npm install winston-mqtt --save
```

# Usage
```javascript
/**
 * Requiring `winston-mqtt` will expose
 * `winston.transports.MqttTransport`
 */
require('winston-mqtt').MqttTransport;

winston.add(winston.transports.MqttTransport, {
   name: 'source-name',
   topic: 'mqtt-topic',
   host: 'mqtt://localhost:1883',
   requestTracer: {
     instance: myRequestObject,
     property: 'requestId'
   }
});
```
The MqttTransport takes the following options. 'name' and 'topic' is required:
* __name:__ Transport instance identifier. This will be embeded into the JSON data logged to the MQTT topic.
* __topic:__ The MQTT topic to use for logging.
* __level:__ Level of messages that this transport should log, defaults to
'info'.
* __host:__ The MQTT host address, defaults to: `mqtt://localhost:1883`
* __requestTracer.instance:__ If you want to trace a specific request using the continuation-local-storage module
* __requestTracer.property:__ Property of the request id in your object
