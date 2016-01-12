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
	return c > 0 ? q.slice(c) : q;
	
}

function startLoop(ma,i){
	return setInterval(_=>{
		ma._q = playNext(ma._q);
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
	var i = new midi.input();
	var name = i.getPortName(idx);
	try {
		i.openPort(idx);
	} catch (e){
	  	console.log(e)
	}
	var input = {
		_i: i,
		id: name,
		name: name,
		onmidimessage: null
	};
	i.on('message', (d,m) => {
		if(input.onmidimessage){
			var e = {
				timestamp: d,
				data: m
			}
			input.onmidimessage(e);
		}
	});
	
	return input;
}

function requestMIDIAccess(){
	var midi = require('midi');
	var ma = {
		_q: [],
		sysexEnabled: false,		
	};
	var outputs = [];
	var nOutputs = new midi.output().getPortCount();
	for(var idx=0; idx < nOutputs; idx++){
		var o = createOutput(midi,idx,ma);
		outputs.push(o);
	}

	var inputs = [];
	var nInputs = new midi.input().getPortCount();
	for(var idx=0; idx < nInputs; idx++){
		var i = createInput(midi,idx,ma);
		inputs.push(i);
	}
	ma.outputs = {
		keys: _ => outputs.map(o=>o.id)[Symbol.iterator](),
		values: _ => outputs[Symbol.iterator]()
	};
	ma.inputs = {
		keys: _ => inputs.map(i=>i.id)[Symbol.iterator](),
		values: _ => inputs[Symbol.iterator]()
	};
	startLoop(ma,10);
	return Promise.resolve(ma);
}

module.exports = {
	requestMIDIAccess: requestMIDIAccess
};
