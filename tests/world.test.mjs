import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {buildWorld} from '../world.js';
import {BLOCKS,FLOORS,pathTo} from '../combat.js';
import {createSoldier,createWeapon,createTitle} from '../models.js';
const noop=()=>{};globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>new Proxy({createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>k in o?o[k]:noop,set:()=>true})})};
const scene=new T.Scene(),world=buildWorld(scene);scene.updateMatrixWorld(true);assert.ok(BLOCKS.length>30);assert.ok(FLOORS.length>40);assert.ok(scene.children.some(o=>o.isInstancedMesh));
for(const b of BLOCKS)assert.ok(Number.isFinite(b.top));
const route=pathTo({x:0,z:32},{x:0,z:-34});assert.ok(route.length>0,'Extraction route must exist');
const title=createTitle();assert.equal(title.children.length,6);title.children.forEach(m=>{assert.ok(m.geometry.attributes.position.count>100);assert.equal(m.geometry.parameters.options.bevelEnabled,true)});
const soldier=createSoldier('rifleman');soldier.updateMatrixWorld(true);const head=soldier.getObjectByName('head');const headPos=head.getWorldPosition(new T.Vector3());const ray=new T.Raycaster(new T.Vector3(0,headPos.y,-10),new T.Vector3(0,0,1));const hits=ray.intersectObject(soldier,true);assert.ok(hits.length);assert.ok(hits.some(h=>h.object.userData.head));
for(const kind of ['rifle','sniper','smg','pistol','shotgun']){let model=createWeapon(kind),bounds=new T.Box3().setFromObject(model);assert.ok(!bounds.isEmpty());assert.ok(model.getObjectByName('muzzle'));}
world.update(1,.016);world.setQuality('low');world.setQuality('high');
console.log('PASS: world construction, instancing, colliders, floors, extraction navigation, beveled title, head raycast, five weapon bounds/attachments, environment update');
