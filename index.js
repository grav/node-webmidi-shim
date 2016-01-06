var perfNow = require("performance-now");
var midi = require('midi')
var f = require('./fun.js');

var o = new midi.output();
o.openPort(0);

q = [];

f.startLoop(10)

var now = perfNow()+100;
[48,48,48,50,52,52,52].map((x,i) => {
	f.queue(q,{o: o, v: [0x90, x, 64], t: now+i*250})	
	f.queue(q,{o: o, v: [0x80, x, 64], t: now+i*250+100})	
})


