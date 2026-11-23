(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
// menu na mobilu
var tl=$('.menu-tl'),nav=$('#hl-nav');
if(tl)tl.addEventListener('click',function(){var o=nav.classList.toggle('otevrene');tl.setAttribute('aria-expanded',o)});
$$('#hl-nav a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('otevrene')})});
// tmavý / světlý režim
var tt=$('.tema-tl'),de=document.documentElement,mt=$('meta[name=theme-color]');
var tema=function(t,ul){de.dataset.tema=t;if(tt){tt.setAttribute('aria-pressed',t==='dark');tt.setAttribute('aria-label',t==='dark'?'Přepnout na světlý režim':'Přepnout na tmavý režim')}if(mt)mt.content=t==='dark'?'#190f12':'#fcefea';if(ul)try{localStorage.setItem('tema',t)}catch(e){}};
tema(de.dataset.tema||'light',false);
if(tt)tt.addEventListener('click',function(){tema(de.dataset.tema==='dark'?'light':'dark',true)});
// interaktivní mapa: načte se, až se sekce objeví (nebo po kliknutí)
var mp=$('#mapa'),mb=$('[data-nacti-mapu]'),mapaOn=function(){if(mp.querySelector('iframe'))return;var i=document.createElement('iframe');i.src=mp.getAttribute('data-src');i.title='Interaktivní mapa: Slim Nest Beauty, Křídlovická 43/24, Brno';i.loading='lazy';mp.innerHTML='';mp.appendChild(i)};
if(mb)mb.addEventListener('click',mapaOn);
if(mp&&'IntersectionObserver' in window&&matchMedia('(hover:hover)').matches){var mo=new IntersectionObserver(function(z){if(z[0].isIntersecting){mapaOn();mo.disconnect()}},{rootMargin:'200px'});mo.observe(mp)}
// přepínač služeb
var taby=$$('.vyber-menu [role=tab]');
taby.forEach(function(t){t.addEventListener('click',function(){taby.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);$('#'+x.getAttribute('aria-controls')).hidden=!on})})});
// konfigurátor poukazu
var f=$('#konf');
if(f){
 var karta=$('#karta'),fmt=function(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' Kč'};
 var v=function(n){var e=f.elements[n];return e&&e.value!==undefined?e.value:''};
 var obsah=function(){
  var druh=v('druh'),text;
  if(druh==='hodnota'){var c=v('castka');text=c==='jina'?(parseInt(v('jina'),10)?fmt(parseInt(v('jina'),10)):'Vaše částka'):fmt(c)}
  else text=v('osetreni');
  return text};
 var kresli=function(){
  var druh=v('druh');
  $$('[data-druh]',f).forEach(function(b){b.hidden=b.getAttribute('data-druh')!==druh});
  $('[data-jina]',f).hidden=!(druh==='hodnota'&&v('castka')==='jina');
  karta.className='karta karta-'+v('vzhled');
  $('#k-hodnota').textContent=obsah();
  $('#k-komu').textContent=v('komu')?'Pro '+v('komu'):'Pro vás';
  $('#k-venovani').textContent=v('venovani')||' ';
  $('#k-od').textContent=v('od')?'Od '+v('od'):''};
 var ob=$('.karta-obal');if(ob&&matchMedia('(hover:hover)').matches){ob.addEventListener('pointermove',function(e){var r=ob.getBoundingClientRect();karta.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*8+'deg');karta.style.setProperty('--rx',(.5-(e.clientY-r.top)/r.height)*8+'deg')});ob.addEventListener('pointerleave',function(){karta.style.setProperty('--rx','0deg');karta.style.setProperty('--ry','0deg')})}
 f.addEventListener('input',kresli);f.addEventListener('change',kresli);kresli();
 var pl=$('#platba'),bez=function(t){return t.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^A-Za-z0-9 .,\-]/g,'')};
 var qrKreslit=function(txt){var cv=$('#p-qr'),go=function(){var q=qrcode(0,'M');q.addData(txt);q.make();var n=q.getModuleCount(),px=Math.floor(200/(n+4)),w=px*(n+4);cv.width=cv.height=w;var c=cv.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,w,w);c.fillStyle='#1f1613';for(var r=0;r<n;r++)for(var k=0;k<n;k++)if(q.isDark(r,k))c.fillRect((k+2)*px,(r+2)*px,px,px)};
  if(window.qrcode)return go();var s=document.createElement('script');s.src=f.getAttribute('data-qr');s.onload=go;document.head.appendChild(s)};
 var objednavka=function(vs){return ['Dobrý den,','','objednávám dárkový poukaz:','Na: '+obsah(),'Vzhled: '+({cerny:'černo-zlatý',perlovy:'perleťový',vino:'vínově zlatý'}[v('vzhled')]||'pudrově růžový'),'Pro koho: '+(v('komu')||'-'),'Od koho: '+(v('od')||'-'),'Věnování: '+(v('venovani')||'-'),'Převzetí: '+v('predani'),'Variabilní symbol platby: '+vs,'Kontakt na mě: '+(v('email')||'-'),'','Děkuji'].join('\n')};
 f.addEventListener('submit',function(e){e.preventDefault();
  var st=$('.formular-stav',f),em=v('email'),hodnota=v('druh')==='hodnota';
  if(hodnota&&v('castka')==='jina'&&!parseInt(v('jina'),10)){st.textContent='Doplňte prosím částku.';return}
  if(!em||em.indexOf('@')<1){st.textContent='Doplňte prosím e-mail, na který poukaz pošleme.';return}
  var d=new Date(),vs=String(d.getFullYear()).slice(2)+('0'+(d.getMonth()+1)).slice(-2)+('0'+d.getDate()).slice(-2)+String(Math.floor(1000+Math.random()*9000));
  var kc=hodnota?(v('castka')==='jina'?parseInt(v('jina'),10):parseInt(v('castka'),10)):0;
  var iban=f.getAttribute('data-iban'),ucet=f.getAttribute('data-ucet'),demo=!iban;
  if(demo){iban='CZ6508000000192000145399';ucet='19-2000145399/0800 (vzor)'}
  var zpr='Poukaz '+bez(v('komu')||'Slim Nest Beauty');
  var spd='SPD*1.0*ACC:'+iban+(kc?'*AM:'+kc.toFixed(2):'')+'*CC:CZK*X-VS:'+vs+'*RN:'+bez(f.getAttribute('data-prijemce')).toUpperCase().slice(0,35)+'*MSG:'+zpr.toUpperCase().slice(0,60);
  $('#p-ucet').textContent=ucet;$('#p-castka').textContent=kc?fmt(kc):'podle ceníku ošetření, potvrdíme e-mailem';$('#p-vs').textContent=vs;$('#p-zprava').textContent=zpr;
  $('#p-mail').textContent=' '+em;$('#p-demo').hidden=!demo;
  $('#p-mailto').href='mailto:'+f.getAttribute('data-email')+'?subject='+encodeURIComponent('Objednávka dárkového poukazu '+vs)+'&body='+encodeURIComponent(objednavka(vs));
  qrKreslit(spd);f.hidden=true;pl.hidden=false;pl.focus();pl.scrollIntoView({behavior:'smooth',block:'start'})});
 $('#p-zpet').addEventListener('click',function(){pl.hidden=true;f.hidden=false;f.scrollIntoView({behavior:'smooth',block:'start'})});
}
// kontaktní formulář (ukázka)
$$('form.formular').forEach(function(fm){var st=$('.formular-stav',fm);fm.addEventListener('submit',function(e){e.preventDefault();if($('.past input',fm).value)return;
 var endpoint=fm.getAttribute('data-endpoint'),demo=fm.getAttribute('data-demo')==='1';
 if(demo||!endpoint){st.textContent='Ukázka formuláře: nic se neodesílá. Po spuštění webu bude zpráva doručena na e-mail firmy.';return}
 st.textContent='Odesílám…';fetch(endpoint,{method:'POST',body:new FormData(fm),headers:{Accept:'application/json'}}).then(function(r){if(!r.ok)throw 0;fm.reset();st.textContent='Děkujeme, zpráva byla odeslána.'}).catch(function(){st.textContent='Odeslání se nepodařilo. Napište nám prosím e-mailem.'})})});
