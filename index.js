var perfNow = require("./performance-now");
var midi = require('./midi')
var f = require('./fun.js');

var o = new midi.output();
o.openPort(0);

q = [];

f.startLoop(100)

//

f.queue(q,{o: o, v: [0x90, 48, 64], t: perfNow()+1000})

