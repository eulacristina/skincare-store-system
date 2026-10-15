/* ---------- DATA ---------- */
const PRODUCTS=[
{id:1,n:"Cloud Gentle Cleanser",c:"Cleanse",p:480,e:"🧴",h:350,t:"Soft foaming cleanser that lifts dirt without stripping.",k:"Ceramides, glycerin, oat extract",s:"All skin types",b:1},
{id:2,n:"Rose Water Toner",c:"Cleanse",p:420,e:"🌹",h:340,t:"Alcohol-free mist that balances and refreshes skin.",k:"Rose water, aloe, panthenol",s:"Normal to dry"},
{id:3,n:"Glow Vitamin C Serum",c:"Treat",p:890,e:"🍊",h:30,t:"Brightening serum to fade dull tone and dark spots.",k:"10% vitamin C, ferulic acid",s:"Dull, uneven skin",b:1},
{id:4,n:"Hyaluron Dew Serum",c:"Treat",p:820,e:"💧",h:200,t:"Multi-weight hyaluronic acid for plump, bouncy hydration.",k:"Hyaluronic acid, B5",s:"Dehydrated skin",b:1},
{id:5,n:"Clear Niacinamide 10%",c:"Treat",p:760,e:"✨",h:160,t:"Minimizes the look of pores and calms oily shine.",k:"Niacinamide, zinc PCA",s:"Oily, acne-prone"},
{id:6,n:"Barrier Cream Moisturizer",c:"Moisturize",p:650,e:"🫧",h:280,t:"Rich yet lightweight cream that locks in moisture all day.",k:"Squalane, shea, ceramides",s:"Dry, sensitive",b:1},
{id:7,n:"Daily Shield SPF 50",c:"Protect",p:560,e:"☀️",h:48,t:"Invisible, no white cast sunscreen. PA++++.",k:"Zinc oxide, vitamin E",s:"All skin types",b:1},
{id:8,n:"Overnight Repair Mask",c:"Moisturize",p:720,e:"🌙",h:250,t:"Sleeping mask that wakes you up with calm, rested skin.",k:"Peptides, centella, squalane",s:"Tired, dry skin"}];
const CATS=["Cleanse","Treat","Moisturize","Protect"];
const FREE_SHIP=1500,SHIP=100;
const peso=n=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:0}).format(n);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $=s=>document.querySelector(s);

/* ---------- STORAGE (safe) ---------- */
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let cart=store.get("cr_cart",{}),user=store.get("cr_user",null),orders=store.get("cr_orders",[]),mem={q:"",cat:"All",sort:"pop"};

/* ---------- CART ---------- */
const prod=id=>PRODUCTS.find(p=>p.id==id);
const count=()=>Object.values(cart).reduce((a,b)=>a+b,0);
const sub=()=>Object.entries(cart).reduce((a,[id,q])=>a+prod(id).p*q,0);
const ship=()=>sub()===0||sub()>=FREE_SHIP?0:SHIP;
function saveCart(){store.set("cr_cart",cart);$("#cnt").textContent=count()}
function add(id,q=1){cart[id]=(cart[id]||0)+q;saveCart();toast(prod(id).n+" added to cart")}
function setQty(id,q){if(q<=0)delete cart[id];else cart[id]=Math.min(q,10);saveCart();route()}
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),1800)}

/* ---------- COMPONENTS ---------- */
const card=p=>`<div class="card"><a href="#/product/${p.id}" class="img" style="--h:${p.h}">${p.e}</a>
<div class="b"><span class="muted">${p.c}</span><a href="#/product/${p.id}"><strong>${p.n}</strong></a>
<div class="row"><span class="price">${peso(p.p)}</span><button class="btn sm" onclick="add(${p.id})">Add</button></div></div></div>`;

