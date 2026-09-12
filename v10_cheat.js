(()=>{
  'use strict';
  if(window.__FOOTBALL_LIFE_V10_CHEAT__) return;window.__FOOTBALL_LIFE_V10_CHEAT__=true;
  const V=window.V10;if(!V||!window.Game||!window.UI)return;
  const academies=[['genk','KRC Genk Academy'],['psv','PSV Academy'],['az','AZ Alkmaar Academy'],['feyenoord','Feyenoord Academy'],['salzburg','RB Salzburg Academy'],['ajax','Ajax Academy'],['sporting','Sporting CP Academy'],['benfica','Benfica Campus'],['dortmund','Borussia Dortmund Academy']];
  const clubs=[['FC서울','K리그1'],['전북 현대','K리그1'],['울산 HD','K리그1'],['PSV','Eredivisie'],['Ajax','Eredivisie'],['Feyenoord','Eredivisie'],['Sporting CP','Liga Portugal'],['Benfica','Liga Portugal'],['Borussia Dortmund','Bundesliga'],['Bayern München','Bundesliga'],['Tottenham','Premier League'],['Arsenal','Premier League'],['Liverpool','Premier League'],['Manchester City','Premier League'],['Barcelona','LaLiga'],['Real Madrid','LaLiga']];

  function flagUsed(){V.ensureState();G.cheat.used=true;V.safeSave();V.updateCheatMark()}
  function close(){document.getElementById('v10CheatCenter')?.remove()}
  function num(id,def=0){const e=document.getElementById(id);const n=Number(e?.value);return Number.isFinite(n)?n:def}
  function setField(k,v,min=0,max=100){flagUsed();G[k]=V.clamp(v,min,max);V.safeSave();V.refresh();V.toast(`🧪 ${k} → ${G[k]}`)}
  function addField(k,v){flagUsed();G[k]=(Number(G[k])||0)+Math.round(v);V.safeSave();V.refresh();V.toast(`🧪 ${k} +${Math.round(v)}`)}

  const C=window.V10Cheat={
    open(){V.ensureState();close();const d=document.createElement('div');d.id='v10CheatCenter';d.className='v10Overlay';d.innerHTML=`<div class="v10Panel"><div class="v10PanelHead"><div><span class="v10Badge">F4 CHEAT CENTER</span><h1 style="margin-top:5px">커리어 치트 센터</h1><p class="muted">치트를 한 번이라도 사용하면 이 세이브에 CHEAT 표시가 남습니다.</p></div><button class="btn red" onclick="V10Cheat.close()">닫기 ✕</button></div>
    <div class="v10CheatGrid">
      <div class="v10CheatCard"><label>스킬 포인트 추가</label><input id="ccSkill" type="number" value="5"><button class="btn green" onclick="V10Cheat.addSkill()">추가</button></div>
      <div class="v10CheatCard"><label>현금 추가 (원)</label><input id="ccMoney" type="number" value="10000000"><button class="btn green" onclick="V10Cheat.addMoney()">추가</button></div>
      <div class="v10CheatCard"><label>OVR 설정</label><input id="ccOvr" type="number" min="1" max="99" value="${G.ovr}"><button class="btn blue" onclick="V10Cheat.setOvr()">설정</button></div>
      <div class="v10CheatCard"><label>잠재력 설정</label><input id="ccPot" type="number" min="1" max="99" value="${G.potential}"><button class="btn blue" onclick="V10Cheat.setPot()">설정</button></div>
      <div class="v10CheatCard"><label>컨디션 설정</label><input id="ccFit" type="number" min="0" max="100" value="${G.fitness}"><button class="btn blue" onclick="V10Cheat.setFit()">설정</button></div>
      <div class="v10CheatCard"><label>나이 변경</label><input id="ccAge" type="number" min="14" max="50" value="${G.age}"><button class="btn blue" onclick="V10Cheat.setAge()">설정</button></div>
      <div class="v10CheatCard"><label>감독 신뢰</label><input id="ccMgr" type="number" min="0" max="100" value="${G.managerTrust}"><button class="btn blue" onclick="V10Cheat.setMgr()">설정</button></div>
      <div class="v10CheatCard"><label>팬 수 추가</label><input id="ccFans" type="number" value="10000"><button class="btn green" onclick="V10Cheat.addFans()">추가</button></div>
      <div class="v10CheatCard"><label>국가대표 평가</label><input id="ccNat" type="number" min="0" max="100" value="${G.nationalRep}"><button class="btn blue" onclick="V10Cheat.setNat()">설정</button></div>
      <div class="v10CheatCard"><label>유럽 스카우트 관심도</label><input id="ccScout" type="number" min="0" max="100" value="${G.europeScout?.exposure||0}"><button class="btn blue" onclick="V10Cheat.setScout()">설정</button></div>
      <div class="v10CheatCard"><label>아카데미 초청 생성</label><select id="ccAcademy">${academies.map(a=>`<option value="${a[0]}">${a[1]}</option>`).join('')}</select><button class="btn gold" onclick="V10Cheat.inviteAcademy()">초청장 생성</button></div>
      <div class="v10CheatCard"><label>구단 이적 제안 생성</label><select id="ccClub">${clubs.map((c,i)=>`<option value="${i}">${c[0]} · ${c[1]}</option>`).join('')}</select><button class="btn gold" onclick="V10Cheat.offerClub()">오퍼 생성</button></div>
    </div>
    <div class="title" style="margin-top:16px"><h2>즉시 치트</h2></div><div class="btnrow"><button class="btn green" onclick="V10Cheat.heal()">🩺 부상 완전 제거</button><button class="btn blue" onclick="V10Cheat.maxForm()">🔥 폼·멘탈 MAX</button><button class="btn gold" onclick="V10Cheat.maxScout()">✈️ 유럽 스카우트 MAX</button></div>
    <div class="title" style="margin-top:16px"><h2>토글 치트</h2></div><div class="v10ToggleGrid">${[
      ['infiniteFitness','♾️ 무한 체력','경기·훈련 후 컨디션과 경기 에너지 100 유지'],['injuryOff','🛡️ 부상 OFF','훈련·경기 부상을 완전히 차단'],['trialAutoPass','🎯 트라이얼 100% 합격','유럽 아카데미 최종 점수를 자동 보정'],['alwaysStarter','⭐ 항상 선발','포지션 경쟁과 관계없이 선발 고정'],['transferFlood','📨 이적 제안 폭주','프로라면 매주 새 이적 오퍼 생성'],['ballonCandidate','🏆 발롱도르 후보','시즌 피날레에서 발롱도르 레이스 강제 진입']
    ].map(x=>`<button class="v10Toggle ${G.cheat[x[0]]?'on':''}" onclick="V10Cheat.toggle('${x[0]}')"><b>${x[1]} ${G.cheat[x[0]]?'ON':'OFF'}</b><small>${x[2]}</small></button>`).join('')}</div></div>`;document.body.appendChild(d)},
    close,
    addSkill(){addField('skillPoints',num('ccSkill',5));C.open()},addMoney(){addField('money',num('ccMoney',10000000));C.open()},
    setOvr(){setField('ovr',num('ccOvr',G.ovr),1,99);C.open()},setPot(){setField('potential',num('ccPot',G.potential),1,99);C.open()},setFit(){setField('fitness',num('ccFit',100),0,100);C.open()},setAge(){setField('age',num('ccAge',G.age),14,50);C.open()},setMgr(){setField('managerTrust',num('ccMgr',G.managerTrust),0,100);C.open()},addFans(){addField('fans',num('ccFans',10000));C.open()},setNat(){setField('nationalRep',num('ccNat',G.nationalRep),0,100);C.open()},
    setScout(){flagUsed();G.europeScout=G.europeScout||{exposure:0,invites:[]};G.europeScout.exposure=V.clamp(num('ccScout',100));V.safeSave();V.refresh();C.open()},
    inviteAcademy(){flagUsed();G.europeScout=G.europeScout||{exposure:100,invites:[]};const id=document.getElementById('ccAcademy')?.value;if(id&&!G.europeScout.invites.includes(id))G.europeScout.invites.push(id);G.europeScout.exposure=100;V.addHistory(`🧪 치트로 ${academies.find(a=>a[0]===id)?.[1]||id} 트라이얼 초청 생성.`);V.safeSave();V.refresh();V.toast('아카데미 초청장이 생성됐습니다.');C.open()},
    offerClub(){flagUsed();if(G.stage==='youth')G.stage='player';const c=clubs[Number(document.getElementById('ccClub')?.value)||0];G.transferOffers=Array.isArray(G.transferOffers)?G.transferOffers:[];G.transferOffers.unshift({club:c[0],league:c[1],wage:Math.max(30000,Math.round((G.ovr||60)*950)),role:'주전 경쟁',fee:`€${Math.max(2,(G.ovr-55)*1.2).toFixed(1)}M`,interest:100});V.addHistory(`🧪 치트로 ${c[0]} 공식 이적 제안 생성.`);V.safeSave();V.refresh();V.toast(`${c[0]} 오퍼 생성`);C.open()},
    heal(){flagUsed();G.injury=null;G.injuryWeeks=0;G.rehabProgress=0;G.injuryRisk=0;G.fitness=100;V.safeSave();V.refresh();V.toast('부상 완전 제거');C.open()},
    maxForm(){flagUsed();G.form=100;G.morale=100;G.fitness=100;V.safeSave();V.refresh();C.open()},
    maxScout(){flagUsed();G.academyRep=100;G.europeScout=G.europeScout||{};G.europeScout.exposure=100;G.parentSupport=100;G.nationalRep=100;V.safeSave();V.refresh();C.open()},
    toggle(k){flagUsed();G.cheat[k]=!G.cheat[k];V.safeSave();V.refresh();C.open()}
  };

  window.addEventListener('keydown',e=>{if(e.key==='F4'||e.code==='F4'){e.preventDefault();e.stopImmediatePropagation();C.open()}},true);

  const oldInjury=Game.createInjury?.bind(Game);if(oldInjury)Game.createInjury=function(){V.ensureState();if(G.cheat.injuryOff){G.injury=null;G.injuryWeeks=0;G.injuryRisk=0;return}return oldInjury(...arguments)};
  const oldSel=Game.updateSelection?.bind(Game);if(oldSel)Game.updateSelection=function(){const r=oldSel(...arguments);V.ensureState();if(G.cheat.alwaysStarter){G.selectionStatus='선발';G.positionRank=1}return r};
  const oldTrial=Game.trialChoice?.bind(Game);if(oldTrial)Game.trialChoice=function(choice){V.ensureState();if(G.cheat.trialAutoPass&&G.europeScout?.trial&&G.europeScout.trial.round>=2)G.europeScout.trial.score=Math.max(G.europeScout.trial.score,99);return oldTrial(choice)};
  const oldAdvance=Game.advanceWeek?.bind(Game);if(oldAdvance)Game.advanceWeek=function(){V.ensureState();const r=oldAdvance(...arguments);if(G.cheat.infiniteFitness){G.fitness=100;G.injuryRisk=0;if(G.matchSession)G.matchSession.energy=100}if(G.cheat.transferFlood&&G.stage==='player'&&!G.matchSession&&typeof Game.generateOffers==='function')Game.generateOffers(false);V.safeSave();V.refresh();return r};
  V.updateCheatMark();
})();
