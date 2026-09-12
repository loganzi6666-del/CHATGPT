(()=>{
  'use strict';
  if(window.__FOOTBALL_LIFE_V10_MATCH_GATE__) return;
  window.__FOOTBALL_LIFE_V10_MATCH_GATE__=true;
  const V=window.V10;
  if(!V || typeof Game==='undefined' || typeof UI==='undefined' || typeof G==='undefined') return;

  function clamp(n,min=0,max=100){return Math.max(min,Math.min(max,Number(n)||0))}
  function ensure(){
    if(G.weekMatchResolved===undefined) G.weekMatchResolved=false;
    if(!G.matchGate || typeof G.matchGate!=='object') G.matchGate=null;
    G.saveVersion=10.1;
  }
  ensure();

  const style=document.createElement('style');
  style.textContent=`
  .matchGateHero{padding:18px;border:1px solid #2f6e8c;border-radius:16px;background:radial-gradient(circle at 85% 10%,#133d43 0,#0a2230 36%,#071923 72%);box-shadow:0 24px 60px #0008}
  .matchGateHero h1{font-size:32px;margin:5px 0 6px}.matchGateHero .versus{font-size:22px;font-weight:900;margin:12px 0}.matchGateHero .sub{color:#92a9b5}
  .matchGateStatus{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:14px 0}.matchGateStat{padding:11px;border:1px solid #1a4b63;background:#061b28;border-radius:11px}.matchGateStat small{display:block;color:#8fa9b7;font-size:10px}.matchGateStat b{display:block;font-size:18px;margin-top:3px}
  .coachDecision{margin:12px 0;padding:13px;border-radius:12px;background:#102819;border:1px solid #3f9f6c}.coachDecision.bench{background:#29230d;border-color:#c19a3a}.coachDecision.out{background:#2d1418;border-color:#a84451}.coachDecision b{font-size:17px}.coachDecision p{margin:5px 0 0;color:#c0d2da}
  .matchGateActions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:14px}.matchGateAction{padding:14px;border-radius:12px;border:1px solid #2a5b72;background:#092333;color:#fff;text-align:left}.matchGateAction:hover{border-color:#69d8ff}.matchGateAction strong{display:block;font-size:14px}.matchGateAction span{display:block;color:#98afba;font-size:10px;margin-top:5px;line-height:1.45}
  .matchGateAction.play{border-color:#49dca4;background:#0d3329}.matchGateAction.watch{border-color:#f2c968;background:#2d260e}.matchGateAction.skip{border-color:#586b78;background:#151e24}.matchGateAction:disabled{opacity:.38;cursor:not-allowed}
  .matchGateResult{margin-top:12px;padding:12px;border-radius:11px;background:#071a26;border:1px solid #234f65}.matchGateResult h3{margin:0 0 5px}.matchGateResult .score{font-size:28px;font-weight:1000}
  @media(max-width:800px){.matchGateStatus,.matchGateActions{grid-template-columns:1fr 1fr}}@media(max-width:560px){.matchGateStatus,.matchGateActions{grid-template-columns:1fr}.matchGateHero h1{font-size:25px}}
  `;
  document.head.appendChild(style);

  function fixture(){return Array.isArray(G.fixtures)&&G.fixtures.length?G.fixtures[0]:null}
  function fixtureKey(f=fixture()){return f?`${G.year}|${G.month}|${G.day}|${f[0]}|${f[1]}`:null}
  function closeGate(){document.getElementById('matchGateOverlay')?.remove()}
  function selectionReason(status,diff){
    if(G.injuryWeeks>0) return `${G.injury?.name||'부상'} 재활 중이라 경기 명단에서 제외됐다.`;
    if(G.cheat?.alwaysStarter) return '치트 설정으로 감독이 선발 출전을 확정했다.';
    if(status==='선발'){
      if(G.fitness<65) return '컨디션 부담이 있지만 최근 폼과 감독 신뢰를 높게 평가해 선발로 선택했다.';
      if(diff<2) return '포지션 경쟁은 치열하지만 최근 훈련과 경기력을 근소하게 높게 평가했다.';
      return ['최근 경기력이 좋아 선발 명단에 넣었다.','상대 전술에 가장 잘 맞는 카드로 판단했다.','훈련 태도와 감독 신뢰를 바탕으로 선발 기회를 줬다.'][Math.floor(Math.random()*3)];
    }
    if(status==='벤치'){
      if(G.fitness<62) return '체력 관리와 로테이션을 위해 벤치에서 시작한다.';
      if(diff<0) return '포지션 경쟁자가 근소하게 앞서 벤치에서 시작한다.';
      return ['상대 흐름을 본 뒤 후반 조커로 쓰려 한다.','전술적 로테이션으로 벤치 대기 지시를 받았다.','감독이 후반 교체 카드로 활용하려 한다.'][Math.floor(Math.random()*3)];
    }
    if(G.managerTrust<40) return '감독 신뢰가 충분하지 않아 이번 경기 명단에서 빠졌다.';
    if(G.fitness<48) return '몸 상태 보호를 위해 명단에서 제외됐다.';
    return ['포지션 경쟁과 전술적 선택으로 이번 명단에서 제외됐다.','감독이 다른 유형의 선수를 선택했다.','로테이션과 전술 변화로 이번 경기는 쉬게 됐다.'][Math.floor(Math.random()*3)];
  }

  function decideSelection(){
    ensure();
    if(G.injuryWeeks>0) return {status:'명단 제외',reason:selectionReason('명단 제외',-99),rank:Math.max(1,G.positionRank||4)};
    if(G.cheat?.alwaysStarter) return {status:'선발',reason:selectionReason('선발',99),rank:1};
    const comps=Array.isArray(G.positionCompetitors)?G.positionCompetitors:[];
    const scores=comps.map(p=>(Number(p.ovr)||50)+(Number(p.form)||55)/5).sort((a,b)=>b-a);
    const best=scores[0]||((G.ovr||52)+(G.form||60)/5);
    const player=(G.ovr||52)+(G.form||60)/5+(G.managerTrust||50)/10+(G.stage==='youth'?(G.academyRep||45)/20:0);
    const diff=player-best;
    G.positionRank=1+scores.filter(s=>s>player).length;
    let starter=48+diff*4+(G.managerTrust-50)*.25+(G.form-60)*.18-(Math.max(0,65-G.fitness)*.55);
    let omit=7+Math.max(0,42-G.managerTrust)*.45+Math.max(0,50-G.form)*.28+Math.max(0,50-G.fitness)*.7-Math.max(0,diff)*.2;
    starter=clamp(starter,10,90); omit=clamp(omit,2,46);
    const roll=Math.random()*100;
    let status=roll<omit?'명단 제외':roll<omit+starter?'선발':'벤치';
    return {status,reason:selectionReason(status,diff),rank:G.positionRank};
  }

  function gateForCurrentFixture(){
    const f=fixture();if(!f)return null;
    const key=fixtureKey(f);
    if(G.matchGate && !G.matchGate.resolved && G.matchGate.fixtureKey===key) return G.matchGate;
    const pick=decideSelection();
    G.selectionStatus=pick.status;
    G.matchGate={fixtureKey:key,opp:f[0],comp:f[1],status:pick.status,reason:pick.reason,rank:pick.rank,resolved:false,openedAtWeek:G.week,result:null};
    V.safeSave();
    return G.matchGate;
  }

  function gateClass(status){return status==='선발'?'':status==='벤치'?'bench':'out'}
  function statusIcon(status){return status==='선발'?'⭐':status==='벤치'?'🪑':'⛔'}
  function openGate(){
    ensure();
    if(G.matchSession){UI.show('match');return V.toast('진행 중인 경기를 먼저 끝내세요.')}
    const f=fixture();if(!f)return null;
    const g=gateForCurrentFixture();closeGate();
    const d=document.createElement('div');d.id='matchGateOverlay';d.className='v10Overlay';
    const directLabel=g.status==='선발'?'경기 직접 뛰기':g.status==='벤치'?'교체 투입 시 직접 뛰기':'직접 출전 불가';
    const directDesc=g.status==='선발'?'결정적 순간과 감독 지시를 직접 선택한다.':g.status==='벤치'?'감독이 후반에 부르면 직접 플레이한다.':'감독이 이번 경기 명단에 포함하지 않았다.';
    const watchLabel=g.status==='벤치'?'벤치에서 지켜보기':'경기 관전하기';
    const watchDesc=g.status==='벤치'?'교체 투입 여부도 감독 판단으로 자동 결정된다.':'경기 흐름과 네 활약을 자동 시뮬레이션한다.';
    d.innerHTML=`<div class="v10Panel"><div class="v10PanelHead"><div><span class="v10Badge" style="background:#16b883">MATCH DAY</span><h1 style="margin-top:6px">⚽ 경기가 있습니다!</h1><p class="muted">다음 주로 넘어가기 전에 이 경기를 어떻게 진행할지 선택해야 합니다.</p></div><button class="btn" onclick="MatchGate.close()">나중에 결정</button></div><div class="matchGateHero"><span class="pill">${g.comp}</span><div class="versus">${G.club} <span class="sub">vs</span> ${g.opp}</div><div class="coachDecision ${gateClass(g.status)}"><b>${statusIcon(g.status)} 감독 결정: ${g.status}</b><p>${g.reason}</p></div><div class="matchGateStatus"><div class="matchGateStat"><small>OVR</small><b>${G.ovr}</b></div><div class="matchGateStat"><small>폼</small><b>${G.form}</b></div><div class="matchGateStat"><small>컨디션</small><b>${G.fitness}</b></div><div class="matchGateStat"><small>포지션 경쟁</small><b>${g.rank}순위</b></div></div><div class="matchGateActions"><button class="matchGateAction play" ${g.status==='명단 제외'?'disabled':''} onclick="MatchGate.play()"><strong>🎮 ${directLabel}</strong><span>${directDesc}</span></button><button class="matchGateAction watch" onclick="MatchGate.watch()"><strong>👀 ${watchLabel}</strong><span>${watchDesc}</span></button><button class="matchGateAction skip" onclick="MatchGate.skip()"><strong>⏩ 결과만 스킵</strong><span>경기 결과와 감독 판단만 빠르게 반영하고 다음 주 진행은 직접 누른다.</span></button></div></div></div>`;
    document.body.appendChild(d);V.safeSave();return g;
  }

  function goalRoll(rate){let g=0;for(let i=0;i<4;i++)if(Math.random()<rate)g++;return g}
  function teamScore(){
    const base=clamp(.22+(G.ovr-50)/220+(G.form-50)/360,.15,.48);
    return goalRoll(base);
  }
  function markResolved(resultText){
    ensure();G.weekMatchResolved=true;
    if(G.matchGate){G.matchGate.resolved=true;G.matchGate.result=resultText||G.lastMatch||null}
    V.safeSave();
  }
  function noAppearanceResult(mode){
    const f=fixture();if(!f)return;
    const us=teamScore(),them=goalRoll(.27);const result=us>them?'승':us<them?'패':'무';
    G.fixtures.shift();
    const isContinental=String(f[1]).includes('Champions')||String(f[1]).includes('Europa')||String(f[1]).includes('ACL');
    if(isContinental){G.continentalHistory=Array.isArray(G.continentalHistory)?G.continentalHistory:[];G.continentalHistory.unshift(`${G.year} ${f[1]}: ${us}-${them} ${result} vs ${f[0]}`)}
    else if(typeof Game.updateLeague==='function') Game.updateLeague(G.club,f[0],us,them);
    if(G.selectionStatus==='명단 제외'){
      G.squadOmissions=(G.squadOmissions||0)+1;
      G.history.unshift(`${f[1]} ${f[0]}전 ${us}-${them} ${result} · 명단 제외로 관중석에서 경기를 지켜봤다.`);
    }else{
      G.history.unshift(`${f[1]} ${f[0]}전 ${us}-${them} ${result} · 벤치 대기, 미출전.`);
    }
    G.lastMatch={opp:f[0],res:`${us}-${them} ${result}`,rating:'DNP',goals:0,assists:0};
    G.form=clamp(G.form+(result==='승'?1:result==='패'?-1:0));
    markResolved(G.lastMatch);V.safeSave();UI.renderAll();
    if(mode==='watch') showResultOverlay({opp:f[0],comp:f[1],us,them,result,appearance:false,status:G.selectionStatus,rating:'DNP',goals:0,assists:0});
    else V.toast(`경기 결과: ${G.club} ${us}-${them} ${f[0]} · 다음 주 진행을 눌러 계속하세요.`);
  }
  function autoAppearance(mode,asSub){
    const f=fixture();if(!f)return;
    const us=teamScore(),them=goalRoll(.27);const result=us>them?'승':us<them?'패':'무';
    const starter=!asSub;
    const baseRating=(starter?6.35:6.15)+(result==='승'?.35:result==='패'?-0.18:.05)+(G.form-60)/80+(Math.random()-.5)*.7;
    const attacking=['ST','LW','RW','CAM'].includes(G.pos);
    let goals=0,assists=0;
    if(us>0 && attacking && Math.random()<clamp(.18+(G.attrs?.shoot||50)/260,0,.55)) goals=1;
    if(us-goals>0 && ['CAM','CM','LW','RW'].includes(G.pos) && Math.random()<clamp(.16+(G.attrs?.vision||50)/300,0,.48)) assists=1;
    const rating=clamp(baseRating+goals*.8+assists*.55,5.5,9.4);
    if(starter) G.starts=(G.starts||0)+1; else G.benchApps=(G.benchApps||0)+1;
    G.matchSession={opp:f[0],comp:f[1],international:false,half:2,minute:90,us,them,left:0,rating,energy:clamp(G.fitness-(starter?18:8)),goals,assists,shots:goals?2:1,keyPasses:assists?2:0,yellow:0,red:false,subbed:false,starter,tactic:'균형',halftimeDone:true,managerDemand:null,demandCount:0,demandSuccess:0,actionsTaken:0,coachFocus:null,coachFocusTurns:0,log:[starter?"1' 자동 관전 모드로 선발 출전.":"65' 자동 관전 모드로 교체 투입."]};
    const snap={opp:f[0],comp:f[1],us,them,result,rating:rating.toFixed(1),goals,assists,status:G.selectionStatus,appearance:true};
    Game.finishMatch();
    if(mode==='watch') showResultOverlay(snap); else V.toast(`경기 결과: ${G.club} ${us}-${them} ${f[0]} · 다음 주 진행을 눌러 계속하세요.`);
  }
  function simulate(mode){
    const g=gateForCurrentFixture();closeGate();if(!g)return;
    G.selectionStatus=g.status;
    if(g.status==='명단 제외') return noAppearanceResult(mode);
    if(g.status==='벤치'){
      const subChance=clamp(.28+(G.managerTrust||50)/220+(G.form||60)/300,.25,.78);
      if(Math.random()<subChance) return autoAppearance(mode,true);
      return noAppearanceResult(mode);
    }
    return autoAppearance(mode,false);
  }
  function showResultOverlay(r){
    document.getElementById('matchGateResultOverlay')?.remove();
    const d=document.createElement('div');d.id='matchGateResultOverlay';d.className='v10Overlay';
    d.innerHTML=`<div class="v10Panel" style="width:min(680px,95vw)"><div class="v10PanelHead"><div><span class="v10Badge" style="background:#2c7da0">FULL TIME</span><h1 style="margin-top:6px">경기 종료</h1></div><button class="btn green" onclick="MatchGate.closeResult()">확인</button></div><div class="matchGateResult"><h3>${r.comp||''}</h3><div class="score">${G.club} ${r.us}-${r.them} ${r.opp}</div><p>${r.result} · ${r.appearance?`${r.status} · 평점 ${r.rating} · ${r.goals||0}골 ${r.assists||0}도움`:`${r.status} · 미출전`}</p><div class="notice">이번 주 경기는 끝났습니다. <b>다음 주 진행</b>을 눌러야 시간이 넘어갑니다.</div></div></div>`;
    document.body.appendChild(d);
  }

  const previousUpdateSelection=Game.updateSelection?.bind(Game);
  if(previousUpdateSelection) Game.updateSelection=function(){
    ensure();const key=fixtureKey();
    if(G.matchGate && !G.matchGate.resolved && G.matchGate.fixtureKey===key && G.matchGate.status){G.selectionStatus=G.matchGate.status;G.positionRank=G.matchGate.rank||G.positionRank;return G.selectionStatus}
    return previousUpdateSelection(...arguments);
  };

  const previousStart=Game.startMatch?.bind(Game);
  if(previousStart) Game.startMatch=function(){
    ensure();
    if(G.weekMatchResolved) return V.toast('이번 주 경기는 이미 끝났습니다. 상단의 다음 주 진행을 눌러주세요.');
    const key=fixtureKey();
    if(!G.matchGate || G.matchGate.resolved || G.matchGate.fixtureKey!==key){openGate();return}
    if(G.matchGate.status==='명단 제외') return V.toast('감독 판단으로 이번 경기에는 출전할 수 없습니다.');
    G.selectionStatus=G.matchGate.status;closeGate();return previousStart(...arguments);
  };

  const previousFinish=Game.finishMatch?.bind(Game);
  if(previousFinish) Game.finishMatch=function(){
    const wasClubMatch=!!(G.matchSession && !G.matchSession.international);
    const resultSnapshot=G.matchSession?{opp:G.matchSession.opp,us:G.matchSession.us,them:G.matchSession.them,rating:G.matchSession.rating,goals:G.matchSession.goals,assists:G.matchSession.assists}:null;
    const r=previousFinish(...arguments);
    if(wasClubMatch){markResolved(resultSnapshot||G.lastMatch);V.toast('경기가 끝났습니다. 다음 주 진행을 눌러야 시간이 넘어갑니다.')}
    return r;
  };

  const previousAdvance=Game.advanceWeek?.bind(Game);
  if(previousAdvance) Game.advanceWeek=function(){
    ensure();
    if(G.matchSession){UI.show('match');return V.toast('진행 중인 경기를 먼저 끝내세요.')}
    if(G.stage==='retired') return previousAdvance(...arguments);
    if(G.weekMatchResolved){
      G.weekMatchResolved=false;G.matchGate=null;closeGate();
      const r=previousAdvance(...arguments);V.safeSave();return r;
    }
    if(fixture()){openGate();return}
    return previousAdvance(...arguments);
  };

  const previousFast=Game.fastYouthMonth?.bind(Game);
  if(previousFast) Game.fastYouthMonth=function(){
    if(fixture()){
      openGate();V.toast('경기가 예정되어 있어 4주 자동 진행이 중단됐습니다. 먼저 경기를 처리하세요.');return;
    }
    return previousFast(...arguments);
  };

  window.MatchGate={
    open:openGate,close:closeGate,
    play(){const g=gateForCurrentFixture();if(!g||g.status==='명단 제외')return V.toast('이번 경기에는 직접 출전할 수 없습니다.');closeGate();Game.startMatch()},
    watch(){simulate('watch')},skip(){simulate('skip')},
    closeResult(){document.getElementById('matchGateResultOverlay')?.remove();UI.show('home')}
  };

  try{const brand=document.querySelector('.brand span');if(brand)brand.textContent='10.1';document.title='FOOTBALL LIFE 10.1'}catch(e){}
  V.safeSave();
})();
