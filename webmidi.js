const midi = require('midi');
const perfNow = require("performance-now");
const cp = require('child_process');

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

function createOutput(ma,portNumber) {
	var o = new midi.output();
	var name = o.getPortName(portNumber);
	o.openPort(portNumber);
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

function createInput(portnumber) {
	return new Promise((res, rej) => {
		var input = {
			id: null,
			name: null,
			onmidimessage: null
		};

		let inProcess = cp.fork(`${__dirname}/input-child.js`, [portnumber]);

		['close', 'disconnect', 'error', 'exit'].forEach((eventType) => {
			inProcess.on(eventType, () => {
				console.log("inProcess sent (" + eventType + ")");
				// todo - respawn input-child
			});
		});

		inProcess.on('message', m => {
			switch (m.method) {
				case 'portname':
					input.name = input.id = m.payload;
					res(input)
				case 'midiin':
					if (input.onmidimessage) {
						input.onmidimessage(m.payload)
					}
			}
		})
	});

}

function requestMIDIAccess(){
	var ma = {
		_q: [],
		sysexEnabled: false,		
	};
	var outputs = [];
	var nOutputs = new midi.output().getPortCount();
	for(var portNumber=0; portNumber < nOutputs; portNumber++){
		var o = createOutput(ma,portNumber);
		outputs.push(o);
	}

	var inputs = [];
	var nInputs = new midi.input().getPortCount();
	for(var portNumber=0; portNumber < nInputs; portNumber++){
		var i = createInput(portNumber);
		inputs.push(i);
	}
	ma.outputs = {
		keys: _ => outputs.map(o=>o.id)[Symbol.iterator](),
		values: _ => outputs[Symbol.iterator]()
	};
	startLoop(ma, 10);
	return Promise.all(inputs).then(ins => {
		ma.inputs = {
			keys: _ => ins.map(i => i.id)[Symbol.iterator](),
			values: _ => ins[Symbol.iterator]()
		};
		return ma
	})
}

module.exports = {
	requestMIDIAccess: requestMIDIAccess
};
