---
title: Suica Internals
description: Additional internal information for developers and software masochists
---
##### [User guide](user-guide.md)


# Table of contents

- [Testing](#testing)


# Testing

There is a rudimentary automatic [Suica tester](../test/test.html). It runs predefined test cases and compares the produced images. It reports the percentage of match:

- A match of 90% or more is considered normal.
- A match between 70% and 90% is most likely due to some rendering fluctuations
and a visual inspection is recommended.
- A match below 70% most likely indicates a problem and a visual inspection is
required.

Because timings cannot be set absolutely, some test cases may not produce the expected result. In this case run the tester another time to check whether the result is consistent.

To test only part of the test cases, a string template is given as a parameter to the tester. The following code [`test.html?convex`](../test/test.html?convex) will test all test cases with the substring *convex* in their names.



<small>{{site.time | date: "%B, %Y"}}</small>