/* ---------- PAGES ---------- */
const pages={
home(){return `<div class="hero"><div class="wrap"><h1>Skin that feels<br>like yourself.</h1>
<p>Cristina makes gentle, effective skincare with honest ingredients. No fuss, just a glow that lasts.</p>
<a class="btn" href="#/shop">Shop all products</a></div></div>
<section><div class="wrap"><h2>Bestsellers</h2><div class="grid">${PRODUCTS.filter(p=>p.b).slice(0,4).map(card).join("")}</div></div></section>
<section style="padding-top:0"><div class="wrap"><h2>Shop by step</h2><div class="grid">${CATS.map(c=>`<a class="box" href="#/shop/${c}"><h3>${c}</h3><span class="muted">${PRODUCTS.filter(p=>p.c==c).length} products →</span></a>`).join("")}</div></div></section>
<section style="padding-top:0"><div class="wrap perks"><div>🌿<br><strong>Clean formulas</strong><br><span class="muted">Fragrance-free, cruelty-free</span></div><div>🚚<br><strong>Free shipping</strong><br><span class="muted">On orders over ${peso(FREE_SHIP)}</span></div><div>💝<br><strong>30-day returns</strong><br><span class="muted">Love it or send it back</span></div></div></section>
<section style="padding-top:0"><div class="wrap"><div class="box" style="text-align:center"><h2>Join the Cristina circle</h2><p class="muted">Get skincare tips and 10% off your first order.</p>
<form onsubmit="event.preventDefault();toast('Thanks for subscribing!');this.reset()" class="row" style="justify-content:center"><input type="email" required placeholder="Your email" style="max-width:300px"><button class="btn">Subscribe</button></form></div></div></section>`},

shop(arg){if(arg&&CATS.includes(arg))mem.cat=arg;
let list=PRODUCTS.filter(p=>(mem.cat=="All"||p.c==mem.cat)&&(p.n+p.t+p.k).toLowerCase().includes(mem.q.toLowerCase()));
if(mem.sort=="lo")list.sort((a,b)=>a.p-b.p);if(mem.sort=="hi")list.sort((a,b)=>b.p-a.p);
return `<section><div class="wrap"><h2>Shop</h2><div class="tools">
<input id="q" placeholder="Search products…" value="${esc(mem.q)}">
<select id="cat"><option>All</option>${CATS.map(c=>`<option ${mem.cat==c?"selected":""}>${c}</option>`).join("")}</select>
<select id="sort"><option value="pop">Featured</option><option value="lo" ${mem.sort=="lo"?"selected":""}>Price: low to high</option><option value="hi" ${mem.sort=="hi"?"selected":""}>Price: high to low</option></select></div>
<div class="grid">${list.map(card).join("")||'<p class="muted">No products match your search.</p>'}</div></div></section>`},

product(id){const p=prod(id);if(!p)return pages.notfound();
const rel=PRODUCTS.filter(x=>x.c==p.c&&x.id!=p.id).slice(0,4);
return `<section><div class="wrap"><a href="#/shop" class="muted">← Back to shop</a><div class="two" style="margin-top:14px">
<div class="img" style="--h:${p.h};border-radius:20px;font-size:7rem">${p.e}</div>
<div><span class="muted">${p.c}</span><h1 style="font-size:2.2rem">${p.n}</h1><div class="price" style="font-size:1.4rem">${peso(p.p)}</div>
<p>${p.t}</p><p class="muted"><strong>Key ingredients:</strong> ${p.k}<br><strong>Best for:</strong> ${p.s}</p>
<div class="row" style="justify-content:flex-start"><span class="qty"><button onclick="q1(-1)">−</button><b id="q1">1</b><button onclick="q1(1)">+</button></span>
<button class="btn" onclick="add(${p.id},+$('#q1').textContent)">Add to cart</button></div></div></div>
${rel.length?`<h2 style="margin-top:40px">You may also like</h2><div class="grid">${rel.map(card).join("")}</div>`:""}</div></section>`},

cart(){const ids=Object.keys(cart);
if(!ids.length)return `<section><div class="wrap" style="text-align:center"><h2>Your cart is empty</h2><p class="muted">Find something your skin will love.</p><a class="btn" href="#/shop">Start shopping</a></div></section>`;
return `<section><div class="wrap"><h2>Your cart</h2><div class="two" style="grid-template-columns:2fr 1fr"><div>${ids.map(id=>{const p=prod(id),q=cart[id];return `<div class="line"><div class="img" style="--h:${p.h}">${p.e}</div>
<div class="grow"><strong>${p.n}</strong><br><span class="muted">${peso(p.p)}</span></div>
<span class="qty"><button onclick="setQty(${id},${q-1})">−</button>${q}<button onclick="setQty(${id},${q+1})">+</button></span>
<strong>${peso(p.p*q)}</strong><button class="chip" onclick="setQty(${id},0)">✕</button></div>`}).join("")}</div>
${summary()}<a class="btn" href="#/checkout" style="display:block;text-align:center;margin-top:14px">Checkout</a></div></div></section>`.replace('</div></div></section>','</div></section>')},

checkout(){if(!count())return pages.cart();const u=user||{};
return `<section><div class="wrap"><h2>Checkout</h2><div class="two" style="grid-template-columns:3fr 2fr"><form id="co" class="box" novalidate>
<h3>Shipping details</h3>
<label>Full name</label><input name="name" value="${esc(u.name||"")}"><label>Email</label><input name="email" type="email" value="${esc(u.email||"")}">
<label>Phone</label><input name="phone"><label>Address</label><input name="address"><label>City</label><input name="city">
<label>Payment method</label><select name="pay"><option>Cash on delivery</option><option>GCash (demo)</option><option>Credit / debit card (demo)</option></select>
<div class="err" id="err"></div><button class="btn" style="width:100%;margin-top:10px">Place order · ${peso(sub()+ship())}</button></form>
<div>${summary()}</div></div></div></section>`},

done(id){const o=orders.find(o=>o.id==id);if(!o)return pages.notfound();
return `<section><div class="wrap" style="text-align:center;max-width:560px"><div style="font-size:3rem">🎉</div><h2>Thank you, ${esc(o.name.split(" ")[0])}!</h2>
<p>Order <strong>${o.id}</strong> is confirmed. A receipt was sent to ${esc(o.email)} (demo).</p>
<div class="box" style="text-align:left">${o.items.map(i=>`<div class="tot"><span>${i.q}× ${i.n}</span><span>${peso(i.q*i.p)}</span></div>`).join("")}
<div class="tot big"><span>Total</span><span>${peso(o.total)}</span></div><p class="muted">Pay: ${esc(o.pay)} · Ship to: ${esc(o.address)}, ${esc(o.city)}</p></div>
<a class="btn" href="#/shop" style="margin-top:18px">Continue shopping</a></div></section>`},

account(){if(user)return `<section><div class="wrap"><h2>Hello, ${esc(user.name)}</h2><p class="muted">${esc(user.email)} · <a href="#" onclick="logout();return false" style="color:var(--accent)">Sign out</a></p>
<h3>Order history</h3>${orders.length?`<div class="table"><table><tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th></tr>${orders.slice().reverse().map(o=>`<tr><td>${o.id}</td><td>${o.date}</td><td>${o.items.reduce((a,i)=>a+i.q,0)}</td><td>${peso(o.total)}</td></tr>`).join("")}</table></div>`:'<p class="muted">No orders yet.</p>'}</div></section>`;
return `<section><div class="wrap" style="max-width:420px"><div class="box"><div class="tabs"><button class="chip on" id="t1" type="button">Sign in</button><button class="chip" id="t2" type="button">Create account</button></div>
<form id="auth" novalidate><div id="nm" hidden><label>Full name</label><input name="name"></div><label>Email</label><input name="email" type="email"><label>Password</label><input name="pw" type="password">
<div class="err" id="err"></div><button class="btn" style="width:100%">Continue</button></form><p class="muted" style="font-size:.8rem">Demo only: accounts stay in this browser and passwords are not stored.</p></div></div></section>`},

about(){return `<section><div class="wrap" style="max-width:720px"><h1 style="font-size:2.4rem">Our story</h1>
<p>Cristina began with a simple belief: good skincare should be gentle, honest and easy. Every formula is built around a few proven ingredients at effective strengths, with no unnecessary fragrance, dyes or fillers.</p>
<h3>Shipping &amp; returns</h3><p>Orders ship in 1–2 business days. Delivery takes 2–5 days. Shipping is ${peso(SHIP)}, free over ${peso(FREE_SHIP)}. Not happy? Return opened or unopened products within 30 days for a refund.</p>
<h3>Our promise</h3><p>🌿 Cruelty-free · 🧪 Dermatologist-tested · ♻️ Recyclable packaging</p></div></section>`},

contact(){return `<section><div class="wrap" style="max-width:560px"><h2>Contact us</h2><p class="muted">Questions about your skin or your order? We reply within 24 hours.</p>
<form class="box" id="ct" novalidate><label>Name</label><input name="name"><label>Email</label><input name="email" type="email"><label>Message</label><textarea name="msg" rows="5"></textarea>
<div class="err" id="err"></div><button class="btn">Send message</button></form></div></section>`},

notfound(){return `<section><div class="wrap" style="text-align:center"><h2>Page not found</h2><a class="btn" href="#/">Go home</a></div></section>`}
};

