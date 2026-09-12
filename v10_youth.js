(()=>{
  'use strict';if(window.__FOOTBALL_LIFE_V10_YOUTH__)return;window.__FOOTBALL_LIFE_V10_YOUTH__=true;
  const V=window.V10;if(!V||!window.Game||!window.UI)return;V.ensureState();
  const steps=['지역대회','전국대회','U17 대표팀','해외 스카우트','에이전트 첫 접촉','유럽 트라이얼','아카데미 계약','U19 승격','1군 벤치'];
  const rivals=['Lars de Jong','Mateo Silva','Noah Jensen','Tiago Mendes','Felix Krüger','Lucas van Dijk'];

  function state(){V.ensureState();const y=G.youthDrama;if(!y.localRival)y.localRival=rivals[Math.floor(Math.random()*rivals.length)];return y}
  function phaseIndex(){const y=state();if(y.firstTeamBench)return 8;if(y.u19Promotion)return 7;if(G.abroadAcademy)return 6;if(G.europeScout?.offer)return 6;if(G.europeScout?.trial||G.europeScout?.invites?.length)return 5;if(y.agentContact)return 4;if((G.europeScout?.exposure||0)>=35)return 3;if(y.u17Done)return 2;if(y.nationalDone)return 1;return 0}
  function log(s){const y=state();y.storyLog.unshift(`${G.year}.${String(G.month).padStart(2,'0')} · ${s}`);y.storyLog=y.storyLog.slice(0,20);V.addHistory(s)}

  Game.v10YouthChoice=function(type){const y=state();if(type==='language'){G.schoolBalance=V.clamp(G.schoolBalance+2);G.europeScout.language=V.clamp((G.europeScout.language||0)+5);y.homesickness=V.clamp(y.homesickness-2);log('방과 후 언어 수업을 선택했다.');}
    if(type==='dorm'){y.dormLife=V.clamp(y.dormLife+6);y.homesickness=V.clamp(y.homesickness-4);G.morale=V.clamp(G.morale+2);log('기숙사 동료들과 시간을 보내며 적응했다.');}
    if(type==='family'){y.homesickness=V.clamp(y.homesickness-8);G.parentSupport=V.clamp(G.parentSupport+2);G.morale=V.clamp(G.morale+2);log('가족과 길게 통화하며 마음을 다잡았다.');}
    if(type==='rival'){y.localRivalry=V.clamp(y.localRivalry+8);G.form=V.clamp(G.form+2);G.fitness=V.clamp(G.fitness-4);log(`${y.localRival}와 훈련장에서 강한 경쟁을 벌였다.`);}
    V.safeSave();V.refresh();if(document.getElementById('page-abroad')?.classList.contains('active'))UI.abroad()};

  Game.v10YouthTournament=function(kind){if(G.stage!=='youth')return V.toast('유소년 커리어에서만 가능합니다.');const y=state();if(G.fitness<45)return V.toast('컨디션이 부족합니다.');let score=(G.ovr||50)*.5+(G.form||50)*.25+(G.managerTrust||50)*.15+Math.random()*15;G.fitness=V.clamp(G.fitness-10);if(kind==='regional'&&!y.regionalDone){y.regionalDone=true;G.academyRep=V.clamp(G.academyRep+8);G.europeScout.exposure=V.clamp((G.europeScout.exposure||0)+8);log(`지역 유소년 대회에서 ${score>60?'두각을 나타냈다':'값진 경험을 쌓았다'}.`)}
    else if(kind==='national'&&y.regionalDone&&!y.nationalDone){y.nationalDone=true;G.academyRep=V.clamp(G.academyRep+12);G.europeScout.exposure=V.clamp((G.europeScout.exposure||0)+15);G.wonderkidRank=Math.max(1,G.wonderkidRank-8);log(`전국 유소년 대회에서 이름을 알렸다. 유망주 랭킹이 상승했다.`)}
    else return V.toast('아직 이 대회 단계가 열리지 않았습니다.');V.safeSave();V.refresh();V.toast('유소년 대회 이벤트 완료')};

  function weeklyDrama(){if(G.stage!=='youth')return;const y=state();
    if(!y.regionalDone&&G.academyRep>=52&&G.apps>=3){G.inbox.push(['🏟️ 지역 유소년 대회 초청','지역 최고 유망주들이 모이는 대회에 출전할 기회가 왔다.',['축구 유학 메뉴에서 도전','훈련 우선','부모와 상의']]);y.seasonMoments++;}
    if(y.regionalDone&&!y.nationalDone&&G.academyRep>=62&&G.apps>=6){G.inbox.push(['🇰🇷 전국 유소년 챔피언십','전국 무대 출전권을 확보했다. 유럽 스카우트도 현장을 찾는다.',['대회 집중','평소처럼','학업 우선']]);}
    if(y.nationalDone&&!y.u17Done&&G.age>=15&&G.nationalRep>=28){y.u17Done=true;G.internationalStatus='U17 대표팀 소집';G.nationalRep=V.clamp(G.nationalRep+8);log('대한민국 U17 대표팀에 처음 소집됐다.');G.inbox.push(['🇰🇷 U17 대표팀 첫 소집','태극마크를 달고 국제 유소년 경기에 나설 기회를 얻었다.',['소집 참가','클럽과 조율','부모님께 알린다']]);}
    if(!y.agentContact&&G.age>=15&&(G.academyRep>=68||(G.europeScout?.exposure||0)>=45)){y.agentContact=true;G.agentRep=Math.max(G.agentRep||0,12);log('유소년 전문 에이전트에게 첫 연락을 받았다.');G.inbox.push(['🤝 첫 에이전트 접촉','유럽 네트워크가 있는 유소년 에이전트가 가족과 미팅을 요청했다.',['미팅 수락','가족과 먼저 상의','조금 더 기다린다']]);}
    if(G.abroadAcademy){
      y.homesickness=V.clamp(y.homesickness+(Math.random()<.35?3:-1));y.dormLife=V.clamp(y.dormLife+(Math.random()<.55?1:-1));
      y.releaseRisk=V.clamp(28-(G.form-50)*.35-(G.europeScout.adaptation-50)*.25+(y.homesickness*.15),0,95);
      if(y.releaseRisk>=55&&Math.random()<.22)G.inbox.push(['⚠️ 아카데미 방출 경고',`코칭스태프가 최근 폼과 적응도를 우려한다. 방출 위험 ${Math.round(y.releaseRisk)}%.`,['훈련 강도 상승','코치와 면담','멘탈 관리']]);
      if(!y.u19Promotion&&G.age>=16&&G.ovr>=64&&G.form>=68&&G.europeScout.adaptation>=50){y.u19Promotion=true;G.youthTeam='U19';G.role=`U19 · ${G.pos} 경쟁`;G.managerTrust=V.clamp(G.managerTrust+5);log('좋은 성장세를 인정받아 U19 팀으로 조기 승격했다.');G.inbox.push(['⬆️ U19 조기 승격','아카데미가 연령을 뛰어넘는 승격을 결정했다.',['도전 수락','현재 팀에 집중','코치와 역할 협의']]);}
      if(!y.firstTeamBench&&G.age>=17&&G.ovr>=70&&G.form>=72&&G.managerTrust>=60){y.firstTeamBench=true;log('17세에 1군 훈련과 벤치 명단에 처음 포함됐다.');G.inbox.push(['🔥 1군 벤치 콜업',`17세 ${G.name}이(가) 1군 경기 명단에 포함됐다.`,['기회를 잡는다','긴장하지 않는다','선배에게 조언 요청']]);}
    }
  }

  const oldAdv=Game.advanceWeek?.bind(Game);if(oldAdv)Game.advanceWeek=function(){const r=oldAdv(...arguments);weeklyDrama();V.safeSave();V.refresh();return r};

  const oldAbroad=UI.abroad?.bind(UI);if(oldAbroad)UI.abroad=function(){oldAbroad();if(G.stage!=='youth')return;const p=document.getElementById('page-abroad');if(!p)return;const y=state(),idx=phaseIndex();p.insertAdjacentHTML('beforeend',`<div class="grid" style="margin-top:10px"><div class="c12 panel pad"><div class="title"><h2>🎬 유소년 커리어 드라마</h2><span class="pill">${steps[idx]}</span></div><div class="v10StoryPath">${steps.map((s,i)=>`<div class="v10StoryStep ${i<idx?'done':i===idx?'now':''}"><b>${i<idx?'✓ ':''}${sM</b><small>${i<idx?'완료':i===idx?'현재 목표':'잠금'}</small></div>`).join('')}</div></div><div class="c7 panel pad"><div class="title"><h2>${G.abroadAcademy?'유럽 생활 관리':'국내 유소년 무대'}</h2></div>${G.abroadAcademy?`<div class="academyGrid"><div class="academyCard"><small>기숙사 적응</small><b>${Math.round(y.dormLife)}</b></div><div class="academyCard"><small>향수병</small><b>${Math.round(y.homesickness)}</b></div><div class="academyCard"><small>방출 위험</small><b>${Math.round(y.releaseRisk)}%</b></div><div class="academyCard"><small>현지 라이벌</small><b style="font-size:14px">${y.localRival}</b></div></div><div class="btnrow" style="margin-top:10px"><button class="btn blue" onclick="Game.v10YouthChoice('language')">언어 수업</button><button class="btn green" onclick="Game.v10YouthChoice('dorm')">기숙사 교류</button><button class="btn" onclick="Game.v10YouthChoice('family')">가족 통화</button><button class="btn red" onclick="Game.v10YouthChoice('rival')">라이벌과 경쟁</buttton></div>`:`<div class="notice">국내에서 대회성적을 쌓으면 지역 → 전국 → U17 → 해외 스카우트 순서로 커리어가 열린다.</div><div class="btnrow" style="margin-top:10px"><button class="btn green" onclick="Game.v10YouthTournament('regional')">지역대회 도전</button><button class="btn gold" onclick="Game.v10YouthTournament('national')">전국대회 도전</button></div>`}</div><div class="c5 panel pad"><div class="title"><h2>스토리 기록</h2></div>${y.storyLog.slice(0,8).map(s=>`<div class="stat"><span>${s}</span></div>`).join('')||'<div class="notice">아직 특별한 유소년 스토리가 없습니다.</div>'}</div></div>`)};
  V.safeSave();
})();
