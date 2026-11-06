const OK=['asahotak','caklontong','cc-sd','family100','karakter-freefire','lengkapikalimat','maths','siapakahaku','susunkata','tebakbendera','tebakgambar','tebakheroml','tebaklagu','tebaktebakan','tebaklogo','tebakkartun'];
module.exports=async(req,res)=>{
  const g=String(req.query.g||'');
  if(!OK.includes(g))return res.status(400).json({status:false});
  try{
    const r=await fetch('https://api.jerexd.my.id/api/game/'+g+'?apikey='+process.env.JEREXD_KEY);
    const j=await r.json();
    res.setHeader('Cache-Control','no-store');
    res.status(200).json(j);
  }catch(e){res.status(502).json({status:false})}
};
