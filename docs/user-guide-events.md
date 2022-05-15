---
title: Suica Events
description: [Reacting to user interaction]
---
##### [About](#about) &middot; [Suica canvas](#suica-canvas) &middot; [Objects](#objects) &middot; [Drawings](user-guide-drawings.md) &middot; **Events** &middot; [Functions](#functions) &middot; [References](#references)

**Suica events** are actions that happen 'outside' a Suica program and it is impossible to predict when they will happen. A typical example of an event is when users click on Suica objects.


# Table of contents
- [Introduction](#introduction)
	- <small>[Motion events](#motion-events): `onМouseEnter`, `onМouseMove`, `onМouseLeave`</small>
	- <small>[Click events](#click-events): `onMouseDown`, `onMouseUp`, `onClick`</small>
	- <small>[Time events](#time-events): `onTime`</small>
- [Working with events](#working-with-events)
	- <small>[Event listeners](#event-listeners): [`addEventListener`](#addeventlistener), [`removeEventListener`](#removeeventlistener)</small>
	- <small>[Mouse event handlers](#mouse-event-handlers): [`findPosition`](#findposition), [`findObject`](#findobject), [`findObjects`](#findobjects)</small>
	- <small>[Time event handlers](#time-event-handlers)</small>
	- <small>[Proactive events](#proactive-events)</small>






# Introduction

Suica supports a simplified model of events. It is similar to the traditional web page events, but are tuned for Suica objects. Suica supports *motion events*, *click events* and *time events*.

## Motion events

Motion events are `onМouseEnter`, `onМouseMove` and `onМouseLeave`. They occur when the mouse enters, moves over or leaves Suica canvas or Suica object.

<img src="images/events-motion.png">

## Click events

Click events are `onMouseDown`, `onMouseUp` and `onClick`. They occur when a mouse button is pressed, released or clicked over Suica canvas or Suica object.

<img src="images/events-click.png">

## Time event

Time event is `onTime`. It occurs when the browser is ready for a new frame.


# Working with events

An event is managed by two elements:

- **Event listener**: An HTML or JavaScript declaration that an object is interested in a specific event
- **Event handler**: A JavaScript user-defind function that is activated when an event occurs

Events that are not listened to, are ignored.


## Event listeners

In Suica event listeners can be set for Suica canvas and for individual Suica objects. For example, a canvas `onClick` event occurs when the user clicks anywhere in the canvas, while an object `onClick` event occurs when the user clicks on the image of the object. Similarily, a canvas `onMouseEnter` occurs when the mouse cursor enters the canvas, while an object `onMouseEnter` occurs when the cursors enters the boundary of the object's image.

In HTML event listeners are set as attributes.

```html
HTML:
<𝑜𝑏𝑗𝑒𝑐𝑡 𝑒𝑣𝑒𝑛𝑡𝑁𝑎𝑚𝑒="𝑒𝑣𝑒𝑛𝑡𝐻𝑎𝑛𝑑𝑙𝑒𝑟">
```

The name of the attribute is the name of the event, which is case-insensitive and it can be with or without `on-` prefix. The value of the attribute is the name of the event handler function. The following code snippets install listeners of mouse click events to the whole Suica canvas and to a cube.

```html
HTML:
<suica click="clickOnCanvas">
<cube onClick="clickOnObject">
```

In JavaScript event listeners arе set by `addEventListener` and removed by `removeEventListener`.


#### addEventListener
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡.addEventListener( 𝑒𝑣𝑒𝑛𝑡𝑁𝑎𝑚𝑒, 𝑒𝑣𝑒𝑛𝑡𝐻𝑎𝑛𝑑𝑙𝑒𝑟 );
```
Function. Adds an event listener to specific `eventname` that triggers an `eventHandler` function. `eventName` is the case-insensitive name of the event with or without `on-` prefix, thus `mouseMove` and `onMouseMove` are considered the same event. Only one event handler per event per object can be set, i.e. setting another event handler will replace the previous one. Suica's `addEventListener` mimics to some extent the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)'s [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) which is used to set event listeners for HTML elements in a web page.

```js
JS:
suica.addEventListener( 'mouseMove', eventHandler );
obj.addEventListener( 'onMouseMove', eventHandler );
```

[<kbd><img src="../examples/snapshots/events-event-listener.jpg" width="300"></kbd>](../examples/events-event-listener.html)

In JavaScript an event listener can be set directly, but the event name must be `on-` prefixed and lowercased.

```js
JS:
// click, Click and onClick will not work
obj.onclick = eventHandler;
```


#### removeEventListener
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡.removeEventListener( 𝑒𝑣𝑒𝑛𝑡𝑁𝑎𝑚𝑒 );
```
Function. Removes an event listener of specific `eventName`. `eventName` is the case-insensitive name of the event with or without `on-` prefix, thus `mouseMove` and `onMouseMove` are considered the same event. `removeEventListener`
mimics to some extent the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)'s
[removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener) which is used to remove event listeners for HTML elements in a web page. 

```js
JS:
suica.removeEventListener( 'mouseMove' );
obj.removeEventListener( 'onMouseMove' );
```

[<kbd><img src="../examples/snapshots/events-one-time-listener.jpg" width="300"></kbd>](../examples/events-one-time-listener.html)

In JavaScript an event listener can be removed directly by assigning a `null` value, but the event name must be `on-` prefixed and lowercased.

```js
JS:
// click, Click and onClick will not work
obj.onclick = null;
```



## Mouse event handlers

In Suica event handlers are defined only in JavaScript and they are functions that are activated from listeners when a specific event occurs. Often the name of the event handler is the same as the name of the corresponding event, although this is not enforced. These functions have optional, but predefined parameters.

All mouse-related events, these are `onМouseEnter`, `onМouseMove`, `onМouseLeave`, `onMouseDown`, `onMouseUp` and `onClick`, provide parameter `event` to their handlers.

```js
JS:
function 𝑒𝑣𝑒𝑛𝑡𝐻𝑎𝑛𝑑𝑙𝑒𝑟( 𝑒𝑣𝑒𝑛𝑡 ) 
{
  ...
}
```

The actual name of the parameter is user-defined, but traditionally *'event'* is used. The following snippet illustrates the definition of a event handler for `onMouseEnter` event. Note that both the function name and the parameter name are user-defined.

```js
JS:
function onMouseEnter( event )
{
	...
}
```

[<kbd><img src="../examples/snapshots/events-suica-enter.jpg" width="300"></kbd>](../examples/events-suica-enter.html)

The `event` parameter describes the event and its structure is the same as DOM's [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent). The parameter contains data about event time and place, mouse buttons, pressed keys, etc. These data can be used to implement drag-and-drop operations. Each event handler is run from within the object that reacted to the event. The system variable `this` in the event handler points to this object. This is used to identify the object when several objects share the same event handler.

```js
JS:
function onMouseMove( event )
{
   if( event.ctrlKey )
   {
      this.center = [0,0,0];
      this.color = 'crimson';
   }
}
```

[<kbd><img src="../examples/snapshots/events-drag-and-drop.jpg" width="300"></kbd>](../examples/events-drag-and-drop.html)
[<kbd><img src="../examples/snapshots/events-point-and-spin.jpg" width="300"></kbd>](../examples/events-point-and-spin.html)


Additional Suica-specific data for mouse events is extracted from `event` by 
`findPosition`, `findObject` and `findObjects`.


#### findPosition
```js
JS:
𝑝𝑜𝑠 = findPosition( 𝑒𝑣𝑒𝑛𝑡 );
```
Function. Finds the position of a mouse event. The position is measured in pixels and is relative to the center of the Suica canvas. The function requires the `event` parameter of the event handler. The result is an array [`x`,`y`] of the position. `findPosition` is typically used with events of the Suica canvas.

```js
JS:
function onMouseMove( event )
{
	var pos = findPosition( event );
}
```

[<kbd><img src="../examples/snapshots/events-find-position.jpg" width="300"></kbd>](../examples/events-find-position.html)

The returned position coincides with the Suica coordinate system when
[orthographic camera](#orthographic-camera) is used and the view point is not
changed with [demo](#demo) or [lookAt](#lookat).

<img src="images/event-coordinate-system.png">



#### findObject
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.findObject( 𝑒𝑣𝑒𝑛𝑡 );
```
Function. Finds the Suica object where a mouse event occured. The function requires the `event` parameter of the event handler. The result is the closest to the viewer Suica object that is at the position of the event, or `null` if no such object exists. `findObject` is typically used with events of the Suica canvas.

```js
JS:
function onMouseMove( event )
{
	var object = findObject( event );
}
```

[<kbd><img src="../examples/snapshots/events-find-object.jpg" width="300"></kbd>](../examples/events-find-object.html)



#### findObjects
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡𝑠 = 𝑠𝑢𝑖𝑐𝑎.findObjects( 𝑒𝑣𝑒𝑛𝑡 );
```
Function. Finds all Suica objects where a mouse event occured. The function requires the `event` parameter of the event handler. The result is a sorted list (from nearest to farthest with respect to the viewer) of all Suica objects that are at the position of the event, or an empty list `[]` if no such objects exist. `findObjects` is typically used
with events of the Suica canvas.

```js
JS:
function onMouseMove( event )
{
	var object = findObjects( event );
}
```

[<kbd><img src="../examples/snapshots/events-find-objects.jpg" width="300"></kbd>](../examples/events-find-objects.html)






## Time event handlers

The time event `onTime` occurs when the browser is ready for a new frame. The browser tries to generate the event at regular time intervals, usually 60 or 30 times per second, but this is not quaranteed. The time event provides two parameters `t` and `dT` &ndash;  elapsed times since the start of Suica and since the previous frame. Both are measured in seconds, thus 2.3 means 2.3 seconds (2 seconds and 300 milliseconds).


```js
JS:
function onTime( t, dT )
{
	...
}
```

[<kbd><img src="../examples/snapshots/events-ontime.jpg" width="300"></kbd>](../examples/events-ontime.html)





## Proactive events

Suica supports proactive mode for mouse motion events `onМouseEnter`, `onМouseMove` and `onМouseLeave`. This mode can be turned on with HTML attribute, HTML tag or JavaScript command.

#### proactive
```html
HTML:
<suica proactive>
<proactive>
```
```js
JS:
proactive( );
```
Command. Turns on proactive mode. Normal mouse motion events only occur when the mouse is moved into, over or out of an object. In proactive mode these events are triggered even when the mouse is stationary, but an object moves into, under or out of the mouse.

[<kbd><img src="../examples/snapshots/events-proactive.jpg" width="300"></kbd>](../examples/events-proactive.html)

Proactive mode is resource consuming. For every frame all objects in Suica are tested against the mouse position. When a proactive event occurs Suica executes the assigned event handler and passes the latest mouse `event` structure as a parameter to the handler.


---

May, 2022