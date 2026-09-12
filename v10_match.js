(()=>{
  'use strict';if(window.__FOOTBALL_LIFE_V10_MATCH__)return;window.__FOOTBALL_LIFE_V10_MATCH__=true;
  const V=window.V10;if(!V||!window.Game||!window.UI)return;
  const templates=[
    {min:14,title:'빠른 역습',text:'상대 수비가 정렬되기 전, 세 명이 전진한다.',choices:[['직접 돌파','dribble','성공하면 박스 진입. 실패하면 역습 종료'],['침투 패스','pass','시야와 패스가 중요'],['템포 늦추기','safe','볼 소유를 지키고 팀을 올린다']]},
    {min:27,title:'박스 앞 세컨드볼',text:'흐른 공이 네 앞에 떨어졌다. 수비 한 명이 달려온다.',choices:[['중거리 슈팅','shoot','슈팅과 침착성 승부'],['원터치 패스','pass','동료에게 더 좋은 각도를 만든다'],['파울 유도','dribble','접촉을 끌어내 세트피스를 노린다']]},
    {min:39,title:'압박 트리거',text:'상대 수비수가 등지고 공을 받는다. 감독이 터치라인에서 소리친다.',choices:[['강하게 압박','press','체력을 쓰지만 턴오버를 노린다'],['패스길 차단','safe','위치를 지킨다'],['무시하고 전진','dribble','역습 위치를 선점한다']]},
    {min:52,title:'하프타임 이후 첫 기회',text:'전술 수정 이후 공간이 보인다.',choices:[['킬패스','pass','결정적인 찬스를 만든다'],['직접 슈팅','shoot','과감하게 골을 노린다'],['볼 키핑','safe','경기 템포를 지배한다']]},
    {min:63,title:'경고 위험 태클',text:'상대가 중앙을 돌파한다. 한 번에 끊으면 좋지만 접촉 위험이 있다.',choices:[['슬라이딩 태클','press','성공 시 환호, 실패 시 카드 위험'],['따라붙기','safe','안전하게 지연'],['동료에게 맡김','pass','자리 유지']]},
    {min:78,title:'골키퍼와 1대1',text:'완벽한 침투. 골키퍼가 빠르게 각을 좁힌다.',choices:[['니어포스트 강슛','shoot','파워와 결정력'],['골키퍼 제치기','dribble','드리블과 침착성'],['옆 동료에게 패스','pass','도움 가능성이 높다']]},
    {min:88,title:'마지막 결정',text:'한 골이 필요한 시간. 박스 근처에서 볼을 잡았다.',choices:[['영웅이 된다','shoot','고위험 고보상'],['확실한 찬스를 만든다','pass','팀 플레이'],['시간을 번다','safe','리드를 지킬 때 효과적']]}
  ];
  const penalty={min:90,title:'추가시간 페널티킥',text:'모든 시선이 네게 쏠린다.',choices:[['구석으로 정확히','shoot','침착성이 중요'],['파넨카','dribble','엄청난 배짱이 필요'],['키커 양보','pass','팀 신뢰를 택한다']]};
  function createMoments(startMin=1,maxCount=8){let arr=templates.map(x=>JSON.parse(JSON.stringify(x))).filter(x=>x.min>=Math.max(1,startMin-2));if(Math.random()<.35)arr.push(JSON.parse(JSON.stringify(penalty)));return arr.sort((a,b)=>a.min-b.min).slice(0,maxCount)}
  function activeMoment(){const m=G.matchSession;if(!m||!m.v10Moments)return null;return m.v10Moments[m.v10MomentIndex||0]||null}

  const oldStart=Game.startMatch?.bind(Game);if(oldStart)Game.startMatch=function(){const r=oldStart(...arguments);const m=G.matchSession;if(m){m.v10Moments=createMoments(m.minute||1,m.left||8);m.v10MomentIndex=0;m.v10MomentResults=[];m.v10Resolved=false;V.safeSave();UI.show('match')}return r};


  const oldWC=Game.startWorldCupMatch?.bind(Game);if(oldWC)Game.startWorldCupMatch=function(){const r=oldWC(...arguments);const m=G.matchSession;if(m&&!m.v10Moments){m.v10Moments=createMoments(m.minute||1,m.left||8);m.v10MomentIndex=0;m.v10MomentResults=[];V.safeSave();UI.show('match')}return r};

  Game.resolveV10Moment=function(choiceIdx){const m=G.matchSession,mo=activeMoment();if(!m||!mo)return;const c=mo.choices[choiceIdx];if(!c)return;const type=c[1];m.minute=Math.max(m.minute||1,mo.min);let bonus=0;
    const keyMap={shoot:'shoot',pass:'pass',dribble:'dribble',press:'press',safe:'composure'};const key=keyMap[type];const attr=key==='pass'?((G.attrs.pass+G.attrs.vision)/2):key==='composure'?G.attrs.composure:(G.attrs[key]||G.ovr);
    const success=Math.random()*100 < Math.min(92,38+attr*.55+(G.form-50)*.25);
    if(success){bonus=.12;m.rating+=bonus;G.managerTrust=V.clamp(G.managerTrust+1);m.log?.push(`${mo.min}' ✅ ${mo.title}: ${c[0]} 성공.`)}else{m.rating=Math.max(5.5,m.rating-.08);m.log?.push(`${mo.min}' ❌ ${mo.title}: ${c[0]} 실패.`)}
    m.v10MomentResults.push({min:mo.min,title:mo.title,choice:c[0],success});m.v10MomentIndex=(m.v10MomentIndex||0)+1;
    const before=m.v10MomentIndex;
    try{if(typeof Game.matchAction==='function')Game.matchAction(type==='safe'?'safe':type)}catch(e){console.error('V10 underlying action',e)}
    if(G.matchSession){G.matchSession.v10MomentIndex=Math.max(before,G.matchSession.v10MomentIndex||0);G.matchSession.v10Moments=m.v10Moments;G.matchSession.v10MomentResults=m.v10MomentResults}
    V.safeSave();UI.show('match')};

  const oldUI=UI.match?.bind(UI);if(oldUI)UI.match=function(){oldUI();const m=G.matchSession;if(!m)return;const p=document.getElementById('page-match'),mo=activeMoment();if(!p)return;
    p.querySelectorAll('button[onclick^="Game.matchAction"]').forEach(b=>{b.style.display=mo?'none':''});
    if(mo&&!m.managerDemand){const first=p.querySelector('.panel');if(first)first.insertAdjacentHTML('afterbegin',`<div class="v10Moment"><div class="clock">${mo.min}'</div><h2>⚡ ${mo.title}</h2><p>${mo.text}</p><div class="v10ChoiceGrid">${mo.choices.map((c,i)=>`<button class="v10Choice" onclick="Game.resolveV10Moment(${i})"><b>${c[0]}</b><small>${c[2]}</small></button>`).join('')}</div><small class="muted" style="display:block;margin-top:8px">결정적 순간 ${Math.min((m.v10MomentIndex||0)+1,m.v10Moments.length)} / ${m.v10Moments.length}</small></div>`)}
    if(m.v10MomentResults?.length){const last=m.v10MomentResults.at(-1);const target=p.querySelector('.feed')||p.querySelector('.panel');if(target)target.insertAdjacentHTML('beforeend',`<div class="notice" style="margin-top:8px">최근 결정: ${last.min}' ${last.title} · <b>${last.choice}</b> · ${last.success?'성공 ✅':'실패 ❌'}</div>`)}
  };

  const oldAction=Game.matchAction?.bind(Game);if(oldAction)Game.matchAction=function(type){V.ensureState();const r=oldAction(...arguments);if(G.cheat?.infiniteFitness&&G.matchSession)G.matchSession.energy=100;V.safeSave();return r};
})();
