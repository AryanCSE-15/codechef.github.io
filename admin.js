const seedEvents=[
{id:"e1",name:"CodeSprint 2026",category:"Technology",date:"2026-10-10T10:00",venue:"Innovation Lab",tag:"24-HOUR HACKATHON",description:"Build, break and ship. A high-energy coding challenge for students who love solving real-world problems.",featured:true},
{id:"e2",name:"Battle of Bands",category:"Cultural",date:"2026-10-17T18:30",venue:"Open Air Theatre",tag:"LIVE MUSIC",description:"The campus stage is yours. Bring your band, your energy and your loudest supporters.",featured:false},
{id:"e3",name:"Design Thinking Workshop",category:"Workshop",date:"2026-10-22T11:00",venue:"Seminar Hall A",tag:"LEARN & CREATE",description:"A hands-on session covering empathy, ideation and rapid prototyping with practical activities.",featured:false},
{id:"e4",name:"Inter-College Basketball",category:"Sports",date:"2026-11-02T09:00",venue:"Main Basketball Court",tag:"GAME DAY",description:"Compete, connect and represent your college in the annual inter-college basketball championship.",featured:false},
{id:"e5",name:"Open Mic Night",category:"Social",date:"2026-11-08T19:00",venue:"Student Plaza",tag:"YOUR STAGE",description:"Poetry, comedy, music and stories. Step up to the mic or come support your friends.",featured:false},
{id:"e6",name:"Cloud & AI Summit",category:"Technology",date:"2026-11-15T10:30",venue:"Auditorium",tag:"FUTURE TECH",description:"Industry-inspired talks and demos around cloud computing, AI and the skills shaping tomorrow.",featured:false}];
const getEvents=()=>{let x=localStorage.getItem("cc_events");if(!x){localStorage.setItem("cc_events",JSON.stringify(seedEvents));return seedEvents}return JSON.parse(x)};
const saveEvents=x=>localStorage.setItem("cc_events",JSON.stringify(x));
const getRegs=()=>JSON.parse(localStorage.getItem("cc_regs")||"[]");
const fmt=d=>new Intl.DateTimeFormat("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(d));
const dateOnly=d=>new Intl.DateTimeFormat("en-IN",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(d));
const toast=(msg,type="success")=>{const c=document.getElementById("toastContainer"),e=document.createElement("div");e.className="toast "+type;e.textContent=msg;c.appendChild(e);setTimeout(()=>e.remove(),3000)};
let events=getEvents();

function updateStats(){
 const regs=getRegs(), now=new Date();
 document.getElementById("statEvents").textContent=events.length;
 document.getElementById("statRegistrations").textContent=regs.length;
 document.getElementById("statUpcoming").textContent=events.filter(e=>new Date(e.date)>now).length;
 document.getElementById("statCategories").textContent=new Set(events.map(e=>e.category)).size;
 document.getElementById("recentEvents").innerHTML=events.slice().sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(0,5).map(e=>{
  const n=regs.filter(r=>r.eventId===e.id).length;
  return `<tr><td><div class="event-cell"><span class="mini-mark">${e.name.slice(0,2).toUpperCase()}</span><b>${e.name}</b></div></td><td>${dateOnly(e.date)}</td><td>${e.category}</td><td>${n}</td></tr>`}).join("");
}
function renderEventsTable(){
 document.getElementById("adminEventsTable").innerHTML=events.map(e=>`<tr><td><div class="event-cell"><span class="mini-mark">${e.name.slice(0,2).toUpperCase()}</span><b>${e.name}</b></div></td><td>${fmt(e.date)}</td><td>${e.venue}</td><td>${e.category}</td><td><button class="action-btn" onclick="editEvent('${e.id}')">Edit</button><button class="action-btn danger" onclick="deleteEvent('${e.id}')">Delete</button></td></tr>`).join("");
}
function renderRegistrations(){
 const q=(document.getElementById("registrationSearch").value||"").toLowerCase(), filter=document.getElementById("registrationEventFilter").value;
 const regs=getRegs().filter(r=>(filter==="all"||r.eventId===filter)&&(`${r.name} ${r.email} ${r.college}`.toLowerCase().includes(q)));
 const tbody=document.getElementById("registrationsTable");
 tbody.innerHTML=regs.map(r=>{const e=events.find(x=>x.id===r.eventId);return `<tr><td><b>${r.name}</b></td><td>${r.email}<br><span style="color:#697589">${r.phone}</span></td><td>${r.college}<br><span style="color:#697589">${r.year}</span></td><td>${e?e.name:"Deleted event"}</td><td>${dateOnly(r.registeredAt)}</td></tr>`}).join("");
 document.getElementById("registrationEmpty").classList.toggle("hidden",regs.length>0);
}
function populateRegFilter(){
 const s=document.getElementById("registrationEventFilter"),cur=s.value;
 s.innerHTML='<option value="all">All Events</option>'+events.map(e=>`<option value="${e.id}">${e.name}</option>`).join("");s.value=events.some(e=>e.id===cur)?cur:"all";
}
function openEventModal(id=null){
 document.getElementById("eventForm").reset();document.getElementById("editEventId").value=id||"";
 document.getElementById("eventModalKicker").textContent=id?"EDIT EVENT":"NEW EVENT";
 document.getElementById("eventModalTitle").textContent=id?"Edit Event":"Add Event";
 if(id){const e=events.find(x=>x.id===id);if(!e)return;document.getElementById("eventName").value=e.name;document.getElementById("eventCategory").value=e.category;document.getElementById("eventDate").value=e.date;document.getElementById("eventVenue").value=e.venue;document.getElementById("eventTag").value=e.tag||"";document.getElementById("eventDescription").value=e.description;document.getElementById("eventFeatured").checked=!!e.featured}
 document.getElementById("eventModal").classList.remove("hidden");
}
function editEvent(id){openEventModal(id)}
function deleteEvent(id){
 const e=events.find(x=>x.id===id);if(!e)return;
 if(!confirm(`Delete "${e.name}"? This cannot be undone.`))return;
 events=events.filter(x=>x.id!==id);saveEvents(events);updateAll();toast("Event deleted");
}
function updateAll(){updateStats();renderEventsTable();populateRegFilter();renderRegistrations()}
document.addEventListener("DOMContentLoaded",()=>{
 updateAll();
 document.querySelectorAll(".side-btn").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.tab)));
 document.querySelectorAll("[data-switch]").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.switch)));
 document.getElementById("quickAdd").onclick=()=>openEventModal();
 document.getElementById("addEventBtn").onclick=()=>openEventModal();
 document.getElementById("closeEventModal").onclick=()=>document.getElementById("eventModal").classList.add("hidden");
 document.getElementById("eventModal").addEventListener("click",e=>{if(e.target.id==="eventModal")e.target.classList.add("hidden")});
 document.getElementById("registrationSearch").addEventListener("input",renderRegistrations);
 document.getElementById("registrationEventFilter").addEventListener("change",renderRegistrations);
 document.getElementById("eventForm").addEventListener("submit",e=>{
  e.preventDefault();
  const id=document.getElementById("editEventId").value;
  const obj={id:id||crypto.randomUUID(),name:document.getElementById("eventName").value.trim(),category:document.getElementById("eventCategory").value,date:document.getElementById("eventDate").value,venue:document.getElementById("eventVenue").value.trim(),tag:document.getElementById("eventTag").value.trim()||"CAMPUS EVENT",description:document.getElementById("eventDescription").value.trim(),featured:document.getElementById("eventFeatured").checked};
  if(obj.featured)events=events.map(e=>({...e,featured:false}));
  if(id)events=events.map(e=>e.id===id?obj:e);else events.unshift(obj);
  saveEvents(events);document.getElementById("eventModal").classList.add("hidden");updateAll();toast(id?"Event updated successfully":"Event added successfully 🎉");
 });
});
function switchTab(tab){
 document.querySelectorAll(".admin-tab").forEach(x=>x.classList.add("hidden"));
 const el=document.getElementById(tab==="events-admin"?"events-adminTab":tab+"Tab");if(el)el.classList.remove("hidden");
 document.querySelectorAll(".side-btn").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
}
