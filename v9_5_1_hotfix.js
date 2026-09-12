(()=>{
  const clone=v=>JSON.parse(JSON.stringify(v));
  const base=typeof initialState==='function'?initialState():{};
  for(const [k,v] of Object.entries(base)) if(G[k]===undefined||G[k]===null) G[k]=clone(v);
  const arrays=['history','watched','inventory','inbox','news','fixtures','achievements','seasonObjectives','sponsorOffers','transferOffers','awardHistory','managerLog','scoutReports','loanOffers','transferHistory','continentalHistory','careerTrophies'];
  arrays.forEach(k=>{if(!Array.isArray(G[k]))G[k]=clone(base[k]||[])});
  const objects=['attrs','locker','awards','clubStats','coachCareer'];
  objects.forEach(k=>{if(!G[k]||typeof G[k]!=='object'||Array.isArray(G[k]))G[k]=clone(base[k]||{});else G[k]=Object.assign(clone(base[k]||{}),G[k])});
  if(!Array.isArray(G.positionCompetitors))G.positionCompetitors=['김태윤','박시후','정민재','이도현'].map((n,i)=>({name:n,ovr:Math.max(45,(G.ovr||52)+2-i*2),form:55+i*3}));
  if(!Array.isArray(G.leagueTable)||!G.leagueTable.length)G.leagueTable=(G.stage==='youth'?youthStandingsBase:standingsBase).map(r=>({club:r[0],pts:r[1]||0,p:r[2]||0,w:r[3]||0,d:r[4]||0,l:r[5]||0,gf:r[6]||0,ga:r[7]||0}));
  G.skillPoints=Math.max(0,Number(G.skillPoints)||0);G.money=Math.max(0,Number(G.money)||0);G.fitness=clamp(Number(G.fitness)||0);G.ovr=Number(G.ovr)||52;G.form=Number(G.form)||60;G.managerTrust=Number(G.managerTrust)||55;G.academyRep=Number(G.academyRep)||45;

  function krw(v){v=Math.max(0,Math.round(Number(v)||0));const eok=Math.floor(v/100000000),man=Math.floor((v%100000000)/10000),won=v%10000;if(eok>0)return man>0?`${eok.toLocaleString('ko-KR')}억 ${man.toLocaleString('ko-KR')}만원`:`${eok.toLocaleString('ko-KR')}억원`;if(man>0)return won>0?`${man.toLocaleString('ko-KR')}만 ${won.toLocaleString('ko-KR')}원`:`${man.toLocaleString('ko-KR')}만원`;return `${v.toLocaleString('ko-KR')}원`}
  try{money=krw}catch(e){window.money=krw}

  const statLabels=document.querySelectorAll('.headerStats small');if(statLabels[2])statLabels[2].textContent='자산';
  const brand=document.querySelector('.brand span');if(brand)brand.textContent='9.5.1';

  const previousTop=UI.renderTop.bind(UI);
  UI.renderTop=function(){
    previousTop();
    const third=document.querySelectorAll('.headerStats small')[2];if(third)third.textContent='자산';
    if(typeof topMoney!=='undefined'&&topMoney)topMoney.textContent=krw(G.money);
    const sb=document.getElementById('badge-skill');if(sb){sb.textContent=G.skillPoints>9?'9+':G.skillPoints;sb.classList.toggle('show',G.skillPoints>0)}
    const ib=document.getElementById('badge-inbox');if(ib){const n=Array.isArray(G.inbox)?G.inbox.length:0;ib.textContent=n>9?'9+':n;ib.classList.toggle('show',n>0)}
  };

  const pageNames=['home','inbox','match','development','career','standings','transfer','manager','agent','national','life','shopping','retire','settings'];
  pageNames.forEach(name=>{
    const fn=UI[name];if(typeof fn!=='function')return;
    UI[name]=function(...args){
      const target=document.querySelector('#page-'+name);
      try{
        const out=fn.apply(UI,args);
        if(target&&!target.innerHTML.trim()) throw new Error('empty render');
        return out;
      }catch(err){
        console.error('[FL9.5.1 render repair]',name,err);
        if(target)target.innerHTML=`<div class="panel pad"><div class="title"><h2>화면 자동 복구</h2><span class="pill">9.5.1</span></div><div class="notice">이전 세이브 데이터 일부가 맞지 않아 <b>${name}</b> 화면을 복구했습니다. 커리어 데이터는 유지됩니다.</div><div class="btnrow" style="margin-top:12px"><button class="btn green" onclick="UI.show('home')">홈으로</button><button class="btn blue" onclick="Game.repairSave951()">세이브 재정리</button></div></div>`;
      }
    }
  });

  Game.repairSave951=function(){
    const fresh=initialState();for(const [k,v] of Object.entries(fresh))if(G[k]===undefined||G[k]===null)G[k]=clone(v);
    save();UI.renderTop();UI.show('home');UI.toast('세이브 구조를 재정리했습니다.');
  };

  try{if(typeof Game.updateSelection==='function')Game.updateSelection()}catch(e){console.warn(e)}
  save();
  UI.renderTop();
  const active=(document.querySelector('.nav button.active')||{}).dataset?.page||'home';
  UI.show(active);
})();