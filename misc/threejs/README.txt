Updating Three.js (current release r146):


1. Modify REBUILD.bat
	- set the THREE variable path
	- remove the EXIT command

2. Run REBUILD.bat

3. Modify AnaglyphEffect.js
	- Lines 8-9 are replaced by color identities:
	  this.colorMatrixLeft = new THREE.Matrix3().fromArray( [1,0,0,0,0,0,0,0,0] );
	  this.colorMatrixRight = new THREE.Matrix3().fromArray( [0,0,0,0,1,0,0,0,1] );

4. Modify VRButton.js
	- Converted from module to non-module - comment line 201

5. Run REBUILD.bat from root

6. Run RETEST.bat from root

