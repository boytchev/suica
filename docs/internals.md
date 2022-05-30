---
title: Suica Internals
description: Additional internal information for developers and software masochists
---
##### [User guide](user-guide.md)


# Table of contents

- [Testing Suica](#testing-suica)
- [Using Three.js](#using-threejs)


# Testing-suica

There is a rudimentary automatic [Suica tester](../test/test.html). It runs predefined test cases and compares the produced images. It reports the percentage of match:

- A match of 90% or more is considered normal.
- A match between 70% and 90% is most likely due to some rendering fluctuations
and a visual inspection is recommended.
- A match below 70% most likely indicates a problem and a visual inspection is
required.

Because timings cannot be set absolutely, some test cases may not produce the expected result. In this case run the tester another time to check whether the result is consistent.

To test only part of the test cases, a string template is given as a parameter to the tester. The following code [`test.html?convex`](../test/test.html?convex) will test all test cases with the substring *convex* in their names.



# Using Three.js

This version of Suica is based on [Three.js](https://threejs.org). Programs that use Suica should include either `suica.js` or `suica.min.js`. Suica automatically loads `three.min.js`, it must be in the same folder.

In Suica, the file `three.min.js` is extended and it contains:

- The original `three.min.js`
- The original `ConvexHull.js`
- The original `ConvexGeometry.js`
- The original `StereoEffect.js`
- Modified `AnaglyphEffect.js` &ndash; color matrices are set to color identities
- Modified `VRButton.js` &ndash; converted to non-module



<small>{{site.time | date: "%B, %Y"}}</small>