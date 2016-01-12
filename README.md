# node-webmidi-shim
Shim for the Web MIDI API based on node-midi

This project implements the Web MIDI API (https://webaudio.github.io/web-midi-api/) in Node.

It allows for creating MIDI applications that will both work in the browser as well as in a Node-environment. 

Requirements
---
Tested with Node 4 and Node 5. Uses ES6.

Usage
---
At a prompt:
```
$ npm install webmidi-shim
```

Then, in a node repl:
```
var r = require('webmidi-shim');
r.requestMIDIAccess().then(ma => ma.outputs.values().next().value.send([0x90, 48, 64],1000))
```
This will send a note-on C3 to the first connected MIDI device.

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
