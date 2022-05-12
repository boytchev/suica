---
layout: default
nav_order: 20
title: Paths
parent: Drawings
has_children: false
---

# Paths

Suica drawings are based on [Canvas2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
and are made of stroked lines and filled areas. A virtual pen defines a path on
the canvas. This path can be *stroked* by drawing a line over it; or its
contents can be *filled* with a color.

The coordinate system of a drawing canvas has origin (0,0) at the bottom left
side of the canvas. The X axis extends to the right, Y extends to the top.

<img src="../images/drawing-coordinates.png">

The commands to generate paths are:

- moveTo
- lineTo
- curveTo
- arc