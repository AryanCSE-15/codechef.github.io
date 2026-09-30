const seedEvents = [
  {id:"e1",name:"CodeSprint 2026",category:"Technology",date:"2026-10-10T10:00",venue:"Innovation Lab",tag:"24-HOUR HACKATHON",description:"Build, break and ship. A high-energy coding challenge for students who love solving real-world problems.",featured:true},
  {id:"e2",name:"Battle of Bands",category:"Cultural",date:"2026-10-17T18:30",venue:"Open Air Theatre",tag:"LIVE MUSIC",description:"The campus stage is yours. Bring your band, your energy and your loudest supporters.",featured:false},
  {id:"e3",name:"Design Thinking Workshop",category:"Workshop",date:"2026-10-22T11:00",venue:"Seminar Hall A",tag:"LEARN & CREATE",description:"A hands-on session covering empathy, ideation and rapid prototyping with practical activities.",featured:false},
  {id:"e4",name:"Inter-College Basketball",category:"Sports",date:"2026-11-02T09:00",venue:"Main Basketball Court",tag:"GAME DAY",description:"Compete, connect and represent your college in the annual inter-college basketball championship.",featured:false},
  {id:"e5",name:"Open Mic Night",category:"Social",date:"2026-11-08T19:00",venue:"Student Plaza",tag:"YOUR STAGE",description:"Poetry, comedy, music and stories. Step up to the mic or come support your friends.",featured:false},
  {id:"e6",name:"Cloud & AI Summit",category:"Technology",date:"2026-11-15T10:30",venue:"Auditorium",tag:"FUTURE TECH",description:"Industry-inspired talks and demos around cloud computing, AI and the skills shaping tomorrow.",featured:false}
];

const getEvents=()=>{let x=localStorage.getItem("cc_events"); if(!x){localStorage.setItem("cc_events",JSON.stringify(seedEvents));return seedEvents} return JSON.parse(x)};
const saveEvents=x=>localStorage.setItem("cc_events",JSON.stringify(x));
const getRegs=()=>JSON.parse(localStorage.getItem("cc_regs")||"[]");
const saveRegs=x=>localStorage.setItem("cc_regs",JSON.stringify(x));
const fmt=d=>new Intl.DateTimeFormat("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(d));
const dateShort=d=>new Intl.DateTimeFormat("en-IN",{day:"2-digit",month:"short"}).format(new Date(d));
const toast=(msg,type="success")=>{const c=document.getElementById("toastContainer"),e=document.createElement("div");e.className="toast "+type;e.textContent=msg;c.appendChild(e);setTimeout(()=>e.remove(),3200)};

let events=getEvents();

function render(){
  const search=(document.getElementById("searchInput")?.value||"").toLowerCase();
  const cat=document.getElementById("categoryFilter")?.value||"all";
  const filtered=events.filter(e=>(e.name.toLowerCase().includes(search)||e.description.toLowerCase().includes(search))&&(cat==="all"||e.category===cat));
  const grid=document.getElementById("eventsGrid");
  if(grid) grid.innerHTML=filtered.map(eventCard).join("");
  const empty=document.getElementById("emptyState"); if(empty) empty.classList.toggle("hidden",filtered.length>0);
  const count=document.getElementById("eventCount"); if(count) count.textContent=`${filtered.length} event${filtered.length!==1?"s":""}`;
  const hc=document.getElementById("heroEventCount"); if(hc) hc.textContent=events.length;
  renderFeatured(); populateCategories();
}
function eventCard(e){return `<article class="event-card"><div class="card-top"><span class="category">${e.category.toUpperCase()}</span><span class="date-box">${dateShort(e.date)}</span></div><h3>${e.name}</h3><p>${e.description}</p><div class="event-meta"><span>◷ ${fmt(e.date)}</span></div><div class="card-bottom"><span class="venue">📍 ${e.venue}</span><button class="register-btn" onclick="openRegistration('${e.id}')">REGISTER →</button></div></article>`}
function renderFeatured(){
 const wrap=document.getElementById("featuredEvent"); if(!wrap)return;
 const e=events.find(x=>x.featured)||events[0];
 wrap.innerHTML=e?`<div class="featured-card"><div class="featured-info"><span class="featured-tag">${e.tag||"FEATURED EVENT"}</span><h3>${e.name}</h3><p>${e.description}</p><div class="event-meta"><span>◷ ${fmt(e.date)}</span><span>📍 ${e.venue}</span><span>◆ ${e.category}</span></div><button class="btn btn-primary" style="width:max-content" onclick="openRegistration('${e.id}')">Register Now →</button></div><div class="featured-art"><div class="big-mark">CC</div></div></div>`:"";
}
function populateCategories(){
 const s=document.getElementById("categoryFilter"); if(!s)return;
 const current=s.value; const cats=[...new Set(events.map(e=>e.category))].sort();
 s.innerHTML='<option value="all">All Categories</option>'+cats.map(c=>`<option value="${c}">${c}</option>`).join(""); s.value=cats.includes(current)?current:"all";
}
function openRegistration(id){
 const e=events.find(x=>x.id===id); if(!e)return;
 document.getElementById("registrationEventId").value=id;document.getElementById("modalEventName").textContent=e.name;document.getElementById("modalEventMeta").textContent=`${fmt(e.date)}  •  ${e.venue}`;
 document.getElementById("registrationModal").classList.remove("hidden");
}
function closeReg(){document.getElementById("registrationModal").classList.add("hidden")}
document.addEventListener("DOMContentLoaded",()=>{
 render();
 document.getElementById("searchInput")?.addEventListener("input",render);
 document.getElementById("categoryFilter")?.addEventListener("change",render);
 document.getElementById("closeModal")?.addEventListener("click",closeReg);
 document.getElementById("registrationModal")?.addEventListener("click",e=>{if(e.target.id==="registrationModal")closeReg()});
 document.getElementById("registrationForm")?.addEventListener("submit",e=>{
   e.preventDefault();
   const regs=getRegs(); const eventId=document.getElementById("registrationEventId").value;
   const phone=document.getElementById("regPhone").value;
   if(!/^\d{10}$/.test(phone)){toast("Please enter a valid 10-digit phone number","error");return}
   regs.push({id:crypto.randomUUID(),eventId,name:document.getElementById("regName").value.trim(),email:document.getElementById("regEmail").value.trim(),college:document.getElementById("regCollege").value.trim(),year:document.getElementById("regYear").value.trim(),phone,registeredAt:new Date().toISOString()});
   saveRegs(regs);e.target.reset();closeReg();toast("Registration successful! See you at the event 🎉");
 });
 document.getElementById("menuBtn")?.addEventListener("click",()=>{const n=document.querySelector(".navbar nav");n.style.display=n.style.display==="flex"?"none":"flex";n.style.position="absolute";n.style.top="76px";n.style.right="5%";n.style.background="#10151f";n.style.padding="15px";n.style.border="1px solid #252d3b";n.style.borderRadius="12px";n.style.flexDirection="column";n.style.alignItems="stretch"});
});
