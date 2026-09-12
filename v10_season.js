(()=>{
  'use strict';if(window.__FOOTBALL_LIFE_V10_SEASON__)return;window.__FOOTBALL_LIFE_V10_SEASON__=true;
  const V=window.V10;if(!V||!window.Game||!window.UI)return;V.ensureState();
  const stepNames=['시상식','언론 평가','구단 면담','계약 협상','휴가','이적시장','프리시즌','등번호'];
  function snapshot(){return {year:G.year,club:G.club,apps:G.apps,goals:G.goals,assists:G.assists,ovr:G.ovr,marketValue:G.marketValue,form:G.form,awardScore:(typeof awardScore==='function'?awardScore():0),awards:JSON.parse(JSON.stringify(G.awards||{}))}}
  function finale(){return G.seasonFinale}
  const oldEnd=Game.processSeasonEnd?.bind(Game);if(oldEnd)Game.processSeasonEnd=function(){const snap=snapshot();if(G.cheat?.ballonCandidate&&G.stage!=='youth'){snap.awardScore=Math.max(Number(snap.awardScore)||0,250);snap.ballonCandidate=true;G.awardHistory=Array.isArray(G.awardHistory)?G.awardHistory:[];const mark=`${snap.year} 시즌 · 발롱도르 최종 후보 (CHEAT)`;if(!G.awardHistory.includes(mark))G.awardHistory.unshift(mark)}const r=oldEnd(...arguments);G.seasonFinale={active:true,step:0,season:snap.year,snapshot:snap,choices:[],summary:''};G.v10SeasonSnapshots.unshift(snap);G.v10SeasonSnapshots=G.v10SeasonSnapshots.slice(0,12);V.addHistory(`${snap.year} 시즌 피날레가 시작됐다.`);V.safeSave();return r};

  function resultText(f){const s=f.snapshot;return `${s.club} · ${s.apps}경기 ${s.goals}골 ${s.assists}도움 · 시즌 종료 OVR ${s.ovr}`}
  Game.seasonFinaleChoice=function(choice){const f=finale();if(!f?.active)return;const st=f.step;f.choices.push({step:st,choice});
    if(st===0){G.fans+=choice==='attend'?1500:300;G.mediaRep=V.clamp(G.mediaRep+(choice==='attend'?3:0));}
    if(st===1){if(choice==='humble'){G.mediaRep=V.clamp(G.mediaRep+2);G.managerTrust=V.clamp(G.managerTrust+2)}else if(choice==='bold'){G.fans+=3000;G.mediaRep=V.clamp(G.mediaRep+1)}else G.mediaRep=V.clamp(G.mediaRep-1)}
    if(st===2){if(choice==='role')G.managerTrust=V.clamp(G.managerTrust+3);if(choice==='transfer'){G.managerTrust=V.clamp(G.managerTrust-4);G.agentRep=V.clamp(G.agentRep+5)}if(choice==='wage')G.wage=Math.max(G.wage,Math.round(G.wage*1.08))}
    if(st===3){if(choice==='extend'){G.contractWeeks=Math.max(G.contractWeeks,156);G.wage=Math.max(G.wage,Math.round(G.wage*1.12));V.addHistory(`${G.club}과 재계약을 체결했다.`)}if(choice==='wait')G.agentRep=V.clamp(G.agentRep+3)}
    if(st===4){if(choice==='rest'){G.fitness=100;G.injuryRisk=0}if(choice==='train'){G.skillPoints+=1;G.fitness=V.clamp(G.fitness-8)}if(choice==='travel'){G.morale=100;G.money=Math.max(0,G.money-2000000)}}
    if(st===5){if(choice==='offers'&&G.stage==='player'&&typeof Game.generateOffers==='function')Game.generateOffers(false);if(choice==='stay')G.managerTrust=V.clamp(G.managerTrust+4)}
    if(st===6){if(choice==='fitness'){G.fitness=100;G.form=V.clamp(G.form+2)}if(choice==='tactics'){G.managerTrust=V.clamp(G.managerTrust+4)}if(choice==='skills')G.skillPoints+=1}
    if(st===7){G.jerseyNumber=String(choice);f.active=false;f.summary=`${f.season} 시즌 피날레 완료 · 새 시즌 등번호 ${G.jerseyNumber}`;V.addHistory(f.summary);V.toast('새 시즌 준비 완료!')}
    else f.step++;
    V.safeSave();V.refresh();UI.show('standings')};

  function stepBody(f){const s=f.snapshot;switch(f.step){
    case 0:return `<h1>🏆 ${f.season} 시즌 시상식</h1><p>${resultText(f)}</p><div class="awardGrid"><div class="awardCard"><div class="cup">⚽</div><b>${s.goals}골</b><small>시즌 득점</small></div><div class="awardCard"><div class="cup">🎯</div><b>${s.assists}도움</b><small>시즌 도움</small></div><div class="awardCard"><div class="cup">⭐</div><b>${s.awardScore}</b><small>${s.ballonCandidate?'발롱도르 후보 · ':''}스타 점수</small></div></div><div class="btnrow" style="margin-top:12px"><button class="btn gold" onclick="Game.seasonFinaleChoice('attend')">시상식 참석</button><button class="btn" onclick="Game.seasonFinaleChoice('skip')">조용히 마무리</button></div>`;
    case 1:return `<h1>📰 시즌 총평 인터뷰</h1><p>기자들이 네 시즌과 다음 목표를 묻는다.</p><div class="btnrow"><button class="btn green" onclick="Game.seasonFinaleChoice('humble')">팀 동료에게 공을 돌린다</button><button class="btn gold" onclick="Game.seasonFinaleChoice('bold')">다음 시즌 우승을 선언</button><button class="btn" onclick="Game.seasonFinaleChoice('quiet')">짧게 답한다</button></div>`;
    case 2:return `<h1>🏢 구단 면담</h1><p>감독과 단장이 네 역할과 미래를 논의한다.</p><div class="btnrow"><button class="btn green" onclick="Game.seasonFinaleChoice('role')">주전 역할 요구</button><button class="btn blue" onclick="Game.seasonFinaleChoice('wage')">연봉 인상 논의</button><button class="btn red" onclick="Game.seasonFinaleChoice('transfer')">이적 가능성 언급</button></div>`;
    case 3:return `<h1>📝 계약 협상</h1><p>현재 계약 ${G.contractWeeks||0}주 · 주급 €${G.wage||0}K</p><div class="btnrow"><button class="btn green" onclick="Game.seasonFinaleChoice('extend')">3년 재계약</button><button class="btn blue" onclick="Game.seasonFinaleChoice('wait')">시장 평가를 기다린다</button><button class="btn" onclick="Game.seasonFinaleChoice('none')">현 계약 유지</button></div>`;
    case 4:return `<h1>🏖️ 오프시즌 휴가</h1><p>회복과 성장 사이에서 선택한다.</p><div class="btnrow"><button class="btn green" onclick="Game.seasonFinaleChoice('rest')">완전 휴식</button><button class="btn blue" onclick="Game.seasonFinaleChoice('train')">개인 훈련</button><button class="btn gold" onclick="Game.seasonFinaleChoice('travel')">해외 여행</button></div>`;
    case 5:return `<h1>💼 여름 이적시장</h1><p>에이전트가 시장 분위기를 정리했다.</p><div class="btnrow"><button class="btn green" onclick="Game.seasonFinaleChoice('offers')">공식 오퍼 요청</button><button class="btn blue" onclick="Game.seasonFinaleChoice('stay')">잔류 선언</button><button class="btn" onclick="Game.seasonFinaleChoice('open')">열린 태도 유지</button></div>`;
    case 6:return `<h1>🏃 프리시즌 캠프</h1><p>새 시즌 준비의 마지막 핵심 선택.</p><div class="btnrow"><button class="btn green" onclick="Game.seasonFinaleChoice('fitness')">체력 캠프</button><button class="btn blue" onclick="Game.seasonFinaleChoice('tactics')">전술 적응</button><button class="btn gold" onclick="Game.seasonFinaleChoice('skills')">개인 기술 집중</button></div>`;
    default:return `<h1>👕 등번호 확정</h1><p>새 시즌에 사용할 번호를 선택한다.</p><div class="btnrow">${['7','9','10','11','18','23'].map(n=>`<button class="btn ${n==='10'?'gold':''}" onclick="Game.seasonFinaleChoice('${n}')">#${n}</button>`).join('')}</div>`}
  }

  const oldStand=UI.standings?.bind(UI);if(oldStand)UI.standings=function(){oldStand();const f=finale(),p=document.getElementById('page-standings');if(!p)return;if(f?.active){p.insertAdjacentHTML('afterbegin',`<div class="finaleHero"><span class="v10Badge">SEASON FINALE</span><div class="finaleStepper" style="margin:10px 0">${stepNames.map((n,i)=>`<div class="finaleStep ${i<f.step?'done':i===f.step?'now':''}">${i+1}. ${n}</div>`).join('')}</div>${stepBody(f)}</div>`)}}

  const oldAdvance=Game.advanceWeek?.bind(Game);if(oldAdvance)Game.advanceWeek=function(){if(G.seasonFinale?.active){UI.show('standings');V.toast('시즌 피날레 이벤트를 먼저 완료하세요.');return}return oldAdvance(...arguments)};
  V.safeSave();
})();
