var perfNow = require("performance-now");

function play(o,v){
	o.sendMessage(v);
}

function queue(q,e){
	var now = perfNow();
	if(e.t<now){
		play(e.o,e.v);
	} else {
		q.push(e);
	}
}

function playNext(q){
	var c = 0;
	var now = perfNow();
	for (e of q){
		if(e.t<now){
			c++;
			play(e.o,e.v);
		}
	}
	return q.slice(c);
	
}

function startLoop(ma,i){
	return setInterval(_=>{
		var q = playNext(ma._q);
		if(q){
			ma._q = q;
		}
	}, i);
}

function createOutput(midi,idx,ma){
	var o = new midi.output();
	var name = o.getPortName(idx);
	o.openPort(idx);
	return {
		send: function(v, t) {
			// todo - handle no t
			queue(ma._q, {
				o: o,
				v: v,
				t: t
			})
		},
		id: name,
		name: name
	}
	
}

function createInput(midi,idx){
	var i = new midi.output();
	var name = i.getPortName(idx);
	return {
		_i: i,
		id: name,
		name: name
	}
}

function requestMIDIAccess(){
	var midi = require('midi');
	var ma = {
		_q: [],
		sysexEnabled: false,		
	};
	var outputs = [];
	var nOutputs = new midi.output().getPortCount();
	for(var i=0; i < nOutputs; i++){
		var o = createOutput(midi,i,ma);
		outputs.push(o);
	}
	ma.outputs = {
		keys: _ => outputs.map(o=>o.id)[Symbol.iterator](),
		values: _ => outputs[Symbol.iterator]()
	};
	startLoop(ma,10);
	return Promise.resolve(ma);
}

module.exports = {
	startLoop: startLoop, 
	queue: queue,
	requestMIDIAccess: requestMIDIAccess
};