function summary(){return `<div class="box"><h3>Order summary</h3><div class="tot"><span>Subtotal</span><span>${peso(sub())}</span></div>
<div class="tot"><span>Shipping</span><span>${ship()?peso(ship()):"Free"}</span></div><div class="tot big"><span>Total</span><span>${peso(sub()+ship())}</span></div>
${sub()<FREE_SHIP?`<p class="muted" style="font-size:.85rem">Add ${peso(FREE_SHIP-sub())} more for free shipping.</p>`:""}</div>`}
function q1(d){const e=$("#q1");e.textContent=Math.max(1,Math.min(10,+e.textContent+d))}
function logout(){user=null;store.set("cr_user",null);route();toast("Signed out")}

/* ---------- ROUTER ---------- */
function route(){
  const [,page="home",arg]=(location.hash.slice(1)||"/").split("/");
  const key=page||"home";
  $("#app").innerHTML=(pages[key]||pages.notfound)(arg);
  document.querySelectorAll("#nav a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")=="#/"+key));
  $("#acc").textContent=user?user.name.split(" ")[0]:"Account";
  saveCart();window.scrollTo(0,0);bind(key);
  document.title=(key=="home"?"":key[0].toUpperCase()+key.slice(1)+" · ")+"Cristina — Skincare";
}
function bind(key){
  if(key=="shop"){["q","cat","sort"].forEach(id=>$("#"+id).addEventListener(id=="q"?"input":"change",e=>{mem[id=="q"?"q":id]=e.target.value;const pos=e.target.selectionStart;pages_refresh(id,pos)}))}
  if(key=="checkout")$("#co").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),d=Object.fromEntries(f);
    for(const k of["name","email","phone","address","city"])if(!d[k].trim())return $("#err").textContent="Please fill in all fields.";
    if(!/^\S+@\S+\.\S+$/.test(d.email))return $("#err").textContent="Please enter a valid email.";
    const o={id:"CR-"+Date.now().toString().slice(-6),date:new Date().toLocaleDateString(),...d,total:sub()+ship(),items:Object.entries(cart).map(([id,q])=>({n:prod(id).n,p:prod(id).p,q}))};
    orders.push(o);store.set("cr_orders",orders);cart={};saveCart();location.hash="#/done/"+o.id};
  if(key=="account"&&!user){let reg=false;const tab=r=>{reg=r;$("#nm").hidden=!r;$("#t1").classList.toggle("on",!r);$("#t2").classList.toggle("on",r)};
    $("#t1").onclick=()=>tab(false);$("#t2").onclick=()=>tab(true);
    $("#auth").onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));
      if(!/^\S+@\S+\.\S+$/.test(d.email)||d.pw.length<6||(reg&&!d.name.trim()))return $("#err").textContent="Enter a valid email, a 6+ character password"+(reg?" and your name.":".");
      user={name:reg?d.name.trim():d.email.split("@")[0],email:d.email};store.set("cr_user",user);route();toast("Welcome!")}}
  if(key=="contact")$("#ct").onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));
    if(!d.name.trim()||!/^\S+@\S+\.\S+$/.test(d.email)||!d.msg.trim())return $("#err").textContent="Please complete all fields with a valid email.";
    e.target.reset();$("#err").textContent="";toast("Message sent. Thank you!")};
}
function pages_refresh(id,pos){const html=pages.shop(),tmp=document.createElement("div");tmp.innerHTML=html;
  $("#app .grid").innerHTML=tmp.querySelector(".grid").innerHTML}
window.addEventListener("hashchange",route);route();