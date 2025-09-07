//
// Suica 3.0
//
//===================================================


import * as THREE from 'three';
import './suica-main.js';
import { degrees, radians, random, splane, spline } from './suica-globals.js';

window.radians = radians;
window.degrees = degrees;
window.random = random;
window.spline = spline;
window.splane = splane;

window.THREE = THREE;

// old: Capture( suica, name, time, fps, format, skipFrames )
// new: Capture( suica, name, time, fps, format, skipTime ) - times in seconds
// based on slightly modified https://github.com/manthrax/THREE-CSGMesh
//
// check device.js from suica 2 and the device-orientation example
