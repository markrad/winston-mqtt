# winston-mqtt
A Winston transport for logging via MQTT

# Installation
```bash
npm install winston-mqtt --save
```

# Usage
```javascript
const MqttTransport = require('winston-mqtt').MqttTransport;
winston.add(MqttTransport, { name: 'source-name', topic: 'mqtt-topic', host: 'mqtt://localhost:1883' });
```
