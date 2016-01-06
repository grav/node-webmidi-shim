var perfNow = require("performance-now");
var midi = require('midi')
var f = require('./fun.js');

var o = new midi.output();
var i = new midi.input();
var n = 0;
i.openPort(n); // This is apparently necessary for sound to come out on RPi!?

console.log("using port", o.getPortName(n));
o.openPort(n);

q = [];

f.startLoop(10)

var now = perfNow()+100;
var d = 100;
[48,48,48,50,52,52,52].map((x,i) => {
	f.queue(q,{o: o, v: [0x90, x, 64], t: now+i*d})	
	f.queue(q,{o: o, v: [0x80, x, 64], t: now+i*d+d/2})	
})


