(()=>{
  // FOOTBALL LIFE 9.6.1 - F4 Skill Point Cheat
  function refreshAfterCheat(){
    try{ if(typeof save==='function') save(); }catch(e){}
    try{ if(window.UI&&typeof UI.renderAll==='function') UI.renderAll(); }catch(e){}
  }

  function addSkillPoints(amount){
    amount=Math.floor(Number(amount));
    if(!Number.isFinite(amount)||amount<=0) return false;
    if(!window.G) return false;
    G.skillPoints=(Number(G.skillPoints)||0)+amount;
    refreshAfterCheat();
    try{
      if(window.UI&&typeof UI.toast==='function') UI.toast(`🧪 치트: 스킬 포인트 +${amount}`);
    }catch(e){}
    return true;
  }

  window.CheatMode={ addSkillPoints };

  window.addEventListener('keydown',e=>{
    if(e.key==='F4'||e.code==='F4'){
      e.preventDefault();
      e.stopPropagation();
      const current=window.G?(Number(G.skillPoints)||0):0;
      const value=window.prompt(`🧪 치트 모드\n추가할 스킬 포인트를 입력하세요.\n현재 보유: ${current}`, '5');
      if(value===null) return;
      const amount=Math.floor(Number(value));
      if(!Number.isFinite(amount)||amount<=0){
        window.alert('1 이상의 숫자를 입력해 주세요.');
        return;
      }
      if(!addSkillPoints(amount)) window.alert('게임 로딩 후 다시 F4를 눌러 주세요.');
    }
  },true);

  try{
    const brand=document.querySelector('.brand span');
    if(brand) brand.textContent='9.6.1';
  }catch(e){}
})();
