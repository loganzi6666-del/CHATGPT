// GitHub Pages asset patch for Football Life 4
// Same-face portrait base per character + scene-specific crops/tints so saved games never depend on fragile file paths.
window.FL_CHARACTER_PORTRAITS={
  seoyun:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=88",
  jia:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=88",
  harin:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=88",
  emma:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=88",
  sofia:"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=88",
  mia:"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=88"
};
window.FL_SCENE_LOOKS={
  profile:{size:"125%",pos:"50% 38%",shade:"linear-gradient(180deg,rgba(0,0,0,.02),rgba(0,0,0,.08))"},
  cafe:{size:"138%",pos:"47% 43%",shade:"linear-gradient(135deg,rgba(255,184,92,.14),rgba(0,0,0,.03))"},
  "night-date":{size:"145%",pos:"55% 36%",shade:"linear-gradient(135deg,rgba(23,66,135,.26),rgba(10,8,30,.16))"},
  shopping:{size:"132%",pos:"44% 34%",shade:"linear-gradient(135deg,rgba(255,139,197,.12),rgba(255,255,255,.04))"},
  vacation:{size:"150%",pos:"56% 45%",shade:"linear-gradient(135deg,rgba(75,195,255,.16),rgba(255,222,120,.12))"},
  stadium:{size:"140%",pos:"50% 31%",shade:"linear-gradient(135deg,rgba(40,255,150,.10),rgba(20,80,160,.18))"},
  home:{size:"136%",pos:"51% 48%",shade:"linear-gradient(135deg,rgba(255,214,161,.12),rgba(60,35,25,.12))"},
  argument:{size:"148%",pos:"43% 40%",shade:"linear-gradient(135deg,rgba(180,25,35,.18),rgba(10,10,10,.20))"},
  proposal:{size:"128%",pos:"54% 32%",shade:"linear-gradient(135deg,rgba(255,203,92,.16),rgba(245,120,180,.10))"},
  wedding:{size:"123%",pos:"50% 30%",shade:"linear-gradient(135deg,rgba(255,255,255,.20),rgba(255,198,224,.08))"},
  family:{size:"134%",pos:"49% 42%",shade:"linear-gradient(135deg,rgba(255,225,180,.15),rgba(115,190,255,.08))"}
};
characterSheet=function(id){return window.FL_CHARACTER_PORTRAITS[id]||window.FL_CHARACTER_PORTRAITS.harin;};
characterPhoto=function(id,scene){return characterSheet(id);};
characterSceneCSS=function(id,scene="profile"){
  const look=window.FL_SCENE_LOOKS[scene]||window.FL_SCENE_LOOKS.profile;
  const url=characterSheet(id);
  return `background-image:${look.shade},url('${url}');background-size:cover,${look.size};background-position:center,${look.pos};background-repeat:no-repeat;`;
};
badgePath=function(club){const colors=[["#65f3a4","#167149"],["#74b9ff","#234d77"],["#ff7b97","#7b1e35"],["#ffd66f","#8b6216"],["#bc91ff","#583285"],["#ffad62","#864819"]];const seed=[...club].reduce((a,c)=>a+c.charCodeAt(0),0);const [a,b]=colors[seed%colors.length];const ini=club.replace(/^FC\s+/i,"").split(/\s+/).map(x=>x[0]).join("").slice(0,3).toUpperCase();const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><path d="M20 12h88l12 16v48c0 22-16 34-56 46C24 110 8 98 8 76V28z" fill="url(#g)"/><circle cx="64" cy="48" r="22" fill="#ffffff22"/><text x="64" y="57" text-anchor="middle" font-family="Arial" font-size="24" font-weight="900" fill="#06120b">${ini}</text></svg>`;return "data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg);};
