(()=>{
  try{
    if(typeof G!=='undefined') window.G=G;
    if(typeof Game!=='undefined') window.Game=Game;
    if(typeof UI!=='undefined') window.UI=UI;
    if(typeof save!=='undefined') window.save=save;
    window.__FOOTBALL_LIFE_V10_BRIDGE__=true;
  }catch(e){
    console.error('[FOOTBALL LIFE 10 bridge]',e);
  }
})();
