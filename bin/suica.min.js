document.write('<script src="three.min.js" onload="LoadSuica();"></script>');﻿function LoadSuica(){﻿
console.log(`Suica 2.0.9 (220201)`);const DEBUG_CALLS=!false;class Suica
{static current;static allSuicas=[];static ORIENTATIONS={XYZ:{SCALE:new THREE.Vector3(1,1,1),UP:new THREE.Vector3(0,1,0)},XZY:{SCALE:new THREE.Vector3(-1,1,1),UP:new THREE.Vector3(0,0,1)},YXZ:{SCALE:new THREE.Vector3(1,-1,1),UP:new THREE.Vector3(1,0,0)},YZX:{SCALE:new THREE.Vector3(1,1,1),UP:new THREE.Vector3(0,0,1)},ZXY:{SCALE:new THREE.Vector3(1,1,1),UP:new THREE.Vector3(1,0,0)},ZYX:{SCALE:new THREE.Vector3(1,1,-1),UP:new THREE.Vector3(0,1,0)},}
static DEFAULT={BACKGROUND:{COLOR:'whitesmoke'},ORIENTATION:'XYZ',SIZE:'30',OXYZ:{COLOR:'black',SIZE:30},DEMO:{DISTANCE:100,ALTITUDE:30},ONTIME:{SRC:null},POINT:{CENTER:[0,0,0],COLOR:'crimson',SIZE:7},CUBE:{CENTER:[0,0,0],COLOR:'cornflowerblue',FRAMECOLOR:'black',SIZE:30},}
constructor(suicaTag)
{suicaTag.style.display='inline-block';suicaTag.style.boxSizing='border-box';this.id=suicaTag.getAttribute('id')||`suica${Suica.allSuicas.length}`
if(DEBUG_CALLS)console.log(`Suica :: ${this.id}`);this.suicaTag=suicaTag;this.orientation=Suica.ORIENTATIONS[suicaTag.getAttribute('ORIENTATION')?.toUpperCase()||Suica.DEFAULT.ORIENTATION];this.createCanvas();this.createRenderer();this.createMaterials();this.parser=new HTMLParser(this);this.onTimeHandler=null;this.demoViewPoint=null;Suica.current=this;Suica.allSuicas.push(this);window[this.id]=this;}
createCanvas()
{if(this.suicaTag.clientWidth<1)
this.suicaTag.style.width=(this.suicaTag.getAttribute('width')||500)+'px';if(this.suicaTag.clientHeight<1)
this.suicaTag.style.height=(this.suicaTag.getAttribute('height')||300)+'px';this.canvas=document.createElement('canvas');this.canvas.width=this.suicaTag.clientWidth;this.canvas.height=this.suicaTag.clientHeight;this.canvas.style=` border: solid 1px gray;

        width: 100%;

        height: 100%;

        box-sizing: border-box;`;this.suicaTag.appendChild(this.canvas);}
get canvasAspect()
{return this.canvas.width/this.canvas.height;}
render()
{this.renderer.render(this.scene,this.camera);}
createRenderer()
{this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,alpha:true,antialias:true});this.scene=new THREE.Scene();this.scene.scale.copy(this.orientation.SCALE);var color=getComputedStyle(this.suicaTag).backgroundColor;if(color=='rgba(0, 0, 0, 0)')
{color=this.suicaTag.getAttribute('background')||Suica.DEFAULT.BACKGROUND.COLOR;}
this.scene.background=Suica.parseColor(color);this.camera=new THREE.PerspectiveCamera(40,this.canvasAspect,1,1000);this.camera.up.copy(this.orientation.UP);this.camera.position.set(0,0,100);this.camera.lookAt(this.scene.position);this.light=new THREE.PointLight('white',0.5);this.light.position.set(1000,1500,3000);this.scene.add(this.light);this.scene.add(new THREE.AmbientLight('white',0.5));var that=this;this.lastTime=0;function loop(time)
{time/=1000;if(that.demoViewPoint)
{var x=that.demoViewPoint.distance*Math.cos(time),y=that.demoViewPoint.altitude,z=that.demoViewPoint.distance*Math.sin(time),p=that.camera.position;switch(that.orientation)
{case Suica.ORIENTATIONS.XYZ:p.set(x,y,-z);break;case Suica.ORIENTATIONS.XZY:p.set(-x,-z,y);break;case Suica.ORIENTATIONS.YXZ:p.set(y,-x,-z);break;case Suica.ORIENTATIONS.YZX:p.set(-z,x,y);break;case Suica.ORIENTATIONS.ZXY:p.set(y,-z,x);break;case Suica.ORIENTATIONS.ZYX:p.set(-z,y,-x);break;default:throw'error: Unknown orientation in <suica>';};that.camera.lookAt(that.scene.position);that.light.position.copy(that.camera.position);}
if(that.onTimeHandler)
{if(typeof that.onTimeHandler==='string'||that.onTimeHandler instanceof String)
that.onTimeHandler=window[that.onTimeHandler];that.onTimeHandler(time,time-that.lastTime);}
that.render();that.lastTime=time;}
this.renderer.setAnimationLoop(loop);}
createMaterials()
{var CANVAS_SIZE=64;var canvas=document.createElement('canvas');canvas.width=CANVAS_SIZE;canvas.height=CANVAS_SIZE;var context=canvas.getContext('2d');context.fillStyle='white';context.beginPath();context.arc(CANVAS_SIZE/2,CANVAS_SIZE/2,CANVAS_SIZE/2-1,0,2*Math.PI);context.fill();Suica.pointMaterial=new THREE.PointsMaterial({color:'white',size:5,sizeAttenuation:false,map:new THREE.CanvasTexture(canvas),transparent:true,alphaTest:0.75,});Suica.solidMaterial=new THREE.MeshStandardMaterial({color:'cornflowerblue',side:THREE.DoubleSide,});Suica.lineMaterial=new THREE.LineBasicMaterial({color:'black',});}
background(color=Suica.DEFAULT.BACKGROUND.COLOR)
{this.parser?.parseTags();if(DEBUG_CALLS)console.log(`:: ${this.id}.background( ${color} )`);this.scene.background=new THREE.Color(color);}
oxyz(size=Suica.DEFAULT.OXYZ.SIZE,color=Suica.DEFAULT.OXYZ.COLOR)
{this.parser?.parseTags();if(DEBUG_CALLS)console.log(`:: ${this.id}.oxyz( ${size}, ${color} )`);var axes=new THREE.AxesHelper(size)
axes.setColors(color,color,color);this.scene.add(axes);}
demo(distance=Suica.DEFAULT.DEMO.DISTANCE,altitude=Suica.DEFAULT.DEMO.ALTITUDE)
{this.parser?.parseTags();if(DEBUG_CALLS)console.log(`:: ${this.id}.demo( ${distance}, ${altitude} )`);this.demoViewPoint={distance:distance,altitude:altitude};}
onTime(src=Suica.DEFAULT.ONTIME.SRC)
{this.parser?.parseTags();if(DEBUG_CALLS)console.log(`:: ${this.id}.onTime( ${src} )`);this.onTimeHandler=src;}
static precheck()
{if(!(Suica.current instanceof Suica))
throw'error: No Suica instance is active';}
static parseColor(color)
{if(color instanceof THREE.Color)
return color;if(Array.isArray(color))
return new THREE.Color(color[0],color[1]||0,color[2]||0);if(typeof color==='string'||color instanceof String)
{color=color.toLowerCase().replaceAll(' ','');if(color[0]=='0'&&color[1]=='x')
return new THREE.Color(Number(color));if(color[0]=='r'&&color[1]=='g'&&color[2]=='b')
return new THREE.Color(color);if(color[0]=='h'&&color[1]=='s'&&color[2]=='l')
{color=color.substring(4).split(',');return hsl(parseFloat(color[0]),parseFloat(color[1]),parseFloat(color[2]));}
if(color.indexOf(',')>0)
{color=color.split(',');return new THREE.Color(Number(color[0]),Number(color[1]),Number(color[2]));}}
return new THREE.Color(color||'white');}
static parseCenter(center)
{if(center.center)
return center.center;if(Array.isArray(center))
return center;if(typeof center==='string'||center instanceof String)
{center=center.replaceAll(' ','');if(center.indexOf(',')>0)
{center=center.split(',').map(Number);return[Number(center[0]),Number(center[1]),Number(center[2])];}}
return center;}
static parseSize(size)
{if(typeof size==='string'||size instanceof String)
{size=size.replaceAll(' ','');if(size.indexOf(',')>0)
{return size.split(',').map(Number);}}
return size;}
static parseColorTest()
{function test(color)
{var parsedColor=Suica.parseColor(color);if(parsedColor.r==1&&parsedColor.g==0&&parsedColor.b==0)
return null;return color;}
var testValues=['red','Red','RED',0xFF0000,0XFF0000,'0XFF0000','0xFF0000','0xff0000','0Xff0000',[1,0,0],'1,0,0','1, 0, 0','rgb(255,0,0)','rgb( 255, 0, 0)',' rgb ( 255 , 0 , 0 ) ','RGB( 255, 0, 0 )',rgb(255,0,0),'hsl(0,100,50)','hsl( 0, 100, 50 )',' hsl ( 0 , 100 , 50 ) ','HSL( 0, 100, 50 )',hsl(0,100,50),new THREE.Color('red')]
var summary=[];for(var value of testValues)
{var result=test(value);if(result)summary.push(result);}
if(summary.length)
console.log(`Suica::parseColorTest() - failed at: \n\t|${summary.join('|\n\t|')}|`);else
console.log(`Suica::parseColorTest() - passed OK`);}
point(center=Suica.DEFAULT.POINT.CENTER,size=Suica.DEFAULT.POINT.SIZE,color=Suica.DEFAULT.POINT.COLOR)
{this.parser?.parseTags();if(DEBUG_CALLS)console.log(`:: ${this.id}.point( [${center}], ${size}, ${color} )`);return new Point(this,center,size,color);}
cube(center=Suica.DEFAULT.CUBE.CENTER,size=Suica.DEFAULT.CUBE.SIZE,color=Suica.DEFAULT.CUBE.COLOR)
{this.parser?.parseTags();if(DEBUG_CALLS)console.log(`:: ${this.id}.cube( [${center}], ${size}, ${color} )`);return new Cube(this,center,size,color);}
cubeFrame(center=Suica.DEFAULT.CUBE.CENTER,size=Suica.DEFAULT.CUBE.SIZE,color=Suica.DEFAULT.CUBE.FRAMECOLOR)
{this.parser?.parseTags();if(DEBUG_CALLS)console.log(`:: ${this.id}.cubeFrame( [${center}], ${size}, ${color} )`);return new CubeFrame(this,center,size,color);}}
window.background=function(color=Suica.DEFAULT.BACKGROUND.COLOR)
{Suica.precheck();Suica.current.background(color);}
window.oxyz=function oxyz(size=Suica.DEFAULT.OXYZ.SIZE,color=Suica.DEFAULT.OXYZ.COLOR)
{Suica.precheck();Suica.current.oxyz(size,color);}
window.demo=function(distance=Suica.DEFAULT.DEMO.DISTANCE,altitude=Suica.DEFAULT.DEMO.ALTITUDE)
{Suica.precheck();Suica.current.demo(distance,altitude);}
window.onTime=function(src=Suica.DEFAULT.ONTIME.SRC)
{Suica.precheck();Suica.current.onTime(src);}
window.element=function(id)
{return document.getElementById(id);}
window.rgb=function(r,g,b)
{return new THREE.Color(r/255,g/255,b/255);}
window.hsl=function hsl(h,s,l)
{return new THREE.Color().setHSL(h/360,s/100,l/100);}
window.random=function random(a=0,b=1)
{if(Array.isArray(a))
{return a[THREE.Math.randInt(0,a.length-1)];}
return a+(b-a)*Math.random();}
new MutationObserver(function(mutations)
{for(var parentElem of mutations)
for(var childElem of parentElem.addedNodes)
{if(childElem?.tagName=='SCRIPT')
for(var suica of Suica.allSuicas)
suica.parser?.parseTags();if(childElem?.tagName=='SUICA')
new Suica(childElem);}}).observe(document,{childList:true,subtree:true});window.addEventListener('load',function()
{for(var suica of Suica.allSuicas)
suica.parser?.parseTags();});﻿
class HTMLParser
{constructor(suica)
{this.suica=suica;this.parseTag={};this.parseTag.OXYZ=this.parseTagOXYZ;this.parseTag.DEMO=this.parseTagDEMO;this.parseTag.BACKGROUND=this.parseTagBACKGROUND;this.parseTag.ONTIME=this.parseTagONTIME;this.parseTag.POINT=this.parseTagPOINT;this.parseTag.CUBE=this.parseTagCUBE;this.parseTag.CUBEFRAME=this.parseTagCUBEFRAME;this.parseTag.BUTTON=this.skipTag;this.parseTag.CANVAS=this.skipTag;this.parseTag.DIV=this.skipTag;this.parseTag.SPAN=this.skipTag;}
parseTags()
{if(DEBUG_CALLS)console.log(`:: ${this.suica.id}.parseTag( )`);this.suica.parser=null;this.parseTagsInElement(this.suica,this.suica.suicaTag);this.suica.render();}
parseTagsInElement(that,elem)
{for(var i=0;i<elem.children.length;i++)
{var tagName=elem.children[i].tagName;if(this.parseTag[tagName])
this.parseTag[tagName](this.suica,elem.children[i]);else
throw`error: unknown tag <${tagName}> in <${that.tagName}>`;this.parseTagsInElement(this.suica,elem.children[i]);}}
skipTag(suica,elem)
{if(DEBUG_CALLS)console.log(`:: ${suica.id}.skipTag( ${elem.tagName } )`);}
parseTagOXYZ(suica,elem)
{suica.oxyz(elem.getAttribute('size')||Suica.DEFAULT.OXYZ.SIZE,elem.getAttribute('color')||Suica.DEFAULT.OXYZ.COLOR);}
parseTagDEMO(suica,elem)
{suica.demo(elem.getAttribute('distance')||Suica.DEFAULT.DEMO.DISTANCE,elem.getAttribute('altitude')||Suica.DEFAULT.DEMO.ALTITUDE);}
parseTagBACKGROUND(suica,elem)
{suica.background(elem.getAttribute('color')||Suica.DEFAULT.BACKGROUND.COLOR);}
parseTagONTIME(suica,elem)
{suica.onTime(elem.getAttribute('src')||Suica.DEFAULT.ONTIME.SRC);}
parseTagPOINT(suica,elem)
{var p=suica.point(elem.getAttribute('center')||Suica.DEFAULT.POINT.CENTER,elem.getAttribute('size')||Suica.DEFAULT.POINT.SIZE,elem.getAttribute('color')||Suica.DEFAULT.POINT.COLOR);if(elem.hasAttribute('x'))p.x=Number(elem.getAttribute('x'));if(elem.hasAttribute('y'))p.y=Number(elem.getAttribute('y'));if(elem.hasAttribute('z'))p.z=Number(elem.getAttribute('z'));var id=elem.getAttribute('id');if(id)window[id]=p;}
parseTagCUBE(suica,elem)
{var p=suica.cube(elem.getAttribute('center')||Suica.DEFAULT.CUBE.CENTER,Suica.parseSize(elem.getAttribute('size')||Suica.DEFAULT.CUBE.SIZE),elem.getAttribute('color')||Suica.DEFAULT.CUBE.COLOR);if(elem.hasAttribute('x'))p.x=Number(elem.getAttribute('x'));if(elem.hasAttribute('y'))p.y=Number(elem.getAttribute('y'));if(elem.hasAttribute('z'))p.z=Number(elem.getAttribute('z'));if(elem.hasAttribute('width'))p.width=Number(elem.getAttribute('width'));if(elem.hasAttribute('height'))p.height=Number(elem.getAttribute('height'));if(elem.hasAttribute('depth'))p.depth=Number(elem.getAttribute('depth'));var id=elem.getAttribute('id');if(id)window[id]=p;}
parseTagCUBEFRAME(suica,elem)
{var p=suica.cubeFrame(elem.getAttribute('center')||Suica.DEFAULT.CUBE.CENTER,Suica.parseSize(elem.getAttribute('size')||Suica.DEFAULT.CUBE.SIZE),elem.getAttribute('color')||Suica.DEFAULT.CUBE.COLORFRAME);if(elem.hasAttribute('x'))p.x=Number(elem.getAttribute('x'));if(elem.hasAttribute('y'))p.y=Number(elem.getAttribute('y'));if(elem.hasAttribute('z'))p.z=Number(elem.getAttribute('z'));var id=elem.getAttribute('id');if(id)window[id]=p;}}
class Drawing
{static current;constructor(width=32,height=width,color=null)
{this.canvas=document.createElement('canvas');this.canvas.width=width;this.canvas.height=height;this.texture=null;this.context=this.canvas.getContext('2d');this.context.clearRect(0,0,width,height);if(color)
{this.context.fillStyle=color;this.context.fillRect(0,0,width,height);}
this.context.beginPath();}
moveTo(x=0,y=0)
{this.context.moveTo(x,this.canvas.height-y);}
lineTo(x=0,y=0)
{this.context.lineTo(x,this.canvas.height-y);}
curveTo(mx=0,my=0,x=0,y=0)
{this.context.quadraticCurveTo(mx,this.canvas.height-my,x,this.canvas.height-y);}
arc(x=0,y=0,r=10,from=0,to=360)
{this.context.arc(x,this.canvas.height-y,r,from*Math.PI/2,to*Math.PI/2);}
fillText(x=0,y=0,text='',color='black',font='20px Arial')
{this.context.fillStyle=color;this.context.font=font;this.context.fillText(text,x,this.canvas.height-y);}
stroke(color='black',width=1)
{this.texture=null;this.context.strokeStyle=color;this.context.lineWidth=width;this.context.stroke();this.context.beginPath();}
fill(color='gray')
{this.texture=null;this.context.fillStyle=color;this.context.fill();this.context.beginPath();}
fillAndStroke(fillColor='gray',strokeColor='black',width=1)
{this.texture=null;this.context.strokeStyle=strokeColor;this.context.lineWidth=width;this.context.stroke();this.context.fillStyle=fillColor;this.context.fill();this.context.beginPath();}
get image()
{if(!this.texture)
this.texture=new THREE.CanvasTexture(this.canvas);return this.texture;}
static precheck()
{if(!(Drawing.current instanceof Drawing))
throw'error: No Drawing instance is active';}}
window.drawing=function(width=32,height=width,color=null)
{Drawing.current=new Drawing(width,height,color);return Drawing.current;}
window.moveTo=function(x=0,y=0)
{Drawing.precheck();Drawing.current.moveTo(x,y);}
window.lineTo=function(x=0,y=0)
{Drawing.precheck();Drawing.current.lineTo(x,y);}
window.curveTo=function(mx=0,my=0,x=0,y=0)
{Drawing.precheck();Drawing.current.curveTo(mx,my,x,y);}
window.arc=function(x=0,y=0,r=10,from=0,to=360)
{Drawing.precheck();Drawing.current.arc(x,y,r,from,to);}
window.fillText=function(x=0,y=0,text='',color='black',font='20px Arial')
{Drawing.precheck();Drawing.current.fillText(x,y,text,color,font);}
window.stroke=function(color='black',width=1)
{Drawing.precheck();Drawing.current.stroke(color,width);}
window.fill=function(color='gray')
{Drawing.precheck();Drawing.current.fill(color);}
window.fillAndStroke=function(fillColor='gray',strokeColor='black',width=1)
{Drawing.precheck();Drawing.current.fillAndStroke(fillColor,strokeColor,width);}
window.image=function(url=null,repeatX=1,repeatY=1)
{Drawing.current=new THREE.TextureLoader().load(url);Drawing.current.wrapS=THREE.RepeatWrapping;Drawing.current.wrapT=THREE.RepeatWrapping;Drawing.current.magFilter=THREE.LinearFilter;Drawing.current.minFilter=THREE.LinearMipmapLinearFilter;Drawing.current.anisotropy=16;Drawing.current.repeat.set(repeatX,repeatY);return Drawing.current;}
﻿
class Point extends THREE.Points
{static geometry=new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(new Float32Array([0,0,0]),3));constructor(suica,center,size,color)
{suica.parser?.parseTags();if(DEBUG_CALLS)console.log(`:: ${suica.id}.point(${center},${size},${color})`);super(Point.geometry,Suica.pointMaterial.clone());this.suica=suica;this.center=center;this.color=color;this.size=size;suica.scene.add(this);}
get center()
{this.suica.parser?.parseTags();return[this.position.x,this.position.y,this.position.z];}
set center(center)
{this.suica.parser?.parseTags();center=Suica.parseCenter(center);this.position.set(center[0],center[1],center[2]);}
get x()
{this.suica.parser?.parseTags();return this.position.x;}
set x(x)
{this.suica.parser?.parseTags();this.position.x=x;}
get y()
{this.suica.parser?.parseTags();return this.position.y;}
set y(y)
{this.suica.parser?.parseTags();this.position.y=y;}
get z()
{this.suica.parser?.parseTags();return this.position.z;}
set z(z)
{this.suica.parser?.parseTags();this.position.z=z;}
get size()
{this.suica.parser?.parseTags();return this.material.size;}
set size(size)
{this.suica.parser?.parseTags();this.material.size=size;this.material.needsUpdate=true;}
get color()
{this.suica.parser?.parseTags();var col=this.material.color;return[col.r,col.g,col.b];}
set color(col)
{this.suica.parser?.parseTags();this.material.color=Suica.parseColor(col);this.material.needsUpdate=true;}
set image(drawing)
{this.suica.parser?.parseTags();if(drawing instanceof Drawing)
{this.material.map=drawing.image;this.material.needsUpdate=true;return;}
throw'error: Parameter of `image` is not a drawing';}}
window.point=function(center=Suica.DEFAULT.POINT.CENTER,size=Suica.DEFAULT.POINT.SIZE,color=Suica.DEFAULT.POINT.COLOR)
{Suica.precheck();return Suica.current.point(center,size,color);}﻿
class Mesh extends THREE.Mesh
{constructor(suica,geometry,material)
{super(geometry,material);this.suica=suica;this.meshSize=[null,null,null];}
get center()
{this.suica.parser?.parseTags();return[this.position.x,this.position.y,this.position.z];}
set center(center)
{this.suica.parser?.parseTags();center=Suica.parseCenter(center);this.position.set(center[0],center[1],center[2]);}
get x()
{this.suica.parser?.parseTags();return this.position.x;}
set x(x)
{this.suica.parser?.parseTags();this.position.x=x;}
get y()
{this.suica.parser?.parseTags();return this.position.y;}
set y(y)
{this.suica.parser?.parseTags();this.position.y=y;}
get z()
{this.suica.parser?.parseTags();return this.position.z;}
set z(z)
{this.suica.parser?.parseTags();this.position.z=z;}
get color()
{this.suica.parser?.parseTags();var col=this.material.color;return[col.r,col.g,col.b];}
set color(col)
{this.suica.parser?.parseTags();this.material.color=Suica.parseColor(col);this.material.needsUpdate=true;}
set image(drawing)
{this.suica.parser?.parseTags();if(drawing instanceof Drawing)
{this.material.map=drawing.image;this.material.transparent=true,this.material.needsUpdate=true;return;}
if(drawing instanceof THREE.Texture)
{this.material.map=drawing;this.material.transparent=true,this.material.needsUpdate=true;return;}
throw'error: Parameter of `image` is not a drawing';}
updateScale()
{var width=this.meshSize[0];var height=this.meshSize[1];var depth=this.meshSize[2];if(height===null)height=width;if(depth===null)depth=width;switch(this.suica.orientation)
{case Suica.ORIENTATIONS.YXZ:this.scale.set(height,width,depth);break;case Suica.ORIENTATIONS.ZYX:this.scale.set(depth,height,width);break;case Suica.ORIENTATIONS.XZY:this.scale.set(width,depth,height);break;case Suica.ORIENTATIONS.ZXY:this.scale.set(height,depth,width);break;case Suica.ORIENTATIONS.XYZ:this.scale.set(width,height,depth);break;case Suica.ORIENTATIONS.YZX:this.scale.set(depth,width,height);break;default:throw'error: unknown orientation';}}
get width()
{return this.meshSize[0];}
set width(width)
{this.meshSize[0]=width;this.updateScale();}
get height()
{return(this.meshSize[1]!==null)?this.meshSize[1]:this.meshSize[0];}
set height(height)
{this.meshSize[1]=height;this.updateScale();}
get depth()
{return(this.meshSize[2]!==null)?this.meshSize[2]:this.meshSize[0];}
set depth(depth)
{this.meshSize[2]=depth;this.updateScale();}
get size()
{this.suica.parser?.parseTags();if(this.meshSize[2]===null)
{if(this.meshSize[1]===null)
return this.meshSize[0];else
return[this.meshSize[0],this.meshSize[1]];}
return[this.meshSize[0],this.meshSize[1],this.meshSize[2]];}
set size(size)
{this.suica.parser?.parseTags();if(Array.isArray(size))
{if(size.length==0)
this.meshSize=[null,null,null];else
if(size.length==1)
this.meshSize=[size[0],null,null];else
if(size.length==2)
this.meshSize=[size[0],size[1],null];else
this.meshSize=[size[0],size[1],size[2]];}
else
{this.meshSize=[size,null,null];console.log('ms=',this.meshSize);}
this.updateScale();}}
class MeshFrame extends THREE.LineSegments
{constructor(suica,geometry,material)
{super(geometry,material);this.suica=suica;this.meshSize=[null,null,null];}
get center()
{this.suica.parser?.parseTags();return[this.position.x,this.position.y,this.position.z];}
set center(center)
{this.suica.parser?.parseTags();center=Suica.parseCenter(center);this.position.set(center[0],center[1],center[2]);}
get x()
{this.suica.parser?.parseTags();return this.position.x;}
set x(x)
{this.suica.parser?.parseTags();this.position.x=x;}
get y()
{this.suica.parser?.parseTags();return this.position.y;}
set y(y)
{this.suica.parser?.parseTags();this.position.y=y;}
get z()
{this.suica.parser?.parseTags();return this.position.z;}
set z(z)
{this.suica.parser?.parseTags();this.position.z=z;}
get color()
{this.suica.parser?.parseTags();var col=this.material.color;return[col.r,col.g,col.b];}
set color(col)
{this.suica.parser?.parseTags();this.material.color=Suica.parseColor(col);this.material.needsUpdate=true;}
updateScale()
{var width=this.meshSize[0];var height=this.meshSize[1];var depth=this.meshSize[2];if(height===null)height=width;if(depth===null)depth=width;switch(this.suica.orientation)
{case Suica.ORIENTATIONS.YXZ:this.scale.set(height,width,depth);break;case Suica.ORIENTATIONS.ZYX:this.scale.set(depth,height,width);break;case Suica.ORIENTATIONS.XZY:this.scale.set(width,depth,height);break;case Suica.ORIENTATIONS.ZXY:this.scale.set(height,depth,width);break;case Suica.ORIENTATIONS.XYZ:this.scale.set(width,height,depth);break;case Suica.ORIENTATIONS.YZX:this.scale.set(depth,width,height);break;default:throw'error: unknown orientation';}}
get width()
{return this.meshSize[0];}
set width(width)
{this.meshSize[0]=width;this.updateScale();}
get height()
{return(this.meshSize[1]!==null)?this.meshSize[1]:this.meshSize[0];}
set height(height)
{this.meshSize[1]=height;this.updateScale();}
get depth()
{return(this.meshSize[2]!==null)?this.meshSize[2]:this.meshSize[0];}
set depth(depth)
{this.meshSize[2]=depth;this.updateScale();}
get size()
{this.suica.parser?.parseTags();if(this.meshSize[2]===null)
{if(this.meshSize[1]===null)
return this.meshSize[0];else
return[this.meshSize[0],this.meshSize[1]];}
return[this.meshSize[0],this.meshSize[1],this.meshSize[2]];}
set size(size)
{this.suica.parser?.parseTags();if(Array.isArray(size))
{if(size.length==0)
this.meshSize=[null,null,null];else
if(size.length==1)
this.meshSize=[size[0],null,null];else
if(size.length==2)
this.meshSize=[size[0],size[1],null];else
this.meshSize=[size[0],size[1],size[2]];}
else
{this.meshSize=[size,null,null];console.log('ms=',this.meshSize);}
this.updateScale();}}
class Cube extends Mesh
{static geometry=new THREE.BoxGeometry(1,1,1);constructor(suica,center,size,color)
{suica.parser?.parseTags();if(DEBUG_CALLS)console.log(`:: ${suica.id}.cube(${center},${size},${color})`);super(suica,Cube.geometry,Suica.solidMaterial.clone());this.sizeArray=false;this.suica=suica;this.center=center;this.color=color;this.size=size;suica.scene.add(this);}}
class CubeFrame extends MeshFrame
{static geometry=new THREE.EdgesGeometry(Cube.geometry);constructor(suica,center,size,color)
{suica.parser?.parseTags();if(DEBUG_CALLS)console.log(`:: ${suica.id}.cubeFrame(${center},${size},${color})`);super(suica,CubeFrame.geometry,Suica.lineMaterial.clone());this.suica=suica;this.center=center;this.color=color;this.size=size;suica.scene.add(this);}}
window.cube=function(center=Suica.DEFAULT.CUBE.CENTER,size=Suica.DEFAULT.CUBE.SIZE,color=Suica.DEFAULT.CUBE.COLOR)
{Suica.precheck();return Suica.current.cube(center,size,color);}
window.cubeFrame=function(center=Suica.DEFAULT.CUBE.CENTER,size=Suica.DEFAULT.CUBE.SIZE,color=Suica.DEFAULT.CUBE.FRAMECOLOR)
{Suica.precheck();return Suica.current.cubeFrame(center,size,color);}}