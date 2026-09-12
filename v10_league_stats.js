(()=>{
  'use strict';
  if(window.__FOOTBALL_LIFE_V10_LEAGUE_STATS__) return;
  window.__FOOTBALL_LIFE_V10_LEAGUE_STATS__=true;
  const V=window.V10;
  if(!V || typeof G==='undefined' || typeof Game==='undefined' || typeof UI==='undefined') return;

  const profiles={
    KOR:{league:'K리그1', youth:'K리그 주니어', names:['김민준','이준서','박시우','최도윤','정우진','강민재','윤지호','한서준','조현우','임도현','송재민','배준혁','오승민','문태윤','신유찬','권민석','백승호','장우빈']},
    NED:{league:'Eredivisie', youth:'네덜란드 아카데미 리그', names:['Daan de Vries','Sem van Dijk','Finn Jansen','Luuk Verhoeven','Mees Smit','Bram de Boer','Thijs Visser','Noud Bakker','Jens van Leeuwen','Lars Vos','Milan Bos','Stijn Kuipers','Timo de Jong','Ruben Mulder','Sven Meijer','Koen van der Meer','Jesse Dekker','Wout Hendriks']},
    BEL:{league:'Jupiler Pro League', youth:'벨기에 엘리트 유스 리그', names:['Jules Peeters','Milan Vermeulen','Mathis Claes','Lucas Maes','Arthur Willems','Noah Jacobs','Louis De Smet','Victor Goossens','Seppe Wouters','Ruben De Vos','Mats Verhoeven','Niels Aerts','Lars Vercauteren','Tibo Hermans','Bram Coppens','Jarne Lemmens','Senne Michiels','Robbe Van Damme']},
    AUT:{league:'Austrian Bundesliga', youth:'오스트리아 아카데미 리그', names:['Lukas Gruber','Felix Hofer','Jonas Leitner','Maximilian Berger','David Steiner','Simon Moser','Paul Huber','Jakob Eder','Florian Pichler','Tobias Fuchs','Niklas Schmid','Matthias Winkler','Leon Haas','Julian Auer','Fabian Mayr','Moritz Reiter','Daniel Koller','Samuel Egger']},
    GER:{league:'Bundesliga', youth:'독일 U19 분데스리가', names:['Lukas Schneider','Jonas Weber','Felix Bauer','Leon Fischer','Max Hoffmann','Paul Wagner','Noah Becker','Finn Schäfer','Elias Koch','Moritz Richter','Julian Klein','Nico Wolf','Tim Neumann','David Krüger','Ben Hartmann','Tom Lehmann','Jan Vogel','Mika Braun']},
    POR:{league:'Liga Portugal', youth:'포르투갈 유소년 리그', names:['João Martins','Tiago Silva','Gonçalo Costa','Rodrigo Ferreira','Diogo Almeida','Rafael Sousa','Tomás Pereira','Miguel Rocha','Afonso Carvalho','Duarte Lopes','Francisco Correia','André Pinto','Pedro Mendes','Nuno Ribeiro','Guilherme Teixeira','Vasco Moreira','Martim Santos','Henrique Gomes']},
    ENG:{league:'Premier League', youth:'잉글랜드 아카데미 리그', names:['Oliver Bennett','Jack Thompson','Alfie Walker','Harry Collins','Charlie Hughes','George Wilson','Leo Carter','Archie Roberts','Theo Cooper','Oscar Mitchell','Finley Evans','James Parker','Freddie Turner','Samuel Wright','Tommy Harrison','Elliot Morgan','Jacob Foster','Louis Bailey']},
    ESP:{league:'LaLiga', youth:'스페인 유소년 리그', names:['Alejandro Martín','Hugo García','Pablo Ruiz','Diego Navarro','Mateo Romero','Iker Santos','Álvaro Torres','Sergio Molina','Adrián Vega','Nico Herrera','Marcos Castillo','Iván Ortega','Javier León','Daniel Ramos','Mario Prieto','Álex Cabrera','Bruno Vidal','Raúl Medina']}
  };

  function detectKey(){
    const c=String(G.club||'').toLowerCase();
    const a=String(G.abroadAcademy||'').toLowerCase();
    if(c.includes('psv')||c.includes('ajax')||c.includes('feyenoord')||c.includes('az ')||c.includes('az alkmaar')||a==='psv'||a==='ajax'||a==='feyenoord'||a==='az') return 'NED';
    if(c.includes('genk')||a==='genk') return 'BEL';
    if(c.includes('salzburg')||c.includes('rapid wien')||c.includes('austria wien')||c.includes('sturm graz')||a==='salzburg') return 'AUT';
    if(c.includes('dortmund')||c.includes('bayern')||c.includes('leverkusen')||c.includes('leipzig')||c.includes('frankfurt')||a==='dortmund') return 'GER';
    if(c.includes('sporting')||c.includes('benfica')||c.includes('porto')||c.includes('braga')||a==='sporting'||a==='benfica') return 'POR';
    if(c.includes('tottenham')||c.includes('arsenal')||c.includes('liverpool')||c.includes('manchester')||c.includes('chelsea')) return 'ENG';
    if(c.includes('barcelona')||c.includes('real madrid')||c.includes('atletico')||c.includes('sevilla')) return 'ESP';
    return 'KOR';
  }
  function profile(){const k=detectKey(),p=profiles[k];return {key:k,...p,title:G.stage==='youth'?p.youth:p.league}}
  function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return Math.abs(h>>>0)}
  function playedGames(){return Math.max(Number(G.apps)||0,...(Array.isArray(G.leagueTable)?G.leagueTable.map(x=>Number(x.p)||0):[0]))}
  function leagueClubs(){const arr=(Array.isArray(G.leagueTable)?G.leagueTable.map(x=>x.club):[]).filter(Boolean);return arr.length?arr:[G.club]}

  function initNpcStats(force=false){
    const p=profile();
    const key=`${p.key}|${G.stage}|${G.year}`;
    if(!force && G.leaguePlayerStats && G.leaguePlayerStats.key===key && Array.isArray(G.leaguePlayerStats.players)) return;
    const games=playedGames(), clubs=leagueClubs(), names=p.names.filter(n=>n!==G.name).slice(0,16);
    const players=names.map((name,i)=>{
      const seed=hash(`${name}|${G.year}|${p.key}`);
      const role=i%5===0?'ST':i%5===1?'RW':i%5===2?'CAM':i%5===3?'LW':'CM';
      const goalRate=role==='ST'?.58:role==='RW'||role==='LW'?.38:role==='CAM'?.28:.16;
      const assistRate=role==='CAM'?.46:role==='RW'||role==='LW'?.36:role==='CM'?.32:.18;
      const jitter=((seed%100)/100-.5);
      return {name,club:clubs[i%clubs.length],pos:role,apps:games,goals:Math.max(0,Math.floor(games*(goalRate+jitter*.16))),assists:Math.max(0,Math.floor(games*(assistRate-jitter*.12)))};
    });
    G.leaguePlayerStats={key,players,lastUpdateWeek:G.week||0};
    const personalKey=`${p.key}|${G.stage}|${G.year}`;
    if(G.leaguePersonalKey!==personalKey){
      const firstTime=!G.leaguePersonalKey;
      G.leaguePersonalKey=personalKey;
      G.leagueGoals=firstTime?(Number(G.goals)||0):0;
      G.leagueAssists=firstTime?(Number(G.assists)||0):0;
      G.leagueApps=firstTime?(Number(G.apps)||0):0;
    }
  }

  function syncLocalPeople(){
    const p=profile();
    const key=`${p.key}|${G.club}|${G.youthTeam||''}|${G.stage}`;
    if(G.localPeopleKey===key) return;
    const n=p.names.filter(x=>x!==G.name);
    const oldComp=Array.isArray(G.positionCompetitors)?G.positionCompetitors:[];
    G.positionCompetitors=n.slice(0,4).map((name,i)=>({name,ovr:oldComp[i]?.ovr??Math.max(45,(Number(G.ovr)||52)+2-i*2),form:oldComp[i]?.form??(55+i*3)}));
    const oldVals=Object.values(G.locker||{});
    G.locker={
      [`주장 ${n[4]}`]:oldVals[0]??58,
      [`윙어 ${n[5]}`]:oldVals[1]??55,
      [`수비수 ${n[6]}`]:oldVals[2]??52,
      [`미드필더 ${n[7]}`]:oldVals[3]??50
    };
    if(G.lockerV10 && typeof G.lockerV10==='object'){
      const names=Object.keys(G.locker), vals=Object.values(G.locker);
      G.lockerV10.relations={};names.forEach((x,i)=>G.lockerV10.relations[x]=vals[i]);
      G.lockerV10.captain=names[0];G.lockerV10.bestFriend=names[1];G.lockerV10.rival=names[2];G.lockerV10.coachFavorite=names[3];
    }
    if(typeof G.rival==='string') G.rival=n[8];
    else if(G.rival&&typeof G.rival==='object') G.rival.name=n[8];
    G.localPeopleKey=key;
  }

  function ensure(){initNpcStats(false);syncLocalPeople()}
  function advanceNpcStats(){
    initNpcStats(false);const list=G.leaguePlayerStats.players;if(!list.length)return;
    const goalEvents=2+Math.floor(Math.random()*4), assistEvents=Math.max(1,goalEvents-1);
    for(let i=0;i<list.length;i++)list[i].apps=(Number(list[i].apps)||0)+1;
    for(let i=0;i<goalEvents;i++){
      const idx=Math.floor(Math.pow(Math.random(),1.45)*list.length);list[idx].goals=(list[idx].goals||0)+1;
    }
    for(let i=0;i<assistEvents;i++){
      const idx=Math.floor(Math.pow(Math.random(),1.25)*list.length);list[idx].assists=(list[idx].assists||0)+1;
    }
    G.leaguePlayerStats.lastUpdateWeek=G.week||0;
  }
  function allPlayers(){
    ensure();const list=(G.leaguePlayerStats.players||[]).map(x=>({...x}));
    list.push({name:G.name,club:G.club,pos:G.pos,apps:Number(G.leagueApps)||0,goals:Number(G.leagueGoals)||0,assists:Number(G.leagueAssists)||0,me:true});
    return list;
  }
  function leaders(stat){return allPlayers().sort((a,b)=>(b[stat]||0)-(a[stat]||0)||(b.apps||0)-(a.apps||0)||a.name.localeCompare(b.name)).slice(0,10)}
  function myRank(stat){const all=allPlayers().sort((a,b)=>(b[stat]||0)-(a[stat]||0)||(b.apps||0)-(a.apps||0));return all.findIndex(x=>x.me)+1}
  function tableHTML(stat,label,icon){
    const rows=leaders(stat);return `<div class="c6 panel pad"><div class="title"><h2>${icon} ${label} 순위</h2><span class="pill">${profile().title}</span></div><div class="tableWrap"><table><thead><tr><th>#</th><th>선수</th><th>팀</th><th>경기</th><th>${label}</th></tr></thead><tbody>${rows.map((r,i)=>`<tr class="${r.me?'me':''}"><td>${i+1}</td><td><b>${r.name}</b>${r.me?' <span class="pill">ME</span>':''}</td><td>${r.club}</td><td>${r.apps||0}</td><td><b>${r[stat]||0}</b></td></tr>`).join('')}</tbody></table></div><div class="stat"><span>내 현재 순위</span><b>${myRank(stat)}위 · ${stat==='goals'?(G.leagueGoals||0):(G.leagueAssists||0)}${stat==='goals'?'골':'도움'}</b></div></div>`}

  const oldUpdateLeague=Game.updateLeague?.bind(Game);
  if(oldUpdateLeague) Game.updateLeague=function(){ensure();const r=oldUpdateLeague(...arguments);advanceNpcStats();V.safeSave();return r};

  const oldFinish=Game.finishMatch?.bind(Game);
  if(oldFinish) Game.finishMatch=function(){
    ensure();const m=G.matchSession?{international:!!G.matchSession.international,comp:String(G.matchSession.comp||''),goals:Number(G.matchSession.goals)||0,assists:Number(G.matchSession.assists)||0}:null;
    const isLeague=!!(m&&!m.international&&!m.comp.includes('Champions')&&!m.comp.includes('Europa')&&!m.comp.includes('ACL')&&!m.comp.includes('Cup')&&!m.comp.includes('컵'));
    const r=oldFinish(...arguments);
    if(isLeague){G.leagueApps=(Number(G.leagueApps)||0)+1;G.leagueGoals=(Number(G.leagueGoals)||0)+m.goals;G.leagueAssists=(Number(G.leagueAssists)||0)+m.assists;V.safeSave()}
    return r;
  };

  const oldSeasonEnd=Game.processSeasonEnd?.bind(Game);
  if(oldSeasonEnd) Game.processSeasonEnd=function(){
    const p=profile();const snapshot={year:G.year,league:p.title,goalRank:myRank('goals'),assistRank:myRank('assists'),goals:G.leagueGoals||0,assists:G.leagueAssists||0};
    G.leagueRankingHistory=Array.isArray(G.leagueRankingHistory)?G.leagueRankingHistory:[];G.leagueRankingHistory.unshift(snapshot);G.leagueRankingHistory=G.leagueRankingHistory.slice(0,12);
    const r=oldSeasonEnd(...arguments);G.leaguePlayerStats=null;G.leaguePersonalKey=null;G.leagueGoals=0;G.leagueAssists=0;G.leagueApps=0;V.safeSave();return r;
  };

  const oldStandings=UI.standings?.bind(UI);
  if(oldStandings) UI.standings=function(){
    ensure();oldStandings();const page=document.getElementById('page-standings');if(!page)return;
    const p=profile();const h=page.querySelector('.title h2');if(h)h.textContent=`${p.title} 순위`;
    const tag=page.querySelector('.competitionTag');if(tag)tag.textContent=`🏆 ${p.title}`;
    const grid=page.querySelector('.grid');if(grid)grid.insertAdjacentHTML('beforeend',tableHTML('goals','득점','⚽')+tableHTML('assists','도움','🅰️'));
  };

  const oldHome=UI.home?.bind(UI);
  if(oldHome) UI.home=function(){
    ensure();oldHome();const page=document.getElementById('page-home');if(!page)return;
    const cards=page.querySelectorAll('.panel');
    const star=[...cards].find(x=>x.querySelector('h2')?.textContent?.includes('스타 경쟁'));
    if(star){star.insertAdjacentHTML('beforeend',`<div class="stat"><span>리그 득점 순위</span><b>${myRank('goals')}위 · ${G.leagueGoals||0}골</b></div><div class="stat"><span>리그 도움 순위</span><b>${myRank('assists')}위 · ${G.leagueAssists||0}도움</b></div>`)}
  };

  const oldManager=UI.manager?.bind(UI);
  if(oldManager) UI.manager=function(){ensure();oldManager()};
  const oldRenderAll=UI.renderAll?.bind(UI);
  if(oldRenderAll) UI.renderAll=function(){ensure();return oldRenderAll(...arguments)};

  window.V10LeagueStats={profile,leaders,myRank,ensure,reset(){G.leaguePlayerStats=null;G.leaguePersonalKey=null;ensure();V.safeSave();UI.renderAll()}};
  ensure();V.safeSave();
  try{const brand=document.querySelector('.brand span');if(brand)brand.textContent='10.2';document.title='FOOTBALL LIFE 10.2'}catch(e){}
})();