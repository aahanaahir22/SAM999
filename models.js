import * as THREE from './vendor/three.module.js';
// Original mesh models. Shared materials/geometries keep draw allocation bounded.
const mats={metal:new THREE.MeshStandardMaterial({color:0x394349,metalness:.82,roughness:.32}),dark:new THREE.MeshStandardMaterial({color:0x111a1e,metalness:.6,roughness:.48}),edge:new THREE.MeshStandardMaterial({color:0x82918e,metalness:.9,roughness:.25}),rubber:new THREE.MeshStandardMaterial({color:0x171d1b,roughness:.93}),cloth:new THREE.MeshStandardMaterial({color:0x4c5548,roughness:.96}),armor:new THREE.MeshStandardMaterial({color:0x29362e,roughness:.78}),skin:new THREE.MeshStandardMaterial({color:0x796f58,roughness:.84}),amber:new THREE.MeshStandardMaterial({color:0xc65c2d,emissive:0x6b1504,emissiveIntensity:.6}),glass:new THREE.MeshStandardMaterial({color:0x233e48,metalness:.7,roughness:.12}),title:new THREE.MeshStandardMaterial({color:0xb5bdb9,metalness:.92,roughness:.23})};
const cache=new Map();
function geo(key,build){if(!cache.has(key))cache.set(key,build());return cache.get(key)}
function mesh(g,geometry,mat,x=0,y=0,z=0){const m=new THREE.Mesh(geometry,typeof mat==='string'?mats[mat]:mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m}
function box(g,w,h,d,mat,x=0,y=0,z=0){return mesh(g,geo(`b${w},${h},${d}`,()=>new THREE.BoxGeometry(w,h,d)),mat,x,y,z)}
function cyl(g,r1,r2,h,mat,x=0,y=0,z=0,axis='z'){let m=mesh(g,geo(`c${r1},${r2},${h}`,()=>new THREE.CylinderGeometry(r1,r2,h,10)),mat,x,y,z);if(axis==='z')m.rotation.x=Math.PI/2;if(axis==='x')m.rotation.z=Math.PI/2;return m}
function poly(g,points,depth,mat,x=0,y=0,z=0){const key=JSON.stringify([points,depth]);const geom=geo(key,()=>{const s=new THREE.Shape();points.forEach((p,i)=>i?s.lineTo(...p):s.moveTo(...p));s.closePath();return new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.008,bevelThickness:.008,curveSegments:1})});return mesh(g,geom,mat,x,y,z)}
// Bake weapon parts into one buffer per material; retain semantic attachment nodes.
function batchWeapon(root){
 root.updateMatrixWorld(true);const batches=new Map();const parts=[];
 root.traverse(o=>{if(!o.isMesh)return;parts.push(o);const a=batches.get(o.material)||[];a.push(o);batches.set(o.material,a)});
 for(const [material,objects] of batches){const positions=[],normals=[],uvs=[];
  for(const o of objects){const g=(o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone());g.applyMatrix4(o.matrixWorld);positions.push(...g.attributes.position.array);normals.push(...g.attributes.normal.array);if(g.attributes.uv)uvs.push(...g.attributes.uv.array);g.dispose();}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));if(uvs.length)g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.computeBoundingSphere();const m=new THREE.Mesh(g,material);m.castShadow=true;m.receiveShadow=true;root.add(m);
 }for(const o of parts)o.removeFromParent();return root;
}
// Weapon longitudinal axis is -Z. The returned group origin is the receiver.
const weaponCache=new Map();
export function createWeapon(kind='rifle'){
 if(weaponCache.has(kind))return weaponCache.get(kind).clone(true);
 const root=new THREE.Group();root.name=`weapon-${kind}`;root.userData.kind=kind;
 const pistol=kind==='pistol',sniper=kind==='sniper',smg=kind==='smg',shotgun=kind==='shotgun';
 const length=pistol?.18:sniper?.65:shotgun?.55:smg?.3:.43;
 // Bevelled receiver profile, rotated from modeling XY to the weapon side.
 const receiver=poly(root,[[-.19,-.045],[-.18,.055],[-.13,.085],[.11,.085],[.16,.04],[.13,-.045]],.075,'metal');receiver.rotation.y=Math.PI/2;receiver.position.set(-.038,0,0);
 const barrelZ=-.19-length*.5;cyl(root,pistol?.017:.022,.026,length,'dark',0,.045,barrelZ);cyl(root,.029,.029,.055,'metal',0,.045,-.21-length);
 for(let i=0;i<3;i++)cyl(root,.031,.031,.009,'edge',0,.045,-.19-length+i*.017);
 // Handguard with upper and lower rails and side vents.
 if(!pistol){box(root,.095,.105,length*.57,'dark',0,.012,-.19-length*.25);for(let i=0;i<7;i++){box(root,.104,.012,.015,'edge',0,.072,-.18-i*.034);box(root,.008,.027,.017,'rubber',.051,.02,-.18-i*.034);box(root,.008,.027,.017,'rubber',-.051,.02,-.18-i*.034);}}
 const grip=box(root,.065,.18,.072,'rubber',0,-.115,.075);grip.rotation.x=-.27;for(let i=0;i<5;i++){const rib=box(root,.069,.008,.075,'dark',0,-.06-i*.024,.06+i*.005);rib.rotation.x=-.27;}
 // Open trigger guard and a small curved trigger.
 box(root,.012,.08,.014,'dark',.026,-.095,-.005);box(root,.012,.015,.08,'dark',.026,-.13,.026);box(root,.012,.057,.009,'edge',.015,-.077,.032).rotation.x=.25;
 if(!pistol){const mag=box(root,.062,smg?.23:.19,shotgun?.05:.083,'metal',0,-.126,-.055);mag.rotation.x=.13;for(let i=0;i<3;i++)box(root,.064,.009,.087,'dark',0,-.1-i*.035,-.05);cyl(root,.025,.025,.18,'metal',0,0,.25);const stock=poly(root,[[0,0],[.15,0],[.21,-.045],[.19,-.15],[.13,-.15],[.08,-.07],[0,-.07]],.07,'dark');stock.rotation.y=-Math.PI/2;stock.position.set(.035,.03,.27);box(root,.085,.17,.025,'rubber',0,-.045,.47);}
 for(let i=0;i<6;i++)box(root,.083,.013,.014,'edge',0,.102,-.09+i*.035);
 if(sniper){cyl(root,.041,.041,.27,'dark',0,.168,-.09);cyl(root,.048,.048,.045,'metal',0,.168,-.245);cyl(root,.043,.043,.009,'glass',0,.168,-.269);box(root,.04,.05,.05,'metal',0,.116,-.17);box(root,.04,.05,.05,'metal',0,.116,.015);cyl(root,.027,.027,.045,'metal',0,.213,-.07,'y');}
 else{box(root,.065,.015,.025,'dark',0,.145,.065);box(root,.009,.045,.025,'edge',-.028,.125,.065);box(root,.009,.045,.025,'edge',.028,.125,.065);box(root,.012,.045,.018,'metal',0,.1,-.15-length*.7);box(root,.008,.006,.006,'amber',0,.125,-.15-length*.7);}
 if(shotgun){cyl(root,.026,.026,length*.85,'metal',0,-.03,barrelZ+.03);for(let i=0;i<9;i++)cyl(root,.043,.043,.015,'rubber',0,-.004,-.23-i*.025);}
 if(pistol){box(root,.078,.065,.23,'metal',0,.068,-.04);for(let i=0;i<5;i++)box(root,.083,.035,.006,'dark',0,.07,.02+i*.012);}
 box(root,.004,.025,.07,'edge',.045,.035,.005);box(root,.006,.018,.022,'amber',.049,.025,.075);cyl(root,.009,.009,.008,'edge',.047,-.005,.06,'x');
 const muzzle=new THREE.Object3D();muzzle.name='muzzle';muzzle.position.set(0,.045,-.25-length);root.add(muzzle);batchWeapon(root);weaponCache.set(kind,root);return root.clone(true);
}
export function createSoldier(archetype='rifleman'){
 const g=new THREE.Group();g.name='soldier';g.userData.archetype=archetype;
 const torso=poly(g,[[-.2,0],[-.24,.34],[-.16,.49],[.16,.49],[.24,.34],[.2,0]],.23,'cloth',0,.85,-.115);torso.name='torso';
 const plate=poly(g,[[-.15,0],[-.18,.3],[-.12,.38],[.12,.38],[.18,.3],[.15,0]],.07,'armor',0,.94,-.18);plate.name='chest';
 box(g,.36,.06,.26,'dark',0,.87,0);for(let i=0;i<3;i++){box(g,.085,.12,.065,'cloth',-.1+i*.1,1.06,-.22);box(g,.075,.017,.071,'armor',-.1+i*.1,1.105,-.22);}
 box(g,.28,.38,.15,'armor',0,1.15,.19);box(g,.05,.18,.07,'dark',.2,1.35,.18);cyl(g,.006,.006,.3,'dark',.2,1.57,.18,'y');
 const head=mesh(g,geo('head',()=>new THREE.SphereGeometry(.135,10,8)),'skin',0,1.51,0);head.name='head';head.scale.set(.85,1.1,.9);head.userData.head=true;
 const helmet=mesh(g,geo('helmet',()=>new THREE.SphereGeometry(.15,12,6,0,Math.PI*2,0,Math.PI*.59)),'armor',0,1.57,0);helmet.name='helmet';helmet.userData.head=true;
 box(g,.195,.055,.08,'dark',0,1.53,-.11);box(g,.16,.035,.012,'glass',0,1.535,-.155);box(g,.14,.065,.045,'cloth',0,1.44,-.105);
 for(const side of [-1,1]){
  const leg=new THREE.Group();leg.name=side<0?'legL':'legR';leg.position.set(side*.105,.88,0);g.add(leg);
  cyl(leg,.092,.075,.38,'cloth',0,-.2,0,'y');cyl(leg,.075,.065,.34,'cloth',0,-.55,0,'y');box(leg,.13,.14,.05,'armor',0,-.4,-.07);box(leg,.145,.13,.23,'rubber',0,-.8,-.035);box(leg,.15,.03,.24,'dark',0,-.87,-.035);
  const arm=new THREE.Group();arm.name=side<0?'armL':'armR';arm.position.set(side*.24,1.3,0);g.add(arm);cyl(arm,.078,.068,.25,'cloth',0,-.1,0,'y');const forearm=cyl(arm,.062,.05,.25,'cloth',side<0?.04:-.035,-.24,-.09,'y');forearm.rotation.x=1.05;box(arm,.1,.07,.1,'rubber',side<0?.06:-.04,-.28,-.22);box(arm,.11,.13,.055,'armor',0,-.04,-.045);
 }
 const gun=createWeapon(archetype==='marksman'?'sniper':archetype==='rusher'?'smg':'rifle');gun.scale.setScalar(.82);gun.position.set(.12,1.04,-.28);g.add(gun);
 const marker=box(g,.05,.03,.013,'amber',.12,1.22,-.225);marker.name='identification';return g;
}
export function createHelicopter(){
 const g=new THREE.Group();g.name='helicopter';
 const body=mesh(g,geo('heli-body',()=>new THREE.SphereGeometry(1,12,8)),'armor');body.scale.set(1.05,.95,2.25);
 const nose=mesh(g,geo('heli-nose',()=>new THREE.SphereGeometry(1,10,6)),'glass',0,.22,-1.45);nose.scale.set(.9,.68,.95);
 box(g,.055,1.05,1.1,'metal',0,.55,-1.9);box(g,1.7,.07,.08,'metal',0,.7,-1.9);
 const tail=cyl(g,.32,.12,4.6,'armor',0,.4,3.7);tail.rotation.x=-Math.PI/2;
 const fin=poly(g,[[0,0],[.8,.1],[.9,1.65],[.4,1.7]],.12,'armor');fin.rotation.y=Math.PI/2;fin.position.set(-.06,.4,5.45);
 box(g,2,.12,.5,'armor',0,.6,5);cyl(g,.18,.2,.65,'metal',0,1.15,0,'y');
 const rotor=new THREE.Group();rotor.name='rotor';rotor.position.y=1.52;g.add(rotor);for(let i=0;i<4;i++){const blade=box(rotor,.3,.035,4.7,'dark',0,0,2.1);const pivot=new THREE.Group();rotor.remove(blade);pivot.rotation.y=i*Math.PI/2;rotor.add(pivot);pivot.add(blade);}cyl(rotor,.3,.25,.12,'metal',0,0,0,'y');
 const tailRotor=new THREE.Group();tailRotor.name='tailRotor';tailRotor.position.set(.28,.8,5.8);g.add(tailRotor);box(tailRotor,.035,1.6,.12,'dark');box(tailRotor,.035,.12,1.6,'dark');
 for(const side of [-1,1]){cyl(g,.065,.065,3.8,'dark',side*1.1,-1.12,.15);for(const z of [-.85,.9]){const strut=cyl(g,.055,.055,.75,'metal',side*.9,-.85,z,'y');strut.rotation.z=side*.5;}box(g,.03,.65,.9,'metal',side*1.01,-.08,.1);box(g,.04,.43,.65,'glass',side*1.03,.25,.1);cyl(g,.2,.22,.65,'dark',side*.65,.65,1.25);}
 box(g,.1,.1,.1,'amber',-1.1,.1,.2);return g;
}
const glyphs={
 S:[[.9,1],[.16,1],[0,.84],[0,.57],[.17,.43],[.66,.43],[.7,.38],[.7,.24],[.64,.19],[0,.19],[0,0],[.74,0],[.94,.17],[.94,.46],[.77,.61],[.27,.61],[.23,.66],[.23,.77],[.28,.81],[.9,.81]],
 A:[[0,0],[.27,1],[.68,1],[.96,0],[.7,0],[.64,.24],[.31,.24],[.25,0]],
 M:[[0,0],[0,1],[.25,1],[.5,.52],[.75,1],[1,1],[1,0],[.76,0],[.76,.58],[.5,.16],[.24,.58],[.24,0]],
 '9':[[.03,0],[.7,0],[.94,.23],[.94,.79],[.74,1],[.19,1],[0,.82],[0,.5],[.17,.33],[.69,.33],[.69,.24],[.63,.19],[.03,.19]]
};
export function createTitle(){const group=new THREE.Group();group.name='SAM999';let x=0;for(const [i,char] of [...'SAM999'].entries()){const s=new THREE.Shape();glyphs[char].forEach((p,j)=>j?s.lineTo(...p):s.moveTo(...p));s.closePath();if(char==='A'){const hole=new THREE.Path();hole.moveTo(.36,.43);hole.lineTo(.59,.43);hole.lineTo(.48,.82);hole.closePath();s.holes.push(hole);}if(char==='9'){const hole=new THREE.Path();hole.moveTo(.25,.55);hole.lineTo(.69,.55);hole.lineTo(.69,.75);hole.lineTo(.64,.8);hole.lineTo(.3,.8);hole.lineTo(.25,.75);hole.closePath();s.holes.push(hole);}const geometry=geo('letter-'+char,()=>new THREE.ExtrudeGeometry(s,{depth:.19,bevelEnabled:true,bevelSegments:2,bevelSize:.025,bevelThickness:.025,steps:1,curveSegments:1}));const letter=mesh(group,geometry,'title',x,0,0);letter.name='letter-'+i;letter.userData.letter=char;x+=1.12;}group.position.x=-x*.5+.1;group.userData.width=x;return group;}
