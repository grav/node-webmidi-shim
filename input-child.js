'use strict';

var midi = require('midi')

var port = Number.parseInt(process.argv[2], 10);

var i = new midi.input();

process.send({ method: 'portname', payload: i.getPortName(port) });

i.on('message', (d,m) => {
    process.send({method: 'midiin', payload: {timestamp: d, data: m}})
});

try {
    i.openPort(port);
} catch (e){
    console.log(e)
}