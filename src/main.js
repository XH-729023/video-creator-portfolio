import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createIcons, ArrowDownRight, ArrowUp, MoveUpRight } from 'lucide';

gsap.registerPlugin(ScrollTrigger);
createIcons({ icons: { ArrowDownRight, ArrowUp, MoveUpRight } });

const canvas = document.querySelector('#fluid');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, .1, 100);
camera.position.z = 4.8;

const uniforms = { uTime: { value: 0 }, uPointer: { value: new THREE.Vector2(.5,.5) } };
const geo = new THREE.IcosahedronGeometry(1.35, 6);
const mat = new THREE.ShaderMaterial({
  transparent: true,
  side: THREE.DoubleSide,
  uniforms,
  vertexShader: `
    uniform float uTime; uniform vec2 uPointer; varying vec3 vN; varying vec3 vP;
    float hash(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
    float noise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
    void main(){vec3 p=position;float n=noise(normal*2.3+uTime*.22)+.5*noise(normal*5.-uTime*.16);p+=normal*(n-.6)*.62;p.x+=(uPointer.x-.5)*.28;p.y+=(uPointer.y-.5)*.2;vN=normalMatrix*normal;vP=p;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}
  `,
  fragmentShader: `
    varying vec3 vN; varying vec3 vP; uniform float uTime;
    void main(){float fres=pow(1.-abs(dot(normalize(vN),vec3(0.,0.,1.))),2.2);float bands=.5+.5*sin(vP.y*7.+vP.x*3.+uTime);vec3 acid=vec3(.68,1.,0.);vec3 hot=vec3(1.,.08,.01);vec3 col=mix(acid,hot,bands*.48);float alpha=.05+fres*.53;gl_FragColor=vec4(col,alpha);}
  `
});
const blob = new THREE.Mesh(geo, mat); blob.position.set(1.55,-.35,0); scene.add(blob);

function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();blob.scale.setScalar(innerWidth<760?.82:1)}
addEventListener('resize',resize);resize();
const pointer={x:.5,y:.5}; addEventListener('pointermove',e=>{pointer.x=e.clientX/innerWidth;pointer.y=1-e.clientY/innerHeight});
const clock=new THREE.Clock();
function render(){uniforms.uTime.value=clock.getElapsedTime();uniforms.uPointer.value.x+=(pointer.x-uniforms.uPointer.value.x)*.025;uniforms.uPointer.value.y+=(pointer.y-uniforms.uPointer.value.y)*.025;blob.rotation.x+=.0015;blob.rotation.y+=.0025;renderer.render(scene,camera);requestAnimationFrame(render)} render();

gsap.timeline({defaults:{ease:'power4.out'}})
  .to('.line > span',{y:0,duration:1.35,stagger:.11,delay:.25})
  .to('.reveal',{opacity:1,y:0,duration:.8,stagger:.12},'-=.75');

gsap.to('.hero-media',{yPercent:15,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
gsap.to('.hero-copy',{yPercent:-22,opacity:.25,ease:'none',scrollTrigger:{trigger:'.hero',start:'45% top',end:'bottom top',scrub:true}});
gsap.to('.orbit-word',{xPercent:-32,ease:'none',scrollTrigger:{trigger:'.manifesto',start:'top bottom',end:'bottom top',scrub:1}});
gsap.from('.manifesto-text',{y:100,opacity:0,rotation:2,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:'.manifesto-text',start:'top 82%'}});
document.querySelectorAll('.project').forEach((el,i)=>gsap.from(el,{y:i%2?140:90,rotation:i%2?1.5:-1,opacity:0,duration:1.3,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
gsap.to(blob.position,{x:-1.5,y:.5,ease:'none',scrollTrigger:{trigger:'.works',start:'top bottom',end:'bottom top',scrub:1.3}});

const cursor=document.querySelector('.cursor');
addEventListener('pointermove',e=>gsap.to(cursor,{x:e.clientX,y:e.clientY,duration:.16,ease:'power2.out'}));
document.querySelectorAll('.cursor-view').forEach(el=>{el.addEventListener('mouseenter',()=>cursor.classList.add('view'));el.addEventListener('mouseleave',()=>cursor.classList.remove('view'))});
document.querySelectorAll('.magnetic').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();gsap.to(el,{x:(e.clientX-r.left-r.width/2)*.22,y:(e.clientY-r.top-r.height/2)*.22,duration:.35})});el.addEventListener('pointerleave',()=>gsap.to(el,{x:0,y:0,duration:.6,ease:'elastic.out(1,.35)'}))});

const menuBtn=document.querySelector('.menu-btn'),menu=document.querySelector('.menu');
function toggleMenu(force){const open=force??!menu.classList.contains('open');menu.classList.toggle('open',open);menuBtn.classList.toggle('active',open);menuBtn.setAttribute('aria-expanded',open);menu.setAttribute('aria-hidden',!open)}
menuBtn.addEventListener('click',()=>toggleMenu());menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));
document.querySelector('.to-top').addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
