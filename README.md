# node-webmidi-shim
Shim for the Web MIDI API based on node-midi

This project implements the Web MIDI API in Node.

It's sorta like https://github.com/cwilso/WebMIDIAPIShim but based on node-midi, which in turn uses RtMidi.

It allows for creating MIDI apps that will both work in the browser as well as in a Node-environment. 

Examples
---
My specific use-case is getting a sequencer app (https://github.com/grav/seq) running both in Chrome and on a Raspberry Pi. Currently, it's web-only, but the goal is to produce a version running headlessly on an RPi
