(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
// menu na mobilu
var tl=$('.menu-tl'),nav=$('#hl-nav');
if(tl)tl.addEventListener('click',function(){var o=nav.classList.toggle('otevrene');tl.setAttribute('aria-expanded',o)});
$$('#hl-nav a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('otevrene')})});
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
 f.addEventListener('input',kresli);f.addEventListener('change',kresli);kresli();
 f.addEventListener('submit',function(e){e.preventDefault();
  var st=$('.formular-stav',f),em=v('email');
  if(v('druh')==='hodnota'&&v('castka')==='jina'&&!parseInt(v('jina'),10)){st.textContent='Doplňte prosím částku.';return}
  var t=['Dobrý den,','','objednávám dárkový poukaz:','Na: '+obsah(),'Vzhled: '+(v('vzhled')==='cerny'?'černý':'pudrově růžový'),'Pro koho: '+(v('komu')||'-'),'Od koho: '+(v('od')||'-'),'Věnování: '+(v('venovani')||'-'),'Převzetí: '+v('predani'),'Kontakt na mě: '+(em||'-'),'','Děkuji'].join('\n');
  st.textContent='Otevírám e-mail s objednávkou…';
  location.href='mailto:slimnestbeauty@gmail.com?subject='+encodeURIComponent('Objednávka dárkového poukazu')+'&body='+encodeURIComponent(t)});
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
