/* Classroom Arcade universal touch controls.
   Keyboard-event bridge for pages that consume standard keyboard input.
   Games with specialized controls (DOOM and Sandbox) keep their own touch UI. */
(()=>{'use strict';
if(document.getElementById('ca-touch-dock'))return;
const style=document.createElement('style');
style.textContent=`
#ca-touch-toggle{position:fixed;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:2147483000;border:1px solid #8bd3ff;border-radius:999px;background:#14213a;color:#f4f7ff;padding:10px 14px;font:700 14px/1.2 system-ui,sans-serif;box-shadow:0 4px 18px #0008;touch-action:manipulation}
#ca-touch-dock{position:fixed;left:0;right:0;bottom:0;z-index:2147482999;display:none;align-items:end;justify-content:space-between;gap:12px;padding:12px 14px calc(14px + env(safe-area-inset-bottom));background:linear-gradient(0deg,#070b14f5,#070b14c9 80%,transparent);pointer-events:none;touch-action:none;user-select:none;-webkit-user-select:none}
#ca-touch-dock.ca-open{display:flex}
#ca-touch-dock .ca-cluster{display:grid;gap:7px;pointer-events:auto}
#ca-touch-dock .ca-dpad{grid-template-columns:repeat(3,clamp(42px,12vw,58px));grid-template-rows:repeat(2,clamp(42px,12vw,58px))}
#ca-touch-dock .ca-actions{grid-template-columns:repeat(2,clamp(44px,12vw,60px));grid-template-rows:repeat(2,clamp(44px,12vw,60px))}
#ca-touch-dock button{display:flex;align-items:center;justify-content:center;min-width:0;min-height:0;padding:0;border:1px solid #7f9bbd;border-radius:14px;background:#223653ee;color:#fff;font:800 16px/1 system-ui,sans-serif;box-shadow:0 3px 0 #0a1120;touch-action:none}
#ca-touch-dock button:active,#ca-touch-dock button.ca-pressed{background:#8bd3ff;color:#07111f;transform:translateY(2px);box-shadow:0 1px 0 #0a1120}
#ca-touch-dock .ca-empty{visibility:hidden}
#ca-touch-dock .ca-center{display:flex;gap:6px;align-self:center;pointer-events:auto}
#ca-touch-dock .ca-center button{min-width:48px;min-height:36px;font-size:11px}
@media(min-width:900px){#ca-touch-dock{left:auto;width:min(520px,50vw);border-top-left-radius:18px;padding:12px 18px calc(14px + env(safe-area-inset-bottom));background:#070b14e8}#ca-touch-toggle{bottom:14px}}
@media(prefers-reduced-motion:reduce){#ca-touch-dock button{transition:none}}
`;
document.head.appendChild(style);
const toggle=document.createElement('button');toggle.id='ca-touch-toggle';toggle.type='button';toggle.textContent='🎮 Touch controls';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','ca-touch-dock');
const dock=document.createElement('div');dock.id='ca-touch-dock';dock.setAttribute('aria-label','Universal touch controls');
dock.innerHTML='<div class="ca-cluster ca-dpad"><button class="ca-empty" tabindex="-1" aria-hidden="true"></button><button data-key="ArrowUp" aria-label="Up">▲</button><button class="ca-empty" tabindex="-1" aria-hidden="true"></button><button data-key="ArrowLeft" aria-label="Left">◀</button><button data-key="ArrowDown" aria-label="Down">▼</button><button data-key="ArrowRight" aria-label="Right">▶</button></div><div class="ca-center"><button data-key="Enter" aria-label="Start or confirm">START</button><button data-key="Escape" aria-label="Back or pause">BACK</button></div><div class="ca-cluster ca-actions"><button data-key=" " aria-label="A action">A</button><button data-key="Shift" aria-label="B action">B</button><button data-key="e" aria-label="X action">X</button><button data-key="Control" aria-label="Y action">Y</button></div>';
document.body.append(toggle,dock);
const active=new Map();
function dispatch(key,type){
 const code=key===' '?'Space':key==='ArrowUp'?'ArrowUp':key==='ArrowDown'?'ArrowDown':key==='ArrowLeft'?'ArrowLeft':key==='ArrowRight'?'ArrowRight':key==='Enter'?'Enter':key==='Escape'?'Escape':key==='Shift'?'ShiftLeft':key==='Control'?'ControlLeft':key.length===1?'Key'+key.toUpperCase():key;
 const event=new KeyboardEvent(type,{key,code,bubbles:true,cancelable:true,composed:true,shiftKey:key==='Shift',ctrlKey:key==='Control'});
 try{Object.defineProperty(event,'keyCode',{get:()=>({' ':32,Enter:13,Escape:27,ArrowUp:38,ArrowDown:40,ArrowLeft:37,ArrowRight:39,Shift:16,Control:17}[key]||key.toUpperCase().charCodeAt(0))});Object.defineProperty(event,'which',{get:()=>event.keyCode})}catch(_){}
 document.dispatchEvent(event);
}
function nativeTarget(key){
 if(!document.querySelector('.touchButton'))return null;
 const ids={'ArrowUp':'moveUp','ArrowDown':'moveDown','ArrowLeft':'moveLeft','ArrowRight':'moveRight',' ':'useButton','Control':'fireButton','e':'fireButton','Shift':'runButton','Escape':'menuButton','Enter':'enterButton','Tab':'mapButton'};
 return ids[key]?document.getElementById(ids[key]):null;
}
function nativePointer(target,type,pointerId){
 if(!target)return;
 try{target.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId,pointerType:'touch',isPrimary:true,button:0,buttons:type==='pointerup'?0:1}))}catch(_){}
}
function press(button,pointerId){
 const key=button.dataset.key;if(active.has(pointerId))return;
 const native=nativeTarget(key);active.set(pointerId,{key,button,native});button.classList.add('ca-pressed');
 if(native)nativePointer(native,'pointerdown',pointerId);
 else if(![...active.values()].some(x=>x.key===key&&x.button!==button))dispatch(key,'keydown');
}
function release(pointerId){
 const item=active.get(pointerId);if(!item)return;active.delete(pointerId);item.button.classList.remove('ca-pressed');
 if(item.native)nativePointer(item.native,'pointerup',pointerId);
 else if(![...active.values()].some(x=>x.key===item.key))dispatch(item.key,'keyup');
}
function releaseAll(){for(const id of [...active.keys()])release(id)}
dock.querySelectorAll('[data-key]').forEach(button=>{
 button.addEventListener('contextmenu',e=>e.preventDefault());
 button.addEventListener('pointerdown',e=>{e.preventDefault();try{button.setPointerCapture(e.pointerId)}catch(_){}press(button,e.pointerId)});
 button.addEventListener('pointerup',e=>{e.preventDefault();release(e.pointerId)});
 button.addEventListener('pointercancel',e=>release(e.pointerId));
 button.addEventListener('lostpointercapture',e=>release(e.pointerId));
});
toggle.addEventListener('click',()=>{const open=!dock.classList.contains('ca-open');dock.classList.toggle('ca-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'✕ Hide controls':'🎮 Touch controls';if(!open)releaseAll()});
window.addEventListener('blur',releaseAll);document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseAll()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dock.classList.contains('ca-open')&&e.target!==document.body){return}});
})();