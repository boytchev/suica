var vsSource=' uniform mat4 uProjectionMatrix; '+' uniform mat4 uViewMatrix;  '+' uniform mat4 uModelMatrix;  '+' uniform mat3 uNormalMatrix;  '+' uniform bool uUseNormal;  '+' uniform bool uLight;   '+' uniform   vec2 uTexScale;  '+' uniform   vec2 uTexOffset;  '+' uniform float uPointSize;  '+' attribute vec3 aXYZ;   '+' varying   vec4 vXYZT;   '+' attribute vec3 aNormal;   '+' varying   vec4 vNormal;   '+' attribute vec3 aColor;   '+' varying   vec3 vColor;   '+' attribute vec2 aTexCoord;  '+' varying   vec2 vTexCoord;  '+' void main ()     '+' {        '+'  if (uLight)     '+'  {       '+'   if (uUseNormal)   '+'    vNormal = normalize(vec4(uNormalMatrix*aNormal,0));  '+'   else     '+'    vNormal = normalize(uViewMatrix * uModelMatrix * vec4(aNormal,0));  '+'  }       '+'  vColor = aColor;   '+'  vTexCoord = aTexCoord*uTexScale-uTexOffset; '+'  vXYZT =  vec4(aXYZ,1); '+'  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aXYZ,1); '+'  gl_PointSize = uPointSize; '+' }        ';var fsSource='  uniform sampler2D uSampler;  '+'  precision mediump float;  '+'  uniform bool uLight;   '+'  uniform bool uTexture;   '+'  uniform int uClipPlanes;  '+'  uniform vec4 uClipPlane[4];  '+'  varying vec4 vXYZT;    '+'  varying vec4 vNormal;   '+'  varying vec3 vColor;   '+'  varying vec2 vTexCoord;   '+'  void main( )     '+'  {        '+'   if (uClipPlanes>0)   '+'   {       '+'    if (dot(vXYZT,uClipPlane[0])<0.0) discard;'+'    if (uClipPlanes>1)  '+'    {      '+'     if (dot(vXYZT,uClipPlane[1])<0.0) discard;'+'     if (uClipPlanes>2) '+'     {     '+'      if (dot(vXYZT,uClipPlane[2])<0.0) discard;'+'      if (uClipPlanes>3) '+'      {     '+'       if (dot(vXYZT,uClipPlane[3])<0.0) discard;'+'      }     '+'     }     '+'    }      '+'   }       '+'   vec4 color;              '+'   if (uTexture)             '+'    color = texture2D(uSampler,vTexCoord);      '+'   else               '+'    color = vec4(vColor,1.0);         '+'   float diffLight = uLight?abs(vNormal.z):1.0;     '+'   gl_FragColor = vec4((diffLight*0.8+0.2)*color.rgb,color.a);  '+'  }                 ';var fsSourcePoints='  uniform sampler2D uSampler;  '+'  precision mediump float;  '+'  uniform bool uLight;   '+'  uniform bool uTexture;   '+'  uniform int uClipPlanes;  '+'  uniform vec4 uClipPlane[3];  '+'  uniform highp float uPointSize;  '+'  varying vec4 vXYZT;    '+'  varying vec4 vNormal;   '+'  varying vec3 vColor;   '+'  varying vec2 vTexCoord;   '+'  void main( )     '+'  {        '+'   if (uClipPlanes>0)   '+'   {       '+'    if (dot(vXYZT,uClipPlane[0])<0.0) discard;'+'    if (uClipPlanes>1)  '+'    {      '+'     if (dot(vXYZT,uClipPlane[1])<0.0) discard;'+'     if (uClipPlanes>2) '+'     {     '+'      if (dot(vXYZT,uClipPlane[2])<0.0) discard;'+'     }     '+'    }      '+'   }       '+'   float dist = distance( gl_PointCoord, vec2(0.5) );    '+'   if (uPointSize>3.5)          '+'   { if (dist > 0.5) discard;          '+'   }'+'   vec4 color;              '+'   if (uTexture)             '+'    color = texture2D(uSampler,vTexCoord);      '+'   else               '+'    color = vec4(vColor,1.0);         '+'   float diffLight = uLight?abs(vNormal.z):1.0;     '+'   gl_FragColor = vec4((diffLight*0.8+0.2)*color.rgb,color.a);  '+'  }                 ';var vsSourceSelect=' uniform mat4 uProjectionMatrix; '+' uniform mat4 uViewMatrix;  '+' uniform mat4 uModelMatrix;  '+' uniform float uPointSize;  '+' attribute vec3 aXYZ;   '+' varying   vec4 vXYZT;   '+' attribute vec3 aColor;   '+' varying   vec3 vColor;   '+' void main ()     '+' {        '+'  vColor = aColor;   '+'  vXYZT =  vec4(aXYZ,1); '+'  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aXYZ,1); '+'  gl_PointSize = uPointSize; '+' }        ';var fsSourceSelect=' precision mediump float; '+' uniform int uClipPlanes; '+' uniform vec4 uClipPlane[3]; '+' varying vec3 vColor;  '+' varying vec4 vXYZT;   '+' void main( )    '+' {       '+'  if (uClipPlanes>0)  '+'  {      '+'   if (dot(vXYZT,uClipPlane[0])<0.0) discard;'+'   if (uClipPlanes>1) '+'   {     '+'    if (dot(vXYZT,uClipPlane[1])<0.0) discard;'+'    if (uClipPlanes>2)'+'    {    '+'     if (dot(vXYZT,uClipPlane[2])<0.0) discard;'+'    }    '+'   }     '+'  }      '+'  gl_FragColor = vec4(vColor,1.0);'+' }       ';var Suica=function(canvasId)
{if(!canvasId)
{var cvx;var cvxs=document.getElementsByTagName('canvas');if(!cvxs.length)
{cvx=document.createElement('canvas');document.body.appendChild(cvx);}
else
cvx=cvxs[0];if(!cvx.id)cvx.id='suica_canvas';canvasId=cvx.id;}
this.gl=Suica.getContext(canvasId,{antialias:true,alpha:true,});this.shaderProgram=Suica.getProgram(this.gl,vsSource,fsSource);this.shaderProgramPoints=Suica.getProgram(this.gl,vsSource,fsSourcePoints);this.shaderProgramSelect=Suica.getProgram(this.gl,vsSourceSelect,fsSourceSelect);this.viewMatrix=this.identityMatrix();this.modelMatrix=this.identityMatrix();this.projectionMatrix=this.identityMatrix();this.useShader(this.shaderProgram);this.gl.enable(this.gl.DEPTH_TEST);this.gl.enableVertexAttribArray(this.aXYZ);this.gl.disable(this.gl.CULL_FACE);this.gl.cullFace(this.gl.BACK);this.newModelMatrix=true;this.modelMatrixStack=[];this.normalMatrix=new Float32Array(9);this.perspective(30,1,40000);this.lookAt([100*Math.cos(Math.PI/6),100*Math.sin(Math.PI/6),30],[0,0,0],[0,0,1]);this.demoViewPoint=null;this.backgroundColor=[1,1,1];this.nextFrame=null;Suica.contextList.push(this);Suica.lastContext=this;this.renderMode=Suica.ALL;this.hasPoints=false;this.objectList=[];}
Suica.prototype.useShader=function(shader)
{if(shader==this.shaderProgram)
{this.uProjectionMatrix=this.gl.getUniformLocation(this.shaderProgram,"uProjectionMatrix");this.uViewMatrix=this.gl.getUniformLocation(this.shaderProgram,"uViewMatrix");this.uModelMatrix=this.gl.getUniformLocation(this.shaderProgram,"uModelMatrix");this.uNormalMatrix=this.gl.getUniformLocation(this.shaderProgram,"uNormalMatrix");this.uUseNormal=this.gl.getUniformLocation(this.shaderProgram,"uUseNormal");this.uLight=this.gl.getUniformLocation(this.shaderProgram,"uLight");this.uPointSize=this.gl.getUniformLocation(this.shaderProgram,"uPointSize");this.uTexture=this.gl.getUniformLocation(this.shaderProgram,"uTexture");this.uSampler=this.gl.getUniformLocation(this.shaderProgram,"uSampler");this.uTexScale=this.gl.getUniformLocation(this.shaderProgram,"uTexScale");this.uTexOffset=this.gl.getUniformLocation(this.shaderProgram,"uTexOffset");this.uClipPlanes=this.gl.getUniformLocation(this.shaderProgram,"uClipPlanes");this.uClipPlane=this.gl.getUniformLocation(this.shaderProgram,"uClipPlane");this.aXYZ=this.gl.getAttribLocation(this.shaderProgram,"aXYZ");this.aNormal=this.gl.getAttribLocation(this.shaderProgram,"aNormal");this.aColor=this.gl.getAttribLocation(this.shaderProgram,"aColor");this.aTexCoord=this.gl.getAttribLocation(this.shaderProgram,"aTexCoord");this.gl.useProgram(shader);this.gl.uniform1i(this.uUseNormal,false);this.gl.uniformMatrix4fv(this.uProjectionMatrix,false,this.projectionMatrix);this.gl.uniformMatrix4fv(this.uViewMatrix,false,this.viewMatrix);this.gl.uniformMatrix4fv(this.uModelMatrix,false,this.modelMatrix);Suica.normalRender=true;return;}
if(shader==this.shaderProgramPoints)
{this.uProjectionMatrix=this.gl.getUniformLocation(this.shaderProgramPoints,"uProjectionMatrix");this.uViewMatrix=this.gl.getUniformLocation(this.shaderProgramPoints,"uViewMatrix");this.uModelMatrix=this.gl.getUniformLocation(this.shaderProgramPoints,"uModelMatrix");this.uNormalMatrix=this.gl.getUniformLocation(this.shaderProgramPoints,"uNormalMatrix");this.uUseNormal=this.gl.getUniformLocation(this.shaderProgramPoints,"uUseNormal");this.uLight=this.gl.getUniformLocation(this.shaderProgramPoints,"uLight");this.uPointSize=this.gl.getUniformLocation(this.shaderProgramPoints,"uPointSize");this.uTexture=this.gl.getUniformLocation(this.shaderProgramPoints,"uTexture");this.uSampler=this.gl.getUniformLocation(this.shaderProgramPoints,"uSampler");this.uTexScale=this.gl.getUniformLocation(this.shaderProgramPoints,"uTexScale");this.uTexOffset=this.gl.getUniformLocation(this.shaderProgramPoints,"uTexOffset");this.uClipPlanes=this.gl.getUniformLocation(this.shaderProgramPoints,"uClipPlanes");this.uClipPlane=this.gl.getUniformLocation(this.shaderProgramPoints,"uClipPlane");this.aXYZ=this.gl.getAttribLocation(this.shaderProgramPoints,"aXYZ");this.aNormal=this.gl.getAttribLocation(this.shaderProgramPoints,"aNormal");this.aColor=this.gl.getAttribLocation(this.shaderProgramPoints,"aColor");this.aTexCoord=this.gl.getAttribLocation(this.shaderProgramPoints,"aTexCoord");this.gl.useProgram(shader);this.gl.uniform1i(this.uUseNormal,false);this.gl.uniformMatrix4fv(this.uProjectionMatrix,false,this.projectionMatrix);this.gl.uniformMatrix4fv(this.uViewMatrix,false,this.viewMatrix);this.gl.uniformMatrix4fv(this.uModelMatrix,false,this.modelMatrix);Suica.normalRender=true;return;}
if(shader==this.shaderProgramSelect)
{this.gl.disableVertexAttribArray(this.aTexCoord);this.gl.disableVertexAttribArray(this.aNormal);this.uProjectionMatrix=this.gl.getUniformLocation(this.shaderProgramSelect,"uProjectionMatrix");this.uViewMatrix=this.gl.getUniformLocation(this.shaderProgramSelect,"uViewMatrix");this.uModelMatrix=this.gl.getUniformLocation(this.shaderProgramSelect,"uModelMatrix");this.uPointSize=this.gl.getUniformLocation(this.shaderProgramSelect,"uPointSize");this.uClipPlanes=this.gl.getUniformLocation(this.shaderProgramSelect,"uClipPlanes");this.uClipPlane=this.gl.getUniformLocation(this.shaderProgramSelect,"uClipPlane");this.aXYZ=this.gl.getAttribLocation(this.shaderProgramSelect,"aXYZ");this.aColor=this.gl.getAttribLocation(this.shaderProgramSelect,"aColor");this.gl.useProgram(this.shaderProgramSelect);this.gl.uniformMatrix4fv(this.uProjectionMatrix,false,this.projectionMatrix);this.gl.uniformMatrix4fv(this.uViewMatrix,false,this.viewMatrix);this.gl.uniformMatrix4fv(this.uModelMatrix,false,this.modelMatrix);Suica.normalRender=false;return;}
console.log('suica.js: useShader(): invalid shader');}
Suica.contextList=[];Suica.lastContext=null;Suica.startTime=(new Date()).getTime();Suica.time=0;Suica.dTime=0;Suica.FLOATS=Float32Array.BYTES_PER_ELEMENT;Suica.normalRender=true;Suica.POINT=1;Suica.LINE=2;Suica.SOLID=3;Suica.ALL=4;Suica.NONPOINT=5;Suica.PRECISION=48;Suica.id=0;Suica.getContext=function(canvasId)
{var canvas=document.getElementById(canvasId);if(!canvas)
{alert('Не е намерен елемент canvas с id='+canvasId+' [getContext]');return null;}
canvas.addEventListener('webglcontextlost',function(event){event.preventDefault();},false);canvas.addEventListener('webglcontextrestored',function(event){console.log('Boo!');},false);var context=canvas.getContext('webgl')||canvas.getContext('experimental-webgl');if(!context)
{alert('Не е създаден графичен контекст [getContext]');}
return context;}
Suica.getShader=function(gl,source,type)
{var shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))
{alert(gl.getShaderInfoLog(shader));return null;}
return shader;}
Suica.getProgram=function(gl,vsSource,fsSource)
{var vShader=Suica.getShader(gl,vsSource,gl.VERTEX_SHADER);var fShader=Suica.getShader(gl,fsSource,gl.FRAGMENT_SHADER);if(!vShader||!fShader){return null;}
var shaderProgram=gl.createProgram();gl.bindAttribLocation(shaderProgram,0,"aXYZ");gl.attachShader(shaderProgram,vShader);gl.attachShader(shaderProgram,fShader);gl.linkProgram(shaderProgram);if(!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS))
{alert(gl.getProgramInfoLog(shaderProgram));return null;}
return shaderProgram;}
Suica.prototype.perspective=function(angle,near,far)
{var aspect=this.gl.canvas.clientWidth/this.gl.canvas.clientHeight;var fov=1/Math.tan(radians(angle)/2);this.projectionMatrix=new Float32Array([fov/aspect,0,0,0,0,fov,0,0,0,0,(far+near)/(near-far),-1,0,0,2.0*near*far/(near-far),0]);this.gl.uniformMatrix4fv(this.uProjectionMatrix,false,this.projectionMatrix);}
function perspective(angle,near,far)
{if(Suica.lastContext)Suica.lastContext.perspective(angle,near,far);}
Suica.prototype.orthographic=function(near,far)
{var width=this.gl.canvas.clientWidth;var height=this.gl.canvas.clientHeight;var matrix=new Float32Array([2.0/width,0,0,0,0,2.0/height,0,0,0,0,2.0/(near-far),0,0,0,(far+near)/(near-far),1]);this.gl.uniformMatrix4fv(this.uProjectionMatrix,false,matrix);}
function orthographic(near,far)
{if(Suica.lastContext)Suica.lastContext.orthographic(near,far);}
Suica.prototype.lookAt=function(eye,target,up)
{var z=Suica.unitVector(Suica.vectorPoints(eye,target));var x=Suica.unitVector(Suica.vectorProduct(up,z));var y=Suica.unitVector(Suica.vectorProduct(z,x));this.viewMatrix=new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-Suica.scalarProduct(x,eye),-Suica.scalarProduct(y,eye),-Suica.scalarProduct(z,eye),1]);this.gl.uniformMatrix4fv(this.uViewMatrix,false,this.viewMatrix);}
function lookAt(eye,target,up)
{if(Suica.lastContext)Suica.lastContext.lookAt(eye,target,up);}
Suica.prototype.background=function(color)
{this.backgroundColor=color;}
function background(color)
{if(Suica.lastContext)Suica.lastContext.background(color);}
Suica.prototype.oxyz=function(length)
{if(!length)length=30;point([0,0,0]).custom({pointSize:6,color:[0,0,0]});segment([0,0,0],[length,0,0]).custom({color:[0,0,0]});segment([0,0,0],[0,length,0]).custom({color:[0,0,0]});segment([0,0,0],[0,0,length]).custom({color:[0,0,0]});}
function oxyz(length)
{if(Suica.lastContext)
Suica.lastContext.oxyz(length);}
Suica.prototype.demo=function(distance,speed,height,target)
{distance=distance||100;speed=speed||1;if(height===undefined){height=0.3};if(target===undefined){target=0.0};speed=speed*Math.PI/10;this.demoViewPoint={distance:distance,speed:speed,height:height,target:target};}
function demo(distance,speed,height,target)
{if(Suica.lastContext)Suica.lastContext.demo(distance,speed,height,target);}
Suica.prototype.identityMatrix=function()
{return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);}
Suica.prototype.identity=function()
{this.newModelMatrix=true;this.modelMatrix=this.identityMatrix();}
Suica.prototype.scale=function(v)
{this.newModelMatrix=true;var m=this.modelMatrix;m[0]*=v[0];m[1]*=v[0];m[2]*=v[0];m[4]*=v[1];m[5]*=v[1];m[6]*=v[1];m[8]*=v[2];m[9]*=v[2];m[10]*=v[2];}
Suica.prototype.translate=function(v)
{this.newModelMatrix=true;var m=this.modelMatrix;m[12]+=m[0]*v[0]+m[4]*v[1]+m[8]*v[2];m[13]+=m[1]*v[0]+m[5]*v[1]+m[9]*v[2];m[14]+=m[2]*v[0]+m[6]*v[1]+m[10]*v[2];}
Suica.prototype.yRotate=function(a)
{this.newModelMatrix=true;var m=this.modelMatrix;var s=Math.sin(a);var c=Math.cos(a);a=m[0]*s+m[8]*c;m[0]=m[0]*c-m[8]*s;m[8]=a;a=m[1]*s+m[9]*c;m[1]=m[1]*c-m[9]*s;m[9]=a;a=m[2]*s+m[10]*c;m[2]=m[2]*c-m[10]*s;m[10]=a;}
Suica.prototype.zRotate=function(a)
{this.newModelMatrix=true;var m=this.modelMatrix;var s=Math.sin(a);var c=Math.cos(a);a=m[0]*s+m[4]*c;m[0]=m[0]*c-m[4]*s;m[4]=a;a=m[1]*s+m[5]*c;m[1]=m[1]*c-m[5]*s;m[5]=a;a=m[2]*s+m[6]*c;m[2]=m[2]*c-m[6]*s;m[6]=a;}
Suica.prototype.matrixMultiply=function(a,b)
{var res=[];var b0=b[0],b1=b[1],b2=b[2],b3=b[3];res[0]=b0*a[0]+b1*a[4]+b2*a[8]+b3*a[12];res[1]=b0*a[1]+b1*a[5]+b2*a[9]+b3*a[13];res[2]=b0*a[2]+b1*a[6]+b2*a[10]+b3*a[14];res[3]=b0*a[3]+b1*a[7]+b2*a[11]+b3*a[15];b0=b[4];b1=b[5];b2=b[6];b3=b[7];res[4]=b0*a[0]+b1*a[4]+b2*a[8]+b3*a[12];res[5]=b0*a[1]+b1*a[5]+b2*a[9]+b3*a[13];res[6]=b0*a[2]+b1*a[6]+b2*a[10]+b3*a[14];res[7]=b0*a[3]+b1*a[7]+b2*a[11]+b3*a[15];b0=b[8];b1=b[9];b2=b[10];b3=b[11];res[8]=b0*a[0]+b1*a[4]+b2*a[8]+b3*a[12];res[9]=b0*a[1]+b1*a[5]+b2*a[9]+b3*a[13];res[10]=b0*a[2]+b1*a[6]+b2*a[10]+b3*a[14];res[11]=b0*a[3]+b1*a[7]+b2*a[11]+b3*a[15];b0=b[12];b1=b[13];b2=b[14];b3=b[15];res[12]=b0*a[0]+b1*a[4]+b2*a[8]+b3*a[12];res[13]=b0*a[1]+b1*a[5]+b2*a[9]+b3*a[13];res[14]=b0*a[2]+b1*a[6]+b2*a[10]+b3*a[14];res[15]=b0*a[3]+b1*a[7]+b2*a[11]+b3*a[15];return res;};Suica.prototype.transposeInverse=function()
{var a=this.matrixMultiply(this.viewMatrix,this.modelMatrix);var b00=a[0]*a[5]-a[1]*a[4],b01=a[0]*a[6]-a[2]*a[4],b02=a[0]*a[7]-a[3]*a[4],b03=a[1]*a[6]-a[2]*a[5],b04=a[1]*a[7]-a[3]*a[5],b05=a[2]*a[7]-a[3]*a[6],b06=a[8]*a[13]-a[9]*a[12],b07=a[8]*a[14]-a[10]*a[12],b08=a[8]*a[15]-a[11]*a[12],b09=a[9]*a[14]-a[10]*a[13],b10=a[9]*a[15]-a[11]*a[13],b11=a[10]*a[15]-a[11]*a[14],det=1/(b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06);this.normalMatrix[0]=(a[5]*b11-a[6]*b10+a[7]*b09)*det;this.normalMatrix[1]=(a[6]*b08-a[4]*b11-a[7]*b07)*det;this.normalMatrix[2]=(a[4]*b10-a[5]*b08+a[7]*b06)*det;this.normalMatrix[3]=(a[2]*b10-a[1]*b11-a[3]*b09)*det;this.normalMatrix[4]=(a[0]*b11-a[2]*b08+a[3]*b07)*det;this.normalMatrix[5]=(a[1]*b08-a[0]*b10-a[3]*b06)*det;this.normalMatrix[6]=(a[13]*b05-a[14]*b04+a[15]*b03)*det;this.normalMatrix[7]=(a[14]*b02-a[12]*b05-a[15]*b01)*det;this.normalMatrix[8]=(a[12]*b04-a[13]*b02+a[15]*b00)*det;};Suica.prototype.cloneMatrix=function(a)
{var b=new Float32Array(a.length);b.set(a);return b;}
Suica.prototype.pushMatrix=function()
{this.modelMatrixStack.push(this.cloneMatrix(this.modelMatrix));}
Suica.prototype.popMatrix=function()
{this.newModelMatrix=true;if(this.modelMatrix.length)
this.modelMatrix=this.modelMatrixStack.pop();else
identity();}
Suica.prototype.useModelMatrix=function()
{if(this.newModelMatrix)
{this.newModelMatrix=false;this.gl.uniformMatrix4fv(this.uModelMatrix,false,this.modelMatrix);}}
Suica.prototype.redrawFrame=function()
{this.gl.clearColor(this.backgroundColor[0],this.backgroundColor[1],this.backgroundColor[2],1);this.gl.clear(this.gl.COLOR_BUFFER_BIT+this.gl.DEPTH_BUFFER_BIT);if(this.demoViewPoint!=null)
{this.lookAt([this.demoViewPoint.distance*Math.sin(this.demoViewPoint.speed*Suica.time),this.demoViewPoint.distance*Math.cos(this.demoViewPoint.speed*Suica.time),this.demoViewPoint.distance*this.demoViewPoint.height],[0,0,this.demoViewPoint.distance*this.demoViewPoint.target],[0,0,1]);}
if(this.nextFrame)this.nextFrame();}
Suica.prototype.objectAtPoint=function(x,y)
{var rec=this.gl.canvas.getBoundingClientRect();this.useShader(this.shaderProgramSelect);this.gl.clearColor(1,1,1,1);this.gl.clear(this.gl.COLOR_BUFFER_BIT+this.gl.DEPTH_BUFFER_BIT);for(var i=0;i<this.objectList.length;i++)
this.objectList[i].drawObject();var pixelValues=new Uint8Array(4);this.gl.readPixels(x-rec.left,rec.bottom-y,1,1,this.gl.RGBA,this.gl.UNSIGNED_BYTE,pixelValues);var id=pixelValues[0]+(pixelValues[1]<<8)+(pixelValues[2]<<16);var foundObject=null;if(id<=Suica.id)
{for(var i=0;i<this.objectList.length;i++)
if(this.objectList[i].interactive)
if(this.objectList[i].id==id)
{this.gl.clearColor(1,1,1,1);this.gl.clear(this.gl.COLOR_BUFFER_BIT+this.gl.DEPTH_BUFFER_BIT);this.objectList[i].drawObject();this.gl.readPixels(x-rec.left,rec.bottom-y,1,1,this.gl.RGBA,this.gl.UNSIGNED_BYTE,pixelValues);var checkedId=pixelValues[0]+(pixelValues[1]<<8)+(pixelValues[2]<<16);if(id==checkedId)
{foundObject=this.objectList[i];break;}}}
this.useShader(this.shaderProgram);return foundObject;}
function mainAnimationLoop()
{var time=new Date();time=(time.getTime()-Suica.startTime)/1000;Suica.dTime=time-Suica.time;Suica.time=time;for(var s=0;s<Suica.contextList.length;s++)
{Suica.contextList[s].redrawFrame(time);}
for(var s=0;s<Suica.contextList.length;s++)
{var suica=Suica.contextList[s];suica.renderMode=Suica.NONPOINT;suica.hasPoints=false;for(var i=0;i<suica.objectList.length;i++)
suica.objectList[i].drawObject();if(suica.hasPoints)
{suica.useShader(suica.shaderProgramPoints);suica.renderMode=Suica.POINT;for(var i=0;i<suica.objectList.length;i++)
suica.objectList[i].drawObject();suica.useShader(suica.shaderProgram);}
suica.renderMode=Suica.ALL;}
requestAnimationFrame(mainAnimationLoop);}
Suica.random=function(a,b)
{return a+(b-a)*Math.random();}
Suica.radians=function(degrees)
{return degrees*Math.PI/180;}
Suica.unitVector=function(x)
{var len=1/Math.sqrt(x[0]*x[0]+x[1]*x[1]+x[2]*x[2]);return[len*x[0],len*x[1],len*x[2]];}
Suica.vectorProduct=function(x,y)
{return[x[1]*y[2]-x[2]*y[1],x[2]*y[0]-x[0]*y[2],x[0]*y[1]-x[1]*y[0]];}
Suica.scalarProduct=function(x,y)
{return x[0]*y[0]+x[1]*y[1]+x[2]*y[2];}
Suica.vectorPoints=function(x,y)
{return[x[0]-y[0],x[1]-y[1],x[2]-y[2]];}
Suica.sameAs=function(obj)
{if(obj instanceof Array)
{return obj.slice(0);}
else
{var result={};for(var n in obj)result[n]=obj[n];obj.ctx.objectList.push(result);return result;}}
Suica.scrollLeft=function(){return Math.max(window.pageXOffset?window.pageXOffset:0,document.documentElement?document.documentElement.scrollLeft:0,document.body?document.body.scrollLeft:0);}
Suica.scrollTop=function(){return Math.max(window.pageYOffset?window.pageYOffset:0,document.documentElement?document.documentElement.scrollTop:0,document.body?document.body.scrollTop:0);}
var random=Suica.random;var radians=Suica.radians;var unitVector=Suica.unitVector;var vectorProduct=Suica.vectorProduct;var scalarProduct=Suica.scalarProduct;var vectorPoints=Suica.vectorPoints;var sameAs=Suica.sameAs;mainAnimationLoop();Suica.version='1.0.06 (150818)';﻿
Suica.Object=function()
{Suica.id+=3;this.id=Suica.id;this.idColor=[(this.id&0xff)/255,((this.id>>8)&0xff)/255,((this.id>>16)&0xff)/255];this.ctx=Suica.lastContext;this.color=[0,0,0];this.origin=[0,0,0];this.light=true;this.visible=true;this.hollow=false;this.interactive=false;this.mode=Suica.SOLID;this.pointSize=3.0;this.focus=null;this.spin=null;this.image=null;Suica.lastContext.objectList.push(this);}
Suica.Object.prototype.drawObject=function()
{if(!this.visible)return;if(this.mode==Suica.POINT)
{this.ctx.hasPoints=true;}
if(this instanceof Suica.Group)
{}
else
{if(this.ctx.renderMode==Suica.POINT&&this.mode!=Suica.POINT)return;if(this.ctx.renderMode==Suica.NONPOINT&&this.mode==Suica.POINT)return;}
if(!Suica.normalRender&&!this.interactive)return;if(!this.hollow)
if(!this.clipPlanes||!this.clipPlanes.length)
if(!this.color||this.color.length<4)
this.ctx.gl.enable(this.ctx.gl.CULL_FACE);if(Suica.normalRender)
{if(this.color)this.ctx.gl.vertexAttrib3fv(this.ctx.aColor,this.color);}
else
{this.ctx.gl.vertexAttrib3fv(this.ctx.aColor,this.idColor);}
this.ctx.pushMatrix();if(this.center)
{this.ctx.translate(this.center);}
if(this.focus)
{var xy=Math.sqrt(this.focus[0]*this.focus[0]+this.focus[1]*this.focus[1]);var beta=Math.atan2(xy,this.focus[2]);var alpha=Math.atan2(this.focus[1],this.focus[0]);this.ctx.zRotate(-alpha);this.ctx.yRotate(beta);}
if(this.spin)
{this.ctx.zRotate(this.spin);}
if(this.getSizes)
{this.ctx.scale(this.getSizes());}
this.ctx.translate([-this.origin[0],-this.origin[1],-this.origin[2]]);this.ctx.useModelMatrix();if(this.clipPlanes)
{var n=this.clipPlanes.length;if(n>2)n=2;this.ctx.gl.uniform1i(this.ctx.uClipPlanes,n);var a=this.clipPlanes[0];if(n>1)a=a.concat(this.clipPlanes[1]);this.ctx.gl.uniform4fv(this.ctx.uClipPlane,a);}
else
this.ctx.gl.uniform1i(this.ctx.uClipPlanes,0);switch(this.mode)
{case Suica.POINT:this.drawPoint.drawMesh(this);break;case Suica.LINE:this.drawLine.drawMesh(this);break;case Suica.SOLID:this.drawSolid.drawMesh(this);break;}
this.ctx.popMatrix();this.ctx.gl.disable(this.ctx.gl.CULL_FACE);}
Suica.Object.prototype.custom=function(properties)
{for(var n in properties)this[n]=properties[n];return this;}
Suica.Object.prototype.getPosition=function()
{var m=this.ctx.matrixMultiply(this.ctx.projectionMatrix,this.ctx.matrixMultiply(this.ctx.viewMatrix,this.ctx.modelMatrix));var c=this.center;var x=m[0]*c[0]+m[4]*c[1]+m[8]*c[2]+m[12];var y=m[1]*c[0]+m[5]*c[1]+m[9]*c[2]+m[13];var w=m[3]*c[0]+m[7]*c[1]+m[11]*c[2]+m[15];var p=this.ctx.gl.canvas;var br=p.getBoundingClientRect();x=x*p.width/w/2;y=y*p.height/w/2;return[br.left+x+p.width/2+Suica.scrollLeft(),br.top-y+p.height/2+Suica.scrollTop()];}
Suica.Image=function(url,scale,offset)
{this.ctx=Suica.lastContext;this.url=url;if(scale instanceof Array)
this.scale=scale;else
if(scale==undefined)
this.scale=[1,1];else
this.scale=[scale,scale];if(offset instanceof Array)
this.offset=offset;else
this.offset=[0,0];this.baseScale=null;this.texture=this.ctx.gl.createTexture();Suica.loadImageForTexture(this.ctx.gl,this.url,this.texture);}
Suica.ongoingImageLoads=[];Suica.loadImageForTexture=function(gl,url,texture)
{var image=new Image();image.onload=function(){Suica.ongoingImageLoads.splice(Suica.ongoingImageLoads.indexOf(image),1);Suica.textureFinishedLoading(gl,url,image,texture);}
Suica.ongoingImageLoads.push(image);image.src=url;}
Suica.textureFinishedLoading=function(gl,url,image,texture)
{gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.bindTexture(gl.TEXTURE_2D,null);}
Suica.texturesReady=function()
{return Suica.ongoingImageLoads.length==0;}﻿
Suica.SolidSquareMesh=function(ctx)
{var gl=ctx.gl;var nZ=[0,0,1];var t0=[0,0],t1=[1,0],t2=[1,1],t3=[0,1];var v0=[+0.5,-0.5,0],v1=[+0.5,+0.5,0],v2=[-0.5,+0.5,0],v3=[-0.5,-0.5,0];var mesh=new Float32Array([].concat(v1,t1,nZ,v2,t2,nZ,v0,t0,nZ,v0,t0,nZ,v2,t2,nZ,v3,t3,nZ,[]));this.ctx=ctx;this.length=mesh.length;this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);}
Suica.SolidSquareMesh.prototype.drawMesh=function(obj)
{var gl=this.ctx.gl;var hasTexture=(obj.image&&Suica.texturesReady());gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.enableVertexAttribArray(this.ctx.aXYZ);gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,8*Suica.FLOATS,0*Suica.FLOATS);if(Suica.normalRender)
{gl.uniform1i(this.ctx.uLight,obj.light);gl.uniform1i(this.ctx.uTexture,obj.image!=null);gl.enableVertexAttribArray(this.ctx.aNormal);gl.vertexAttribPointer(this.ctx.aNormal,3,gl.FLOAT,false,8*Suica.FLOATS,5*Suica.FLOATS);if(hasTexture)
{gl.enableVertexAttribArray(this.ctx.aTexCoord);gl.vertexAttribPointer(this.ctx.aTexCoord,2,gl.FLOAT,false,8*Suica.FLOATS,3*Suica.FLOATS);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,obj.image.texture);gl.uniform1i(this.ctx.uTexture,true);gl.uniform2fv(this.ctx.uTexScale,obj.image.scale);gl.uniform2fv(this.ctx.uTexOffset,obj.image.offset);}}
gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(1,0);gl.drawArrays(gl.TRIANGLES,0,this.length/8);gl.disable(gl.POLYGON_OFFSET_FILL);if(Suica.normalRender)
{if(hasTexture)
{gl.bindTexture(gl.TEXTURE_2D,null);gl.uniform1i(this.ctx.uTexture,false);gl.disableVertexAttribArray(this.ctx.aTexCoord);}}}
Suica.WireframeSquareMesh=function(ctx)
{var gl=ctx.gl;var v0=[+0.5,-0.5,0],v1=[+0.5,+0.5,0],v2=[-0.5,+0.5,0],v3=[-0.5,-0.5,0];var mesh=new Float32Array([].concat(v0,v1,v2,v3));this.ctx=ctx;this.length=mesh.length;this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);}
Suica.WireframeSquareMesh.prototype.drawMesh=function(obj)
{var gl=this.ctx.gl;gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.enableVertexAttribArray(this.ctx.aXYZ);if(Suica.normalRender)
{gl.disableVertexAttribArray(this.ctx.aNormal);gl.uniform1i(this.ctx.uLight,false);}
if(obj.mode==Suica.POINT)
{gl.uniform1f(this.ctx.uPointSize,obj.pointSize);gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);gl.drawArrays(gl.POINTS,0,4);}
else
{gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);gl.drawArrays(gl.LINE_LOOP,0,4);}}
Suica.Square=function(center,size)
{Suica.Object.apply(this,arguments);this.color=[0,0.5,1];this.center=center;this.size=size;this.hollow=true;if(!this.ctx.wireframeSquareMesh)
this.ctx.wireframeSquareMesh=new Suica.WireframeSquareMesh(this.ctx);if(!this.ctx.solidSquareMesh)
this.ctx.solidSquareMesh=new Suica.SolidSquareMesh(this.ctx);this.drawPoint=this.ctx.wireframeSquareMesh;this.drawLine=this.ctx.wireframeSquareMesh;this.drawSolid=this.ctx.solidSquareMesh;}
Suica.Square.prototype=Object.create(Suica.Object.prototype);Suica.Square.prototype.getSizes=function()
{return[this.size,this.size,this.size];}
Suica.Rectangle=function(center,sizes)
{Suica.Square.apply(this,arguments);this.sizes=sizes;}
Suica.Rectangle.prototype=Object.create(Suica.Square.prototype);Suica.Rectangle.prototype.getSizes=function()
{return[this.sizes[0],this.sizes[1],1];}
function square(center,size)
{return new Suica.Square(center,size);}
function rectangle(center,sizes)
{return new Suica.Rectangle(center,sizes);}
﻿
Suica.PointMesh=function(ctx)
{var gl=ctx.gl;var mesh=new Float32Array([0,0,0,0,0,0]);this.ctx=ctx;this.length=mesh.length;this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);}
Suica.PointMesh.prototype.drawMesh=function(obj)
{var gl=this.ctx.gl;gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.enableVertexAttribArray(this.ctx.aXYZ);gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);if(Suica.normalRender)
{gl.uniform1i(this.ctx.uLight,false);gl.uniform1i(this.ctx.uTexture,false);gl.disableVertexAttribArray(this.ctx.aTexCoord);gl.disableVertexAttribArray(this.ctx.aNormal);}
gl.uniform1f(this.ctx.uPointSize,obj.pointSize);gl.drawArrays(gl.POINTS,0,1);}
Suica.Point=function(center)
{Suica.Object.apply(this,arguments);this.color=[1,0.2,0.2];this.center=center;this.mode=Suica.POINT;if(!this.ctx.pointMesh)
this.ctx.pointMesh=new Suica.PointMesh(this.ctx);this.drawPoint=this.ctx.pointMesh;this.drawLine=this.ctx.pointMesh;this.drawSolid=this.ctx.pointMesh;}
Suica.Point.prototype=Object.create(Suica.Object.prototype);function point(center)
{return new Suica.Point(center);}
﻿
Suica.SolidCubeMesh=function(ctx)
{var gl=ctx.gl;var nX=[+1,0,0],nY=[0,+1,0],nZ=[0,0,+1];var nx=[-1,0,0],ny=[0,-1,0],nz=[0,0,-1];var t0=[0,0],t1=[1,0],t2=[1,1],t3=[0,1];var v0=[+0.5,-0.5,-0.5],v4=[+0.5,-0.5,+0.5],v1=[+0.5,+0.5,-0.5],v5=[+0.5,+0.5,+0.5],v2=[-0.5,+0.5,-0.5],v6=[-0.5,+0.5,+0.5],v3=[-0.5,-0.5,-0.5],v7=[-0.5,-0.5,+0.5];var mesh=new Float32Array([].concat(v0,t0,nX,v1,t1,nX,v4,t3,nX,v4,t3,nX,v1,t1,nX,v5,t2,nX,v3,t1,nx,v7,t2,nx,v2,t0,nx,v2,t0,nx,v7,t2,nx,v6,t3,nx,v5,t3,nY,v1,t0,nY,v6,t2,nY,v6,t2,nY,v1,t0,nY,v2,t1,nY,v7,t3,ny,v3,t0,ny,v4,t2,ny,v4,t2,ny,v3,t0,ny,v0,t1,ny,v4,t2,nZ,v5,t3,nZ,v7,t1,nZ,v7,t1,nZ,v5,t3,nZ,v6,t0,nZ,v0,t3,nz,v3,t0,nz,v1,t2,nz,v1,t2,nz,v3,t0,nz,v2,t1,nz,[]));this.ctx=ctx;this.length=mesh.length;this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);}
Suica.SolidCubeMesh.prototype.drawMesh=function(obj)
{var gl=this.ctx.gl;gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.enableVertexAttribArray(this.ctx.aXYZ);gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,8*Suica.FLOATS,0*Suica.FLOATS);if(Suica.normalRender)
{var hasTexture=(obj.image&&Suica.texturesReady());gl.uniform1i(this.ctx.uLight,obj.light);gl.uniform1i(this.ctx.uTexture,obj.image!=null);gl.enableVertexAttribArray(this.ctx.aNormal);gl.vertexAttribPointer(this.ctx.aNormal,3,gl.FLOAT,false,8*Suica.FLOATS,5*Suica.FLOATS);if(hasTexture)
{gl.enableVertexAttribArray(this.ctx.aTexCoord);gl.vertexAttribPointer(this.ctx.aTexCoord,2,gl.FLOAT,false,8*Suica.FLOATS,3*Suica.FLOATS);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,obj.image.texture);gl.uniform1i(this.ctx.uTexture,true);gl.uniform2fv(this.ctx.uTexScale,obj.image.scale);gl.uniform2fv(this.ctx.uTexOffset,obj.image.offset);}}
gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(1,0);gl.drawArrays(gl.TRIANGLES,0,this.length/8-(obj.hollow?12:0));gl.disable(gl.POLYGON_OFFSET_FILL);if(Suica.normalRender)
{if(hasTexture)
{gl.bindTexture(gl.TEXTURE_2D,null);gl.uniform1i(this.ctx.uTexture,false);gl.disableVertexAttribArray(this.ctx.aTexCoord);}}}
Suica.WireframeCubeMesh=function(ctx)
{var gl=ctx.gl;var v0=[+0.5,-0.5,-0.5],v4=[+0.5,-0.5,+0.5],v1=[+0.5,+0.5,-0.5],v5=[+0.5,+0.5,+0.5],v2=[-0.5,+0.5,-0.5],v6=[-0.5,+0.5,+0.5],v3=[-0.5,-0.5,-0.5],v7=[-0.5,-0.5,+0.5];var mesh=new Float32Array([].concat(v0,v4,v1,v5,v2,v6,v3,v7));this.ctx=ctx;this.length=mesh.length;this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);}
Suica.WireframeCubeMesh.prototype.drawMesh=function(obj)
{var gl=this.ctx.gl;gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.enableVertexAttribArray(this.ctx.aXYZ);if(Suica.normalRender)
{gl.disableVertexAttribArray(this.ctx.aNormal);gl.uniform1i(this.ctx.uLight,false);}
if(obj.mode==Suica.POINT)
{gl.uniform1f(this.ctx.uPointSize,obj.pointSize);gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);gl.drawArrays(gl.POINTS,0,8);}
else
{gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);gl.drawArrays(gl.LINES,0,8);gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,6*Suica.FLOATS,0*Suica.FLOATS);gl.drawArrays(gl.LINE_LOOP,0,4);gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,6*Suica.FLOATS,3*Suica.FLOATS);gl.drawArrays(gl.LINE_LOOP,0,4);}}
Suica.Cube=function(center,size)
{Suica.Object.apply(this,arguments);this.color=[0,0.5,1];this.center=center;this.size=size;if(!this.ctx.wireframeCubeMesh)
this.ctx.wireframeCubeMesh=new Suica.WireframeCubeMesh(this.ctx);if(!this.ctx.solidCubeMesh)
this.ctx.solidCubeMesh=new Suica.SolidCubeMesh(this.ctx);this.drawPoint=this.ctx.wireframeCubeMesh;this.drawLine=this.ctx.wireframeCubeMesh;this.drawSolid=this.ctx.solidCubeMesh;}
Suica.Cube.prototype=Object.create(Suica.Object.prototype);Suica.Cube.prototype.getSizes=function()
{return[this.size,this.size,this.size];}
Suica.Cuboid=function(center,sizes)
{Suica.Cube.apply(this,arguments);this.sizes=sizes;}
Suica.Cuboid.prototype=Object.create(Suica.Cube.prototype);Suica.Cuboid.prototype.getSizes=function()
{return this.sizes;}
function cube(center,size)
{return new Suica.Cube(center,size);}
function cuboid(center,sizes)
{return new Suica.Cuboid(center,sizes);}
﻿
Suica.PRECISION_CIRCLE=Suica.PRECISION;Suica.SolidPolygonMesh=function(ctx,count)
{var gl=ctx.gl;var data=[0,0,0];var a=0;var da=2*Math.PI/count;for(var i=0;i<count+1;i++)
{data.push(0.5*Math.cos(a),0.5*Math.sin(a),0);a+=da;}
var mesh=new Float32Array(data);this.ctx=ctx;this.length=mesh.length;this.buffer=gl.createBuffer();this.count=count;gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);}
Suica.SolidPolygonMesh.prototype.drawMesh=function(obj)
{var gl=this.ctx.gl;var hasTexture=(obj.image&&Suica.texturesReady());gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.enableVertexAttribArray(this.ctx.aXYZ);gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);if(Suica.normalRender)
{gl.uniform1i(this.ctx.uLight,obj.light);gl.uniform1i(this.ctx.uTexture,obj.image!=null);gl.disableVertexAttribArray(this.ctx.aNormal);gl.vertexAttrib3f(this.ctx.aNormal,0,0,1);if(hasTexture)
{gl.enableVertexAttribArray(this.ctx.aTexCoord);gl.vertexAttribPointer(this.ctx.aTexCoord,2,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,obj.image.texture);gl.uniform1i(this.ctx.uTexture,true);gl.uniform2fv(this.ctx.uTexScale,obj.image.scale);gl.uniform2fv(this.ctx.uTexOffset,obj.image.offset);}}
gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(1,0);gl.drawArrays(gl.TRIANGLE_FAN,0,this.count+2);gl.disable(gl.POLYGON_OFFSET_FILL);if(Suica.normalRender)
{if(hasTexture)
{gl.bindTexture(gl.TEXTURE_2D,null);gl.uniform1i(this.ctx.uTexture,false);gl.disableVertexAttribArray(this.ctx.aTexCoord);}}}
Suica.WireframePolygonMesh=function(ctx,count)
{var gl=ctx.gl;var data=[];var a=0;var da=2*Math.PI/count;for(var i=0;i<count;i++)
{data.push(0.5*Math.cos(a),0.5*Math.sin(a),0);a+=da;}
var mesh=new Float32Array(data);this.ctx=ctx;this.length=mesh.length;this.buffer=gl.createBuffer();this.count=count;gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);}
Suica.WireframePolygonMesh.prototype.drawMesh=function(obj)
{var gl=this.ctx.gl;gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.enableVertexAttribArray(this.ctx.aXYZ);if(Suica.normalRender)
{gl.disableVertexAttribArray(this.ctx.aNormal);gl.uniform1i(this.ctx.uLight,false);}
if(obj.mode==Suica.POINT)
{gl.uniform1f(this.ctx.uPointSize,obj.pointSize);gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);gl.drawArrays(gl.POINTS,0,this.count);}
else
{gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);gl.drawArrays(gl.LINE_LOOP,0,this.count);}}
Suica.Polygon=function(center,radius,count)
{Suica.Object.apply(this,arguments);this.color=[0,0.5,1];this.center=center;if(radius)this.radius=radius;this.count=count?count:Suica.PRECISION_CIRCLE;this.hollow=true;if(!this.ctx.wireframePolygonMesh)
this.ctx.wireframePolygonMesh=[];if(!this.ctx.wireframePolygonMesh[count])
this.ctx.wireframePolygonMesh[count]=new Suica.WireframePolygonMesh(this.ctx,count);if(!this.ctx.solidPolygonMesh)
this.ctx.solidPolygonMesh=[];if(!this.ctx.solidPolygonMesh[count])
this.ctx.solidPolygonMesh[count]=new Suica.SolidPolygonMesh(this.ctx,count);this.drawPoint=this.ctx.wireframePolygonMesh[count];this.drawLine=this.ctx.wireframePolygonMesh[count];this.drawSolid=this.ctx.solidPolygonMesh[count];}
Suica.Polygon.prototype=Object.create(Suica.Object.prototype);Suica.Polygon.prototype.getSizes=function()
{return[this.radius,this.radius,1];}
Suica.Circle=function(center,radius)
{Suica.Polygon.call(this,center,radius,Suica.PRECISION_CIRCLE);}
Suica.Circle.prototype=Object.create(Suica.Polygon.prototype);Suica.Circle.prototype.getSizes=function()
{return[this.radius,this.radius,1];}
Suica.Ellipse=function(center,radii)
{Suica.Polygon.call(this,center,undefined,Suica.PRECISION_CIRCLE);this.radii=radii;}
Suica.Ellipse.prototype=Object.create(Suica.Polygon.prototype);Suica.Ellipse.prototype.getSizes=function()
{return[this.radii[0],this.radii[1],1];}
function polygon(center,radius,count)
{return new Suica.Polygon(center,radius,count);}
function circle(center,radius)
{return new Suica.Circle(center,radius);}
function ellipse(center,radii)
{return new Suica.Ellipse(center,radii);}
﻿
Suica.PRECISION_CONE=8*Math.floor(Suica.PRECISION/8);Suica.PRECISION_CONE_WF=Suica.PRECISION_CONE/8;Suica.SolidPyramidMesh=function(ctx,count)
{var gl=ctx.gl;var data=[];var a=0;var da=2*Math.PI/count;var t=0;var dt=1/count;for(var i=0;i<count;i++)
{var c1=Math.cos(a);var s1=Math.sin(a);var c2=Math.cos(a+da/2);var s2=Math.sin(a+da/2);var c3=Math.cos(a+da);var s3=Math.sin(a+da);data.push(0,0,1,t+dt/2,1,c2,s2,1);data.push(0.5*c1,0.5*s1,0,t,0);if(count==Suica.PRECISION_CONE)data.push(c1,s1,0);else data.push(c2,s2,0);data.push(0.5*c3,0.5*s3,0,t+dt,0);if(count==Suica.PRECISION_CONE)data.push(c3,s3,0);else data.push(c2,s2,0);a+=da;t+=dt;}
a=0;t=0;for(var i=0;i<count;i++)
{var c1=Math.cos(a);var s1=Math.sin(a);var c3=Math.cos(a+da);var s3=Math.sin(a+da);data.push(0.5*c3,0.5*s3,0,t+dt,0,0,0,-1);data.push(0.5*c1,0.5*s1,0,t,0,0,0,-1);data.push(0,0,0,t+dt/2,1,0,0,-1);a+=da;t+=dt;}
var mesh=new Float32Array(data);this.ctx=ctx;this.length=mesh.length;this.buffer=gl.createBuffer();this.count=count;gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);}
Suica.SolidPyramidMesh.prototype.drawMesh=function(obj)
{var gl=this.ctx.gl;var hasTexture=(obj.image&&Suica.texturesReady());gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.enableVertexAttribArray(this.ctx.aXYZ);gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,8*Suica.FLOATS,0*Suica.FLOATS);if(Suica.normalRender)
{gl.uniform1i(this.ctx.uLight,obj.light);gl.uniform1i(this.ctx.uTexture,obj.image!=null);gl.enableVertexAttribArray(this.ctx.aNormal);gl.vertexAttribPointer(this.ctx.aNormal,3,gl.FLOAT,false,8*Suica.FLOATS,5*Suica.FLOATS);if(hasTexture)
{gl.enableVertexAttribArray(this.ctx.aTexCoord);gl.vertexAttribPointer(this.ctx.aTexCoord,2,gl.FLOAT,false,8*Suica.FLOATS,3*Suica.FLOATS);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,obj.image.texture);gl.uniform1i(this.ctx.uTexture,true);gl.uniform2fv(this.ctx.uTexScale,obj.image.scale);gl.uniform2fv(this.ctx.uTexOffset,obj.image.offset);}}
gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(1,0);gl.drawArrays(gl.TRIANGLES,0,this.count*3);if(!obj.hollow)
{if(hasTexture&&obj.image.baseScale&&Suica.normalRender)
{gl.uniform2fv(this.ctx.uTexScale,obj.image.baseScale);}
gl.drawArrays(gl.TRIANGLES,this.count*3,this.count*3);}
gl.disable(gl.POLYGON_OFFSET_FILL);if(Suica.normalRender)
{if(hasTexture)
{gl.bindTexture(gl.TEXTURE_2D,null);gl.uniform1i(this.ctx.uTexture,false);gl.disableVertexAttribArray(this.ctx.aTexCoord);}}}
Suica.WireframePyramidMesh=function(ctx,count)
{var gl=ctx.gl;var data=[];var a=0;var da=2*Math.PI/count;data.push(0,0,1);for(var i=0;i<count;i++)
{data.push(0.5*Math.cos(a),0.5*Math.sin(a),0);a+=da;}
this.edgeCount=(count==Suica.PRECISION_CONE)?Suica.PRECISION_CONE_WF:count;var a=0;for(var i=0;i<this.edgeCount;i++)
{var c=Math.cos(a);var s=Math.sin(a);data.push(0.5*c,0.5*s,0);data.push(0,0,1);a+=da*count/this.edgeCount;}
var mesh=new Float32Array(data);this.ctx=ctx;this.length=mesh.length;this.buffer=gl.createBuffer();this.count=count;gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);}
Suica.WireframePyramidMesh.prototype.drawMesh=function(obj)
{var gl=this.ctx.gl;gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.enableVertexAttribArray(this.ctx.aXYZ);if(Suica.normalRender)
{gl.uniform1i(this.ctx.uLight,false);gl.disableVertexAttribArray(this.ctx.aNormal);}
if(obj.mode==Suica.POINT)
{gl.uniform1f(this.ctx.uPointSize,obj.pointSize);gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);gl.drawArrays(gl.POINTS,0,this.count+1);}
else
{gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);gl.drawArrays(gl.LINE_LOOP,1,this.count);gl.drawArrays(gl.LINES,this.count+1,this.edgeCount*2);}}
Suica.Pyramid=function(center,radius,height,count)
{Suica.Object.apply(this,arguments);this.color=[1,0,0.5];this.center=center;if(radius)this.radius=radius;this.height=height;this.count=count?count:Suica.PRECISION_CONE;if(!this.ctx.wireframePyramidMesh)
this.ctx.wireframePyramidMesh=[];if(!this.ctx.wireframePyramidMesh[count])
this.ctx.wireframePyramidMesh[count]=new Suica.WireframePyramidMesh(this.ctx,count);if(!this.ctx.solidPyramidMesh)
this.ctx.solidPyramidMesh=[];if(!this.ctx.solidPyramidMesh[count])
this.ctx.solidPyramidMesh[count]=new Suica.SolidPyramidMesh(this.ctx,count);this.drawPoint=this.ctx.wireframePyramidMesh[count];this.drawLine=this.ctx.wireframePyramidMesh[count];this.drawSolid=this.ctx.solidPyramidMesh[count];}
Suica.Pyramid.prototype=Object.create(Suica.Object.prototype);Suica.Pyramid.prototype.getSizes=function()
{return[this.radius,this.radius,this.height];}
Suica.Cone=function(center,radius,height)
{Suica.Pyramid.call(this,center,radius,height,Suica.PRECISION_CONE);}
Suica.Cone.prototype=Object.create(Suica.Pyramid.prototype);Suica.Cone.prototype.getSizes=function()
{return[this.radius,this.radius,this.height];}
Suica.Conoid=function(center,radii,height)
{Suica.Pyramid.call(this,center,undefined,height,Suica.PRECISION_CONE);this.radii=radii;}
Suica.Conoid.prototype=Object.create(Suica.Pyramid.prototype);Suica.Conoid.prototype.getSizes=function()
{return[this.radii[0],this.radii[1],this.height];}
function pyramid(center,radius,height,count)
{return new Suica.Pyramid(center,radius,height,count);}
function cone(center,radius,height)
{return new Suica.Cone(center,radius,height);}
function conoid(center,radii,height)
{return new Suica.Conoid(center,radii,height);}
﻿
Suica.PRECISION_CYLINDER=8*Math.floor(Suica.PRECISION/8);Suica.PRECISION_CYLINDER_WF=Suica.PRECISION_CYLINDER/8;Suica.SolidPrismMesh=function(ctx,count)
{var gl=ctx.gl;var data=[];var a=0;var da=2*Math.PI/count;var t=0;var dt=1/count;for(var i=0;i<count;i++)
{var c1=Math.cos(a);var s1=Math.sin(a);var c2=Math.cos(a+da/2);var s2=Math.sin(a+da/2);var c3=Math.cos(a+da);var s3=Math.sin(a+da);var nc1,nc3,ns1,ns3;if(count==Suica.PRECISION_CYLINDER)
{nc1=c1;nc3=c3;ns1=s1;ns3=s3;}
else
{nc1=c2;nc3=c2;ns1=s2;ns3=s2;}
data.push(0.5*c1,0.5*s1,1,t,1,nc1,ns1,0);data.push(0.5*c1,0.5*s1,0,t,0,nc1,ns1,0);data.push(0.5*c3,0.5*s3,0,t+dt,0,nc3,ns3,0);data.push(0.5*c1,0.5*s1,1,t,1,nc1,ns1,0);data.push(0.5*c3,0.5*s3,0,t+dt,0,nc3,ns3,0);data.push(0.5*c3,0.5*s3,1,t+dt,1,nc3,ns3,0);a+=da;t+=dt;}
a=0;t=0;for(var i=0;i<count;i++)
{var c1=Math.cos(a);var s1=Math.sin(a);var c3=Math.cos(a+da);var s3=Math.sin(a+da);data.push(0.5*c1,0.5*s1,1,t,0,0,0,1);data.push(0.5*c3,0.5*s3,1,t+dt,0,0,0,1);data.push(0,0,1,t+dt/2,1,0,0,1);a+=da;t+=dt;}
a=0;t=0;for(var i=0;i<count;i++)
{var c1=Math.cos(a);var s1=Math.sin(a);var c3=Math.cos(a+da);var s3=Math.sin(a+da);data.push(0.5*c3,0.5*s3,0,t+dt,0,0,0,-1);data.push(0.5*c1,0.5*s1,0,t,0,0,0,-1);data.push(0,0,0,t+dt/2,1,0,0,-1);a+=da;t+=dt;}
var mesh=new Float32Array(data);this.ctx=ctx;this.length=mesh.length;this.buffer=gl.createBuffer();this.count=count;gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);}
Suica.SolidPrismMesh.prototype.drawMesh=function(obj,count)
{var gl=this.ctx.gl;var hasTexture=(obj.image&&Suica.texturesReady());gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.enableVertexAttribArray(this.ctx.aXYZ);gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,8*Suica.FLOATS,0*Suica.FLOATS);if(Suica.normalRender)
{gl.uniform1i(this.ctx.uLight,obj.light);gl.uniform1i(this.ctx.uTexture,obj.image!=null);gl.enableVertexAttribArray(this.ctx.aNormal);gl.vertexAttribPointer(this.ctx.aNormal,3,gl.FLOAT,false,8*Suica.FLOATS,5*Suica.FLOATS);if(hasTexture)
{gl.enableVertexAttribArray(this.ctx.aTexCoord);gl.vertexAttribPointer(this.ctx.aTexCoord,2,gl.FLOAT,false,8*Suica.FLOATS,3*Suica.FLOATS);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,obj.image.texture);gl.uniform1i(this.ctx.uTexture,true);gl.uniform2fv(this.ctx.uTexScale,obj.image.scale);gl.uniform2fv(this.ctx.uTexOffset,obj.image.offset);}}
gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(1,0);gl.drawArrays(gl.TRIANGLES,0,2*3*this.count);if(!obj.hollow)
{if(hasTexture&&obj.image.baseScale)
{gl.uniform2fv(this.ctx.uTexScale,obj.image.baseScale);}
gl.drawArrays(gl.TRIANGLES,2*3*this.count,3*this.count);gl.drawArrays(gl.TRIANGLES,3*3*this.count,3*this.count);}
gl.disable(gl.POLYGON_OFFSET_FILL);if(Suica.normalRender)
{if(hasTexture)
{gl.bindTexture(gl.TEXTURE_2D,null);gl.uniform1i(this.ctx.uTexture,false);gl.disableVertexAttribArray(this.ctx.aTexCoord);}}}
Suica.WireframePrismMesh=function(ctx,count)
{var gl=ctx.gl;var data=[];var a=0;var da=2*Math.PI/count;for(var i=0;i<count;i++)
{data.push(0.5*Math.cos(a),0.5*Math.sin(a),0);a+=da;}
for(var i=0;i<count;i++)
{data.push(0.5*Math.cos(a),0.5*Math.sin(a),1);a+=da;}
this.edgeCount=(count==Suica.PRECISION_CYLINDER)?Suica.PRECISION_CYLINDER_WF:count;for(var i=0;i<this.edgeCount;i++)
{var c=Math.cos(a);var s=Math.sin(a);data.push(0.5*c,0.5*s,0);data.push(0.5*c,0.5*s,1);a+=da*count/this.edgeCount;}
var mesh=new Float32Array(data);this.ctx=ctx;this.length=mesh.length;this.buffer=gl.createBuffer();this.count=count;gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);}
Suica.WireframePrismMesh.prototype.drawMesh=function(obj)
{var gl=this.ctx.gl;gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.enableVertexAttribArray(this.ctx.aXYZ);if(Suica.normalRender)
{gl.disableVertexAttribArray(this.ctx.aNormal);gl.uniform1i(this.ctx.uLight,false);}
if(obj.mode==Suica.POINT)
{gl.uniform1f(this.ctx.uPointSize,obj.pointSize);gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);gl.drawArrays(gl.POINTS,0,2*this.count);}
else
{gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);gl.drawArrays(gl.LINE_LOOP,0,this.count);gl.drawArrays(gl.LINE_LOOP,this.count,this.count);gl.drawArrays(gl.LINES,2*this.count,this.edgeCount*2);}}
Suica.Prism=function(center,radius,height,count)
{Suica.Object.apply(this,arguments);this.color=[1,0,0.5];this.center=center;if(radius)this.radius=radius;this.height=height;this.count=count?count:Suica.PRECISION_CYLINDER;if(!this.ctx.wireframePrismMesh)
this.ctx.wireframePrismMesh=[];if(!this.ctx.wireframePrismMesh[count])
this.ctx.wireframePrismMesh[count]=new Suica.WireframePrismMesh(this.ctx,count);if(!this.ctx.solidPrismMesh)
this.ctx.solidPrismMesh=[];if(!this.ctx.solidPrismMesh[count])
this.ctx.solidPrismMesh[count]=new Suica.SolidPrismMesh(this.ctx,count);this.drawPoint=this.ctx.wireframePrismMesh[count];this.drawLine=this.ctx.wireframePrismMesh[count];this.drawSolid=this.ctx.solidPrismMesh[count];}
Suica.Prism.prototype=Object.create(Suica.Object.prototype);Suica.Prism.prototype.getSizes=function()
{return[this.radius,this.radius,this.height];}
Suica.Cylinder=function(center,radius,height)
{Suica.Prism.call(this,center,radius,height,Suica.PRECISION_CYLINDER);}
Suica.Cylinder.prototype=Object.create(Suica.Object.prototype);Suica.Cylinder.prototype.getSizes=function()
{return[this.radius,this.radius,this.height];}
Suica.Cylindroid=function(center,radii,height)
{Suica.Cylinder.call(this,center,undefined,height,Suica.PRECISION_CYLINDER);this.radii=radii;}
Suica.Cylindroid.prototype=Object.create(Suica.Prism.prototype);Suica.Cylindroid.prototype.getSizes=function()
{return[this.radii[0],this.radii[1],this.height];}
function prism(center,radius,height,count)
{return new Suica.Prism(center,radius,height,count);}
function cylinder(center,radius,height)
{return new Suica.Cylinder(center,radius,height);}
function cylindroid(center,radii,height)
{return new Suica.Cylindroid(center,radii,height);}
﻿
Suica.WireframeSegmentMesh=function(ctx)
{var gl=ctx.gl;this.ctx=ctx;this.mesh=new Float32Array([0,0,0,0,0,0]);this.length=this.mesh.length;this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,this.mesh,gl.DYNAMIC_DRAW);}
Suica.WireframeSegmentMesh.prototype.drawMesh=function(obj)
{var gl=this.ctx.gl;if(Suica.normalRender)
{gl.uniform1i(this.ctx.uLight,false);gl.uniform1i(this.ctx.uTexture,false);gl.disableVertexAttribArray(this.ctx.aTexCoord);gl.disableVertexAttribArray(this.ctx.aNormal);}
gl.uniform1f(this.ctx.uPointSize,obj.pointSize);this.mesh[0]=obj.from[0];this.mesh[1]=obj.from[1];this.mesh[2]=obj.from[2];this.mesh[3]=obj.to[0];this.mesh[4]=obj.to[1];this.mesh[5]=obj.to[2];gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferSubData(gl.ARRAY_BUFFER,0,this.mesh);gl.enableVertexAttribArray(this.ctx.aXYZ);gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);if(obj.mode==Suica.POINT)
{gl.uniform1f(this.ctx.uPointSize,obj.pointSize);gl.drawArrays(gl.POINTS,0,2);}
else
{gl.drawArrays(gl.LINES,0,2);}}
Suica.Segment=function(from,to)
{Suica.Object.apply(this,arguments);this.color=[0,0.5,0];this.from=from;this.to=to;this.mode=Suica.LINE;if(!this.ctx.segmentMesh)
this.ctx.segmentMesh=new Suica.WireframeSegmentMesh(this.ctx);this.drawPoint=this.ctx.segmentMesh;this.drawLine=this.ctx.segmentMesh;this.drawSolid=this.ctx.segmentMesh;}
Suica.Segment.prototype=Object.create(Suica.Object.prototype);function segment(from,to)
{return new Suica.Segment(from,to);}
﻿
Suica.WireframeLineMesh=function(ctx,kFrom,kTo)
{var gl=ctx.gl;this.kFrom=kFrom;this.kTo=kTo;this.ctx=ctx;this.mesh=new Float32Array([0,0,0,0,0,0]);this.length=this.mesh.length;this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,this.mesh,gl.DYNAMIC_DRAW);}
Suica.WireframeLineMesh.prototype.drawMesh=function(obj)
{var gl=this.ctx.gl;if(Suica.normalRender)
{gl.uniform1i(this.ctx.uLight,false);gl.uniform1i(this.ctx.uTexture,false);gl.disableVertexAttribArray(this.ctx.aTexCoord);gl.disableVertexAttribArray(this.ctx.aNormal);}
gl.uniform1f(this.ctx.uPointSize,obj.pointSize);var v=unitVector(vectorPoints(obj.to,obj.from));this.mesh[0]=obj.from[0]-this.kFrom*v[0];this.mesh[1]=obj.from[1]-this.kFrom*v[1];this.mesh[2]=obj.from[2]-this.kFrom*v[2];this.mesh[3]=obj.to[0]+this.kTo*v[0];this.mesh[4]=obj.to[1]+this.kTo*v[1];this.mesh[5]=obj.to[2]+this.kTo*v[2];gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferSubData(gl.ARRAY_BUFFER,0,this.mesh);gl.enableVertexAttribArray(this.ctx.aXYZ);gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);if(obj.mode==Suica.POINT)
{gl.uniform1f(this.ctx.uPointSize,obj.pointSize);gl.drawArrays(gl.POINTS,0,2);}
else
{gl.drawArrays(gl.LINES,0,2);}}
Suica.Line=function(from,to)
{Suica.Object.apply(this,arguments);this.color=[0,0.5,0];this.from=from;this.to=to;this.mode=Suica.LINE;if(!this.ctx.lineMesh)
this.ctx.lineMesh=new Suica.WireframeLineMesh(this.ctx,1E6,1E6);this.drawPoint=this.ctx.lineMesh;this.drawLine=this.ctx.lineMesh;this.drawSolid=this.ctx.lineMesh;}
Suica.Line.prototype=Object.create(Suica.Object.prototype);function line(from,to)
{return new Suica.Line(from,to);}
Suica.Ray=function(from,to)
{Suica.Object.apply(this,arguments);this.color=[0,0.5,0];this.from=from;this.to=to;this.mode=Suica.LINE;if(!this.ctx.rayMesh)
this.ctx.rayMesh=new Suica.WireframeLineMesh(this.ctx,0,1E6);this.drawPoint=this.ctx.rayMesh;this.drawLine=this.ctx.rayMesh;this.drawSolid=this.ctx.rayMesh;}
Suica.Ray.prototype=Object.create(Suica.Object.prototype);function ray(from,to)
{return new Suica.Ray(from,to);}
Suica.Segment=function(from,to)
{Suica.Object.apply(this,arguments);this.color=[0,0.5,0];this.from=from;this.to=to;this.mode=Suica.LINE;if(!this.ctx.segmentMesh)
this.ctx.segmentMesh=new Suica.WireframeLineMesh(this.ctx,0,0);this.drawPoint=this.ctx.segmentMesh;this.drawLine=this.ctx.segmentMesh;this.drawSolid=this.ctx.segmentMesh;}
Suica.Segment.prototype=Object.create(Suica.Object.prototype);function segment(from,to)
{return new Suica.Segment(from,to);}
﻿
Suica.PRECISION_SPHERE_U=4*Math.floor(Suica.PRECISION/4);Suica.PRECISION_SPHERE_V=Suica.PRECISION_SPHERE_U/2;Suica.PRECISION_SPHERE_WF_U=Suica.PRECISION_SPHERE_U/4;Suica.PRECISION_SPHERE_WF_V=Suica.PRECISION_SPHERE_WF_U/2;Suica.SolidSphereMesh=function(ctx)
{var gl=ctx.gl;var data=[];var b=-Math.PI/2;var db=Math.PI/Suica.PRECISION_SPHERE_V;var tv=0;var dtv=1/Suica.PRECISION_SPHERE_V;for(var j=0;j<Suica.PRECISION_SPHERE_V;j++)
{var a=0;var da=2*Math.PI/Suica.PRECISION_SPHERE_U;var tu=0;var dtu=1/Suica.PRECISION_SPHERE_U;for(var i=0;i<Suica.PRECISION_SPHERE_U+1;i++)
{var x=0.5*Math.cos(a)*Math.cos(b+db);var y=0.5*Math.sin(a)*Math.cos(b+db);var z=0.5*Math.sin(b+db);data.push(x,y,z,tu,tv+dtv,x,y,z);x=0.5*Math.cos(a)*Math.cos(b);y=0.5*Math.sin(a)*Math.cos(b);z=0.5*Math.sin(b);data.push(x,y,z,tu,tv+dtv,x,y,z);a+=da;tu+=dtu;}
b+=db;tv+=dtv;}
var mesh=new Float32Array(data);this.ctx=ctx;this.length=mesh.length;this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);}
Suica.SolidSphereMesh.prototype.drawMesh=function(obj)
{var gl=this.ctx.gl;var hasTexture=(obj.image&&Suica.texturesReady());gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.enableVertexAttribArray(this.ctx.aXYZ);gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,8*Suica.FLOATS,0*Suica.FLOATS);if(Suica.normalRender)
{gl.uniform1i(this.ctx.uLight,obj.light);gl.uniform1i(this.ctx.uTexture,obj.image!=null);gl.enableVertexAttribArray(this.ctx.aNormal);gl.vertexAttribPointer(this.ctx.aNormal,3,gl.FLOAT,false,8*Suica.FLOATS,5*Suica.FLOATS);if(hasTexture)
{gl.enableVertexAttribArray(this.ctx.aTexCoord);gl.vertexAttribPointer(this.ctx.aTexCoord,2,gl.FLOAT,false,8*Suica.FLOATS,3*Suica.FLOATS);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,obj.image.texture);gl.uniform1i(this.ctx.uTexture,true);gl.uniform2fv(this.ctx.uTexScale,obj.image.scale);gl.uniform2fv(this.ctx.uTexOffset,obj.image.offset);}}
gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(1,0);if(obj.radii&&Suica.normalRender)
{this.ctx.transposeInverse();gl.uniformMatrix3fv(this.ctx.uNormalMatrix,false,this.ctx.normalMatrix);gl.uniform1i(this.ctx.uUseNormal,true);}
for(var j=0;j<Suica.PRECISION_SPHERE_V;j++)
{gl.drawArrays(gl.TRIANGLE_STRIP,(2*Suica.PRECISION_SPHERE_U+2)*j,2*Suica.PRECISION_SPHERE_U+2);}
gl.disable(gl.POLYGON_OFFSET_FILL);if(Suica.normalRender)
{gl.uniform1i(this.ctx.uUseNormal,false);if(hasTexture)
{gl.bindTexture(gl.TEXTURE_2D,null);gl.uniform1i(this.ctx.uTexture,false);gl.disableVertexAttribArray(this.ctx.aTexCoord);}}}
Suica.WireframeSphereMesh=function(ctx)
{var gl=ctx.gl;var data=[];var db=Math.PI/(Suica.PRECISION_SPHERE_WF_V+1);var b=-Math.PI/2+db;for(var j=0;j<Suica.PRECISION_SPHERE_WF_V;j++)
{var a=0;var da=2*Math.PI/Suica.PRECISION_SPHERE_U;for(var i=0;i<Suica.PRECISION_SPHERE_U+1;i++)
{var x=0.5*Math.cos(a)*Math.cos(b);var y=0.5*Math.sin(a)*Math.cos(b);var z=0.5*Math.sin(b);data.push(x,y,z);a+=da;}
b+=db;}
var a=0;var da=Math.PI/Suica.PRECISION_SPHERE_WF_V;for(var i=0;i<Suica.PRECISION_SPHERE_WF_V;i++)
{var db=2*Math.PI/Suica.PRECISION_SPHERE_U;var b=0;for(var j=0;j<=Suica.PRECISION_SPHERE_U;j++)
{var x=0.5*Math.cos(a)*Math.cos(b);var y=0.5*Math.sin(a)*Math.cos(b);var z=0.5*Math.sin(b);data.push(x,y,z);b+=db;}
a+=da;}
var mesh=new Float32Array(data);this.ctx=ctx;this.length=mesh.length;this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);}
Suica.WireframeSphereMesh.prototype.drawMesh=function(obj)
{var gl=this.ctx.gl;gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.enableVertexAttribArray(this.ctx.aXYZ);if(Suica.normalRender)
{gl.disableVertexAttribArray(this.ctx.aNormal);gl.uniform1i(this.ctx.uLight,false);}
if(obj.mode==Suica.POINT)
{gl.uniform1f(this.ctx.uPointSize,obj.pointSize);gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);gl.drawArrays(gl.POINTS,0,Suica.PRECISION_SPHERE_U);}
else
{gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);for(var i=0;i<Suica.PRECISION_SPHERE_WF_V;i++)
gl.drawArrays(gl.LINE_LOOP,(Suica.PRECISION_SPHERE_U+1)*i,Suica.PRECISION_SPHERE_U+1);var n=(Suica.PRECISION_SPHERE_U+1)*Suica.PRECISION_SPHERE_WF_V;for(var i=0;i<Suica.PRECISION_SPHERE_WF_V;i++)
gl.drawArrays(gl.LINE_LOOP,n+(Suica.PRECISION_SPHERE_U+1)*i,Suica.PRECISION_SPHERE_U+1);}}
Suica.Sphere=function(center,radius)
{Suica.Object.apply(this,arguments);this.color=[1,0,0.5];this.center=center;if(radius)this.radius=radius;if(!this.ctx.wireframeSphereMesh)
this.ctx.wireframeSphereMesh=new Suica.WireframeSphereMesh(this.ctx);if(!this.ctx.solidSphereMesh)
this.ctx.solidSphereMesh=new Suica.SolidSphereMesh(this.ctx);this.drawPoint=this.ctx.wireframeSphereMesh;this.drawLine=this.ctx.wireframeSphereMesh;this.drawSolid=this.ctx.solidSphereMesh;}
Suica.Sphere.prototype=Object.create(Suica.Object.prototype);Suica.Sphere.prototype.getSizes=function()
{return[this.radius,this.radius,this.radius];}
Suica.Spheroid=function(center,radii)
{Suica.Sphere.call(this,center,undefined);this.radii=radii;}
Suica.Spheroid.prototype=Object.create(Suica.Sphere.prototype);Suica.Spheroid.prototype.getSizes=function()
{return[this.radii[0],this.radii[1],this.radii[2]];}
function sphere(center,radius)
{return new Suica.Sphere(center,radius);}
function spheroid(center,radii)
{return new Suica.Spheroid(center,radii);}
﻿
Suica.GroupMesh=function(ctx)
{this.ctx=ctx;}
Suica.GroupMesh.prototype.drawMesh=function(obj)
{for(var i in obj.elements)
{obj.elements[i].drawObject();}}
Suica.Group=function(elements)
{Suica.Object.apply(this,arguments);this.color=[0.5,0.5,0.5];this.center=[0,0,0];this.sizes=[1,1,1];this.elements=elements?elements:[];for(var i in elements)
{Suica.lastContext.objectList=Suica.lastContext.objectList.filter(function(e){return e!==elements[i]});}
this.drawGroup=new Suica.GroupMesh(this.ctx);this.drawPoint=this.drawGroup;this.drawLine=this.drawGroup;this.drawSolid=this.drawGroup;}
Suica.Group.prototype=Object.create(Suica.Object.prototype);Suica.Group.prototype.getSizes=function()
{return this.sizes;}
Suica.Group.prototype.add=function(element)
{this.elements.push(element);this.ctx.objectList=this.ctx.objectList.filter(function(e){return e!==element});}
Suica.Group.prototype.merge=function(element)
{for(var i in this.elements)
{this.elements[i].id=this.id;this.elements[i].idColor=this.idColor;this.elements[i].interactive=this.interactive;}}
Suica.Group.prototype.mergeColor=function(element)
{for(var i in this.elements)
{delete this.elements[i].color;}}
function group(elements)
{return new Suica.Group(elements);}