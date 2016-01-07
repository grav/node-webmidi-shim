var perfNow = require("performance-now");
var midi = require('midi')
var f = require('./fun.js');

function test(now){
	return function(ma){
		var d = 250;

		for(k of ma.outputs.values()){
			console.log(k);
		}
	
		var o = ma.outputs.values().next().value; // lovely
		[48,48,48,50,52,52,52].map((x,i) => {
			o.send([0x90, x, 64],now+i*d)
			o.send([0x80, x, 64], now+i*d+d/2)
		})
	}
}

f.requestMIDIAccess().then(test(perfNow()+1000))
