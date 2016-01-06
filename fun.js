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

function startLoop(i){
	return setInterval(_=>{
		var q_ = playNext(q);
		if(q_){
			q = q_;
		}
	}, i);
}

module.exports = {
	startLoop: startLoop, 
	queue: queue
};
