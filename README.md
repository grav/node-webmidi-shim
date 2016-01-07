# node-webmidi-shim
Shim for the Web MIDI API based on node-midi

This project implements the Web MIDI API in Node.

It allows for creating MIDI apps that will both work in the browser as well as in a Node-environment. 

Similar projects
---
It's sorta like https://github.com/cwilso/WebMIDIAPIShim, which however is dependent on the proprietary Jazz-Plugin (http://jazz-soft.net/download/Jazz-Plugin), which is limited to x86 architectures.

This shim is based on RtMidi (https://github.com/thestk/rtmidi), which bridges to the various OS-specific MIDI APIs, so it can run on several architectures. 

Examples
---
My specific use-case is getting a sequencer app (https://github.com/grav/seq) running both in Chrome and on a Raspberry Pi. Currently, it's web-only, but the goal is to produce a version running headlessly on an RPi

