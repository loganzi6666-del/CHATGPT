(()=>{
  'use strict';
  if(window.__FOOTBALL_LIFE_V10_CORE__) return;
  window.__FOOTBALL_LIFE_V10_CORE__=true;

  const V10=window.V10=window.V10||{};
  V10.clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,Number(n)||0));
  V10.koreanMoney=function(v){
    v=Math.max(0,Math.round(Number(v)||0));
    if(v>=100000000){
      const eok=Math.floor(v/100000000), rest=v%100000000, man=Math.floor(rest/10000);
      return man?`${eok.toLocaleString('ko-KR')}억 ${man.toLocaleString('ko-KR')}만원`:`${eok.toLocaleString('ko-KR')}억원`;
    }
    if(v>=10000) return `${Math.floor(v/10000).toLocaleString('ko-KR')}만원`;
    return `${v.toLocaleString('ko-KR')}원`;
  };
  V10.safeSave=()=>{try{ if(typeof save==='function') save(); }catch(e){console.warn('V10 save',e)}};
  V10.refresh=()=>{try{ if(window.UI&&typeof UI.renderAll==='function') UI.renderAll(); }catch(e){console.error('V10 render',e)}};
  V10.toast=(m)=>{try{if(window.UI&&typeof UI.toast==='function')UI.toast(m)}catch(e){}};
  V10.addHistory=(m)=>{if(window.G){G.history=Array.isArray(G.history)?G.history:[];G.history.unshift(m);G.history=G.history.slice(0,120)}};

  function ensureState(){
    if(!window.G) return;
    G.saveVersion=10;
    G.cheat=G.cheat||{used:false,infiniteFitness:false,injuryOff:false,trialAutoPass:false,alwaysStarter:false,transferFlood:false,ballonCandidate:false};
    G.youthDrama=G.youthDrama||{
      phase:'지역 유망주', regionalDone:false,nationalDone:false,u17Done:false,agentContact:false,
      dormLife:70,homesickness:15,localRival:'',localRivalry:20,releaseRisk:5,u19Promotion:false,firstTeamBench:false,
      storyLog:[],seasonMoments:0
    };
    G.lockerV10=G.lockerV10||{
      captain:'주장',bestFriend:'',rival:'',faction:'중립',coachFavorite:'',tension:10,newCoachCount:0,
      relations:{},events:[]
    };
    G.seasonFinale=G.seasonFinale||null;
    G.v10SeasonSnapshots=Array.isArray(G.v10SeasonSnapshots)?G.v10SeasonSnapshots:[];
    G.jerseyNumber=G.jerseyNumber||String(G.pos==='ST'?'9':G.pos==='CAM'?'10':'18');
    G.v10Traits=Array.isArray(G.v10Traits)?G.v10Traits:[];
  }
  V10.ensureState=ensureState;
  ensureState();

  const style=document.createElement('style');
  style.textContent=`
  .v10Badge{display:inline-flex;align-items:center;gap:5px;padding:4px 8px;border-radius:999px;background:#ff3b30;color:#fff;font-size:10px;font-weight:900;box-shadow:0 0 0 2px #06131d}
  .cheatMark{position:fixed;right:12px;bottom:12px;z-index:80;padding:5px 8px;border-radius:8px;background:#451018;color:#ff9ba3;border:1px solid #8f2835;font-size:9px;font-weight:1000;letter-spacing:.12em;display:none}.cheatMark.show{display:block}
  .v10Overlay{position:fixed;inset:0;background:#000c;z-index:150;display:grid;place-items:center;padding:18px;backdrop-filter:blur(8px)}
  .v10Panel{width:min(1040px,96vw);max-height:92vh;overflow:auto;border-radius:18px;background:linear-gradient(160deg,#071925,#0a2230);border:1px solid #285c77;box-shadow:0 30px 80px #000a;padding:18px}
  .v10Panel h1,.v10Panel h2,.v10Panel h3{margin:0}.v10PanelHead{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:14px}
  .v10CheatGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.v10CheatCard{padding:11px;border:1px solid #19465e;background:#081c29;border-radius:12px}.v10CheatCard label{display:block;color:#8fa9b8;font-size:10px;margin-bottom:6px}.v10CheatCard input,.v10CheatCard select{width:100%;padding:9px;border-radius:8px;background:#04131d;border:1px solid #23516a;color:#fff;margin-bottom:7px}
  .v10ToggleGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.v10Toggle{border:1px solid #1b4b63;background:#08202d;color:#dbe9ef;border-radius:10px;padding:11px;text-align:left}.v10Toggle.on{border-color:#60f1b2;background:#0a3229;color:#dffff0}.v10Toggle b{display:block}.v10Toggle small{display:block;color:#8fa9b8;margin-top:4px}
  .v10StoryPath{display:grid;grid-template-columns:repeat(6,minmax(120px,1fr));gap:7px;overflow:auto}.v10StoryStep{padding:10px;border-radius:10px;border:1px solid #18455b;background:#071c28;min-width:120px}.v10StoryStep.done{border-color:#55e9ab;background:#0b2a25}.v10StoryStep.now{border-color:#ffd16a;background:#2b2610}.v10StoryStep b{display:block;font-size:11px}.v10StoryStep small{display:block;color:#8da6b4;font-size:9px;margin-top:4px}
  .v10Moment{border:1px solid #f0c55d;background:linear-gradient(135deg,#34290d,#17150b);border-radius:14px;padding:14px;margin:10px 0;box-shadow:0 10px 30px #0006}.v10Moment .clock{font-size:28px;font-weight:1000;color:#ffe18d}.v10Moment h2{margin:3px 0 8px}.v10ChoiceGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.v10Choice{border:1px solid #315a6d;background:#0a2635;color:#fff;border-radius:11px;padding:12px;text-align:left}.v10Choice:hover{border-color:#65d6ff}.v10Choice b{display:block}.v10Choice small{display:block;color:#9fb3bd;margin-top:5px;line-height:1.4}
  .lockerNetwork{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.lockerPerson{padding:12px;border:1px solid #18465d;background:#071d29;border-radius:12px}.lockerPerson .role{font-size:9px;color:#7f9ead}.lockerPerson .rel{font-size:24px;font-weight:1000;margin:5px 0}.lockerPerson.friend{border-color:#55e9ab}.lockerPerson.rival{border-color:#ff7d87}.lockerPerson.captain{border-color:#ffd36a}
  .finaleStepper{display:grid;grid-template-columns:repeat(8,minmax(90px,1fr));gap:6px;overflow:auto}.finaleStep{padding:8px;border-radius:9px;background:#071b27;border:1px solid #174358;font-size:10px;min-width:90px}.finaleStep.done{background:#0b2b24;border-color:#56e8ad}.finaleStep.now{background:#30270e;border-color:#ffd36a;color:#ffe6a7}.finaleHero{padding:18px;border-radius:14px;background:linear-gradient(135deg,#142d3f,#0b1e2b);border:1px solid #2c607c}.finaleHero h1{font-size:30px;margin:5px 0}
  @media(max-width:900px){.v10CheatGrid,.v10ToggleGrid,.v10ChoiceGrid,.lockerNetwork{grid-template-columns:1fr 1fr}}
  @media(max-width:600px){.v10CheatGrid,.v10ToggleGrid,.v10ChoiceGrid,.lockerNetwork{grid-template-columns:1fr}.v10Panel{padding:12px}}
  `;
  document.head.appendChild(style);

  const mark=document.createElement('div');mark.id='v10CheatMark';mark.className='cheatMark';mark.textContent='CHEAT SAVE';document.body.appendChild(mark);
  V10.updateCheatMark=()=>{ensureState();mark.classList.toggle('show',!!G.cheat.used)};
  V10.updateCheatMark();

  try{
    const brand=document.querySelector('.brand span');if(brand)brand.textContent='10';
    const title=document.querySelector('title');if(title)title.textContent='FOOTBALL LIFE 10';
  }catch(e){}

  const oldRenderTop=window.UI&&UI.renderTop?UI.renderTop.bind(UI):null;
  if(oldRenderTop){UI.renderTop=function(){ensureState();oldRenderTop();V10.updateCheatMark();const m=document.getElementById('topMoney');if(m)m.textContent=V10.koreanMoney(G.money)}}
  V10.safeSave();
})();