// ukázkový asistent: odpovědi jen z textů webu
var panel=$('#ai-panel');
if(panel){
 var okno=$('#ai-okno'),rychle=$('#ai-rychle');
 var odp=[
  {k:['ems','emsko','sval','postav','tvarov'],q:'Co je EMS?',a:'EMS procedura (EMSko) je intenzivní svalová aktivace. Zpevňuje postavu, podporuje lymfatický systém, napomáhá spalování tuků a přináší efekt srovnatelný s výrazně delším tréninkem.'},
  {k:['hifu','zpevn','kolagen','kontur','tuk'],q:'Co dělá HIFU?',a:'HIFU je neinvazivní ošetření, které tvaruje kontury, zpevňuje pokožku a podporuje přirozenou tvorbu kolagenu. Cíleně působí i na tukové buňky v hlubších vrstvách, které tělo postupně odbourá přirozenou cestou přes lymfatický systém.'},
  {k:['slimflow','lymf','drenáž','drenaz','otok'],q:'Co je SlimFlow?',a:'SlimFlow je přístrojová lymfodrenáž nové generace.'},
  {k:['poukaz','dárek','darek','darov','vánoc','narozen'],q:'Dárkový poukaz',a:'Poukaz lze vystavit na konkrétní ošetření nebo na libovolnou hodnotu. Je přenosný a má stanovenou dobu platnosti. Vystavit ho můžeme osobně na recepci nebo v tištěném provedení. Na tomto webu si ho můžete rovnou sestavit v sekci Dárkový poukaz.'},
  {k:['kde','adres','parkov','auto','najdu','dojet'],q:'Kde Vás najdu?',a:'Křídlovická 43/24, 603 00 Brno-Staré Brno. Parkování je přímo u budovy.'},
  {k:['plat','kart','hotov','benefit','pluxee','qr'],q:'Jak mohu platit?',a:'Hotově, přes NFC (telefon), QR kódem, a také Benefit Plus a Pluxee.'},
  {k:['objedn','rezerv','termín','termin','kontakt','telefon','mail'],q:'Jak se objednat?',a:'Napište přes formulář dole na stránce nebo na slimnestbeauty@gmail.com, případně zavolejte na +420 739 749 256.'},
  {k:['cen','kolik','stoj'],q:'Kolik to stojí?',a:'Ceny jsou transparentní a bez skrytých poplatků. V této ukázce ceník ještě nemám, po napojení budu odpovídat podle ceníku salonu. Zatím se prosím zeptejte e-mailem.'},
  {k:['stud','soukrom','televiz','komfort'],q:'Jaké je prostředí?',a:'Klidný, příjemně provoněný interiér s televizí v místnostech, takže si můžete pustit film, seriál nebo hudbu. Je to soukromý salon, kde se nemusíte za nic stydět.'}
 ];
 var pridej=function(t,c){var p=document.createElement('p');p.className=c;p.textContent=t;okno.appendChild(p);okno.scrollTop=okno.scrollHeight};
 var zeptej=function(q){pridej(q,'u');var n=q.toLowerCase(),r=null;odp.forEach(function(o){if(!r&&o.k.some(function(k){return n.indexOf(k)>-1}))r=o});
  setTimeout(function(){pridej(r?r.a:'To v ukázce nevím. Napište prosím salonu na slimnestbeauty@gmail.com, rádi odpoví.','b')},350)};
 odp.slice(0,8).forEach(function(o){var b=document.createElement('button');b.type='button';b.textContent=o.q;b.addEventListener('click',function(){zeptej(o.q)});rychle.appendChild(b)});
 $('#ai-form').addEventListener('submit',function(e){e.preventDefault();var i=this.elements.q;if(i.value.trim()){zeptej(i.value.trim());i.value=''}});
 var otevri=function(o){panel.hidden=!o;$$('[data-otevri-asistenta]').forEach(function(b){b.setAttribute('aria-expanded',o)});if(o)$('#ai-form input').focus()};
 $$('[data-otevri-asistenta]').forEach(function(b){b.addEventListener('click',function(){otevri(panel.hidden)})});
 $('.ai-zavrit').addEventListener('click',function(){otevri(false)});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden)otevri(false)});
}
// odkrývání
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(z){z.forEach(function(e){if(e.isIntersecting){e.target.classList.add('vidim');io.unobserve(e.target)}})},{threshold:.1});
 $$('.sliby p,.panel,.o-text,.konf-form,.pas figure').forEach(function(el){el.classList.add('odkryt');io.observe(el)})}
})();
