# node-webmidi-shim
Shim for the Web MIDI API based on node-midi

This project implements the Web MIDI API (https://webaudio.github.io/web-midi-api/) in Node.

It allows for creating MIDI applications that will both work in the browser (currently Google Chrome), as well as in a Node-environment. 

Requirements
---
Tested with Node 4, 5 and 6. Uses ES6.

Usage
---
At a prompt:
```
$ npm install webmidi-shim
```

Then, in a node repl:
```
var r = require('webmidi-shim')

r.requestMIDIAccess().then(ma => {
  // send a note-on C3 velocity 64 to the first connected MIDI output device
  ma.outputs.values().next().value.send([0x90, 48, 64],1000)

  // log any incoming messages from the first connected MIDI input device
  ma.inputs.values().next().value.onmidimessage = console.log
})
```

Similar projects
---
It's sorta like https://github.com/cwilso/WebMIDIAPIShim, which however is dependent on the proprietary Jazz-Plugin (http://jazz-soft.net/download/Jazz-Plugin), which is limited to x86 architectures.

This shim is based on RtMidi (https://github.com/thestk/rtmidi), which bridges to the various OS-specific MIDI APIs, so it can run on several architectures. 

Examples
---
My specific use-case is getting a sequencer app (https://github.com/grav/seq) running both in Chrome and on a Raspberry Pi. Currently, it's web-only, but the goal is to produce a version running headlessly on an RPi

Current status
---
Alpha with a big 'A'. Crashes quite fast!

Notable missing features are:
- get notified when MIDI setup changes (`onstatechange`)
- various attributes of the MIDI devices
- the concept of Ports
