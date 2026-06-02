import { useState, useEffect, useRef } from "react";

import { REPO_DATA } from './repoData.js';

const GOLD = "#b8860b", GL = "#f5e9c8", PARCH = "#fdf6e3";
const USER = "Ananya";

const CHANT = `So evaṁ agāraṁ ajjhāvasamāno dasa akusalakammapathe pahāya dasa kusalakammapathe samādāya viharati, ācāragocarasampanno, aṇumattesu vajjesu bhayadassāvī, samādāya sikkhati sikkhāpadesu, kāyakammavacīkammena samannāgato kusalena, parisuddhājīvo sīlasampanno, indriyesu guttadvāro, satisampajaññena samannāgato, santuṭṭho, ānāpānassatiṁ bhāveti bahulīkaroti.`;

const CHANT_LINES = [
  ["So evaṁ agāraṁ ajjhāvasamāno","Thus, living at home"],
  ["dasa akusalakammapathe pahāya","desisting from the ten unwholesome courses of action"],
  ["dasa kusalakammapathe samādāya viharati","undertaking the ten wholesome courses of action"],
  ["ācāragocarasampanno","well-established in conduct-worthy fields"],
  ["aṇumattesu vajjesu bhayadassāvī","seeing danger in the slightest fault"],
  ["samādāya sikkhati sikkhāpadesu","training diligently in the training rules"],
  ["kāyakammavacīkammena samannāgato kusalena","wholesome in body, speech, and mind"],
  ["parisuddhājīvo sīlasampanno","pure livelihood, endowed with virtue"],
  ["indriyesu guttadvāro","guarding the sense doors"],
  ["satisampajaññena samannāgato","established in mindfulness and clear comprehension"],
  ["santuṭṭho","content and satisfied"],
  ["ānāpānassatiṁ bhāveti bahulīkaroti","develops and makes abundant mindfulness of breathing"],
];

const SILA5 = [
  {pali:"Pāṇātipātā veramaṇī", en:"Refraining from taking life", prompt:"What led to this? What was the state of mind just before?"},
  {pali:"Adinnādānā veramaṇī", en:"Refraining from taking what is not given", prompt:"What was the wanting beneath this? Was it need or craving?"},
  {pali:"Musāvādā · Pisuṇāvācā · Pharusāvācā · Samphappalāpā veramaṇī", en:"Refraining from false, divisive, harsh, and idle speech", prompt:"Which form of wrong speech arose? What drove it?"},
  {pali:"Kāmesumicchācārā veramaṇī", en:"Refraining from sexual misconduct", prompt:"What was the underlying craving?"},
  {pali:"Surāmerayamajja pamādaṭṭhānā veramaṇī", en:"Refraining from intoxicants", prompt:"What discomfort was the mind trying to escape?"},
];

const SCENARIOS = [
  {text:"Your morning tea has gone cold before you could drink it.",tag:"anicca",choices:[
    {text:"I see the tea changed while I was elsewhere — this is the nature of things",type:"wise"},
    {text:"I feel a flash of annoyance that it didn't wait for me",type:"reactive"},
    {text:"I rush to reheat it, irritated at the interruption",type:"reactive"},
  ]},
  {text:"Someone at work received praise you expected for yourself.",tag:"abhijja",choices:[
    {text:"I notice the comparing mind contract, and let the wanting be seen",type:"wise"},
    {text:"I quietly resent them and replay why it should have been me",type:"reactive"},
    {text:"I tell myself they didn't really deserve it",type:"reactive"},
  ]},
  {text:"You are waiting in a long queue and it is not moving.",tag:"dukkha",choices:[
    {text:"I let the waiting be waiting, without demanding it be otherwise",type:"wise"},
    {text:"I check my phone again and again to escape the gap",type:"reactive"},
    {text:"I grow tense and rehearse a complaint",type:"reactive"},
  ]},
  {text:"A family member says something that irritates you deeply.",tag:"vyapada",choices:[
    {text:"I feel the heat of ill-will arise and breathe before responding",type:"wise"},
    {text:"I snap back before the feeling has even settled",type:"reactive"},
    {text:"I go silent but rehearse the grievance inwardly",type:"reactive"},
  ]},
  {text:"You mindlessly opened your phone and lost 20 minutes.",tag:"dukkha",choices:[
    {text:"I notice where the pull began, without scolding myself",type:"wise"},
    {text:"I keep scrolling since the time is already gone",type:"reactive"},
    {text:"I drop into self-criticism for wasting time",type:"reactive"},
  ]},
  {text:"You notice your neighbour has a newer phone than yours.",tag:"abhijja",choices:[
    {text:"I watch covetousness arise and wish them well instead",type:"wise"},
    {text:"I start thinking about how to get a newer one too",type:"reactive"},
    {text:"I feel my own things suddenly seem shabby",type:"reactive"},
  ]},
  {text:"A task you worked hard on was quietly ignored.",tag:"vyapada",choices:[
    {text:"I notice the sting of being unseen, and hold it gently",type:"wise"},
    {text:"I withdraw and let resentment harden",type:"reactive"},
    {text:"I look for a way to make my effort noticed",type:"reactive"},
  ]},
  {text:"You feel restless but do not know why.",tag:"anatta",choices:[
    {text:"I ask quietly: who is the one who is restless?",type:"wise"},
    {text:"I reach for something — food, phone, noise — to fill it",type:"reactive"},
    {text:"I decide something must be wrong with me",type:"reactive"},
  ]},
  {text:"You eat your lunch quickly, barely tasting it.",tag:"dukkha",choices:[
    {text:"I slow for one bite and actually taste it",type:"wise"},
    {text:"I keep eating while watching something on a screen",type:"reactive"},
    {text:"I finish fast to get back to being busy",type:"reactive"},
  ]},
  {text:"You feel a sudden wish that someone else would fail.",tag:"vyapada",choices:[
    {text:"I see ill-will clearly and name it without acting on it",type:"wise"},
    {text:"I let the thought run and quietly enjoy it",type:"reactive"},
    {text:"I justify the wish by recalling their faults",type:"reactive"},
  ]},
  {text:"You have important work to do but keep finding reasons to delay.",tag:"dukkha",choices:[
    {text:"I notice the avoidance and the discomfort beneath it",type:"wise"},
    {text:"I open another distraction to put it off again",type:"reactive"},
    {text:"I tell myself I'll do it later and feel the unease grow",type:"reactive"},
  ]},
  {text:"You open YouTube for one video and two hours pass.",tag:"dukkha",choices:[
    {text:"I notice the moment the next video began to pull me",type:"wise"},
    {text:"I keep watching since I'm already in it",type:"reactive"},
    {text:"I blame the app and feel powerless",type:"reactive"},
  ]},
  {text:"A colleague got promoted and you feel it should have been you.",tag:"abhijja",choices:[
    {text:"I feel the contraction of comparison and breathe with it",type:"wise"},
    {text:"I rehearse all the reasons I was more deserving",type:"reactive"},
    {text:"I let the day sour around the thought",type:"reactive"},
  ]},
  {text:"Someone cancels plans and you feel a flash of resentment.",tag:"vyapada",choices:[
    {text:"I notice resentment arise and let it pass without feeding it",type:"wise"},
    {text:"I reply with a cold, clipped message",type:"reactive"},
    {text:"I decide they don't value me and withdraw",type:"reactive"},
  ]},
  {text:"You scroll through someone's life on social media and feel quietly diminished.",tag:"abhijja",choices:[
    {text:"I see the comparing mind at work and set the phone down",type:"wise"},
    {text:"I keep scrolling and feel worse with each post",type:"reactive"},
    {text:"I start curating how my own life looks to others",type:"reactive"},
  ]},
  {text:"You said something harsh and cannot stop replaying it.",tag:"vyapada",choices:[
    {text:"I acknowledge the harm, resolve to repair it, and let the loop ease",type:"wise"},
    {text:"I replay it again and again, sinking into remorse",type:"reactive"},
    {text:"I justify it by blaming what they said first",type:"reactive"},
  ]},
  {text:"You feel subtle pride when others seem to be doing worse than you.",tag:"abhijja",choices:[
    {text:"I notice the pride and the comparing beneath it",type:"wise"},
    {text:"I quietly enjoy feeling ahead",type:"reactive"},
    {text:"I look for more evidence that I'm doing better",type:"reactive"},
  ]},
  {text:"You avoid a difficult conversation by filling your evening with a film.",tag:"dukkha",choices:[
    {text:"I notice what I'm avoiding and feel the unease honestly",type:"wise"},
    {text:"I queue up another film to keep it at bay",type:"reactive"},
    {text:"I tell myself there's nothing to discuss",type:"reactive"},
  ]},
  {text:"Your body aches today and the mind is impatient with it.",tag:"anicca",choices:[
    {text:"I meet the ache as a changing sensation, not an enemy",type:"wise"},
    {text:"I grow frustrated that the body won't cooperate",type:"reactive"},
    {text:"I push through, ignoring what the body is saying",type:"reactive"},
  ]},
  {text:"You reach for your phone the moment silence arrives.",tag:"dukkha",choices:[
    {text:"I pause, and let the silence be, just for a breath",type:"wise"},
    {text:"I unlock it before I've even noticed the reach",type:"reactive"},
    {text:"I feel uneasy in the quiet and fill it quickly",type:"reactive"},
  ]},
];

const MN20 = [
  {name:"1. Replace the thought",inst:"Bring a wholesome object to mind. Let it displace the unwholesome thought."},
  {name:"2. Reflect on its danger",inst:"See clearly what this thought leads to. Is this where I wish to dwell?"},
  {name:"3. Do not attend to it",inst:"Withdraw attention. A fire without fuel goes out."},
  {name:"4. Still the formation",inst:"Stop feeding it. Let the energy generating the thought settle."},
  {name:"5. Crush mind with mind",inst:"Teeth clenched, tongue to palate — brought back by sheer resolve."},
];

const ANA_INT = [
  {title:"Know the length of the breath",inst:"Know when the in-breath is long, when it is short. Only knowing — not controlling.",sutta:"MN 118 — 1st tetrad"},
  {title:"Experience the whole body breathing",inst:"Let awareness expand to include the whole body. Let the breath breathe you.",sutta:"MN 118 — 1st tetrad"},
  {title:"Calm the bodily formation",inst:"With each out-breath, consciously release any tension. Let it calm.",sutta:"MN 118 — 1st tetrad"},
  {title:"Notice the feeling-tone of the breath",inst:"Is this breath pleasant, unpleasant, or neutral? Observe from a distance.",sutta:"MN 118 — 2nd tetrad"},
  {title:"Know the mind as it is",inst:"Is the mind gladdened? Contracted? Distracted? Know it as it is.",sutta:"MN 118 — 3rd tetrad"},
  {title:"Observe impermanence in the breath",inst:"Each breath arises. Each breath passes. Watch this directly.",sutta:"MN 118 — 4th tetrad"},
];

const INSIGHTS = [
  {quote:"Jātassa maraṇaṁ hoti — For one who is born, death is certain.",sutta:"SN 56.11",contemplation:"Maraṇa",seed:"Each moment that passes will not return. What truly matters in a day that is already passing?"},
  {quote:"Aniccā vata saṅkhārā — Truly impermanent are all conditioned things.",sutta:"DN 16",contemplation:"Anicca",seed:"The tea, the mood, the body, the praise — all arising and passing. Can you hold today's events more lightly?"},
  {quote:"Taṇhā ponobhavikā — Craving leads to renewed existence.",sutta:"SN 56.11",contemplation:"Jāti",seed:"Watch where craving moves today. Each pull is the wheel of birth turning."},
  {quote:"Appamādena sampādetha — Strive on with diligence.",sutta:"DN 16",contemplation:"Maraṇa",seed:"These were the Buddha's final words. What one thing, if done today, would make this day not wasted?"},
  {quote:"Manopubbaṅgamā dhammā — Mind is the forerunner of all actions.",sutta:"Dhp 1",contemplation:"Citta",seed:"Before the action, there is the thought. Before the thought, the intention."},
  {quote:"Natthi santiparam sukham — There is no happiness higher than peace.",sutta:"Dhp 202",contemplation:"Samādhi",seed:"Every craving for pleasure is a disturbance. Can you find even five minutes of true stillness today?"},
  {quote:"Yo ca vassasataṁ jīve — Better one day lived with wisdom than a hundred years without it.",sutta:"Dhp 111",contemplation:"Paññā",seed:"A long life is not the goal. A wakeful life is."},
];

const VEDANA_MOMENTS = [
  {moment:"The first sip of warm tea on a cold morning.",tone:"pleasant",pull:"The mind reaches: 'again, more, keep this.' Craving (taṇhā) is born right here, from a pleasant tone.",rest:"Pleasant is simply pleasant. It need not be seized. Let it arise and pass, unowned."},
  {moment:"A sharp, unexpected noise from the street.",tone:"unpleasant",pull:"The mind recoils: 'make it stop.' Aversion (paṭigha) is born here, from an unpleasant tone.",rest:"Unpleasant is simply unpleasant. The second arrow — resistance — need not be fired."},
  {moment:"Waiting at a red light with nothing to do.",tone:"neutral",pull:"The mind slides toward boredom and reaches for the phone. Delusion (moha) hides in the neutral.",rest:"Neutral is the hardest to see. Rest in it, and the compulsion to fill it weakens."},
  {moment:"A message notification lights up your screen.",tone:"pleasant",pull:"Anticipation pulls forward — 'who, what, more.' The reaching happens before you choose it.",rest:"See the pull itself as just another arising. You can let it glow and not grasp."},
  {moment:"A dull ache settles into your lower back.",tone:"unpleasant",pull:"The mind tightens around it: 'this shouldn't be here.' Tightening multiplies the ache.",rest:"The sensation is one thing; the resistance is another. Soften, and meet bare sensation."},
  {moment:"The hum of the refrigerator you usually never notice.",tone:"neutral",pull:"The mind has nothing to grab, so it drifts elsewhere, half-asleep.",rest:"Even the neutral can be known clearly. Knowing it is mindfulness itself."},
  {moment:"Someone smiles warmly at you in passing.",tone:"pleasant",pull:"The mind wants to hold it, replay it, make it mean something about 'me.'",rest:"A pleasant contact, complete in itself. No need to build a self around it."},
  {moment:"You remember an awkward thing you said yesterday.",tone:"unpleasant",pull:"The mind loops, replays, adds 'I always...' Proliferation (papañca) takes over.",rest:"A memory arose with an unpleasant tone. That is all. The looping is optional."},
  {moment:"You finish a routine task and pause before the next.",tone:"neutral",pull:"The gap feels uncomfortable; the mind hunts for the next stimulation.",rest:"The pause is not empty — it is space. Rest there for one breath before moving."},
  {moment:"A craving for something sweet arises after lunch.",tone:"pleasant",pull:"The image of the sweet pulls the body toward it before the mind has decided.",rest:"Watch craving as a visitor, not a command. It rises, peaks, and passes on its own."},
];

function playGong(){try{const c=new(window.AudioContext||window.webkitAudioContext)();[[220,.6,4],[440,.2,3]].forEach(([f,g,d])=>{const o=c.createOscillator(),gn=c.createGain();o.frequency.value=f;o.type="sine";gn.gain.setValueAtTime(g,c.currentTime);gn.gain.exponentialRampToValueAtTime(.001,c.currentTime+d);o.connect(gn);gn.connect(c.destination);o.start();o.stop(c.currentTime+d);});}catch(e){}}
function playBowl(){try{const c=new(window.AudioContext||window.webkitAudioContext)();[396,528,639].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.frequency.value=f;o.type="sine";g.gain.setValueAtTime(0,c.currentTime);g.gain.linearRampToValueAtTime(.15-i*.03,c.currentTime+.3);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+8);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+8);});}catch(e){}}

const todayKey=()=>{const d=new Date();d.setHours(d.getHours()-3);const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");return `${y}-${m}-${day}`;};

async function saveSection(sec,data){
  try{localStorage.setItem(`log:${todayKey()}:${sec}`,JSON.stringify({...data,date:todayKey()}));}catch(e){}
}
async function loadSection(sec){
  try{const r=localStorage.getItem(`log:${todayKey()}:${sec}`);return r?JSON.parse(r):null;}catch(e){return null;}
}
async function appendSession(type,data){
  try{const key=`sess:${todayKey()}:${type}`;let ex=[];try{const r=localStorage.getItem(key);if(r)ex=JSON.parse(r);}catch(e){}ex.push({...data,time:new Date().toISOString()});localStorage.setItem(key,JSON.stringify(ex));}catch(e){}
}
async function loadAllDays(){
  try{const days={};for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(!key)continue;try{const p=key.split(":"),type=p[0],d=p[1],s=p[2];if(!days[d])days[d]={};if(type==="log")days[d][s]=JSON.parse(localStorage.getItem(key));if(type==="sess"){if(!days[d].sessions)days[d].sessions={};days[d].sessions[s]=JSON.parse(localStorage.getItem(key));}}catch(e){}}return days;}catch(e){return{};}
}

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#fdf6e3}
.app{font-family:'EB Garamond',Georgia,serif;background:#fdf6e3;min-height:100vh}
.tbar{display:flex;gap:2px;padding:7px 7px 0;background:#fdf6e3;border-radius:16px 16px 0 0;border:1px solid #d4b86a;border-bottom:none;overflow-x:auto}
.tab{flex:1;min-width:46px;padding:7px 2px;font-size:10.5px;font-family:'EB Garamond',serif;background:none;border:none;cursor:pointer;color:#9a7d3a;border-bottom:2px solid transparent;white-space:nowrap;text-align:center}
.tab.on{color:#b8860b;border-bottom:2px solid #b8860b;font-weight:500}
.panel{padding:14px 13px;background:#fdf6e3;border-radius:0 0 16px 16px;border:1px solid #d4b86a;border-top:none;max-height:70vh;overflow-y:auto}
.st{font-size:11px;color:#9a7d3a;letter-spacing:.08em;text-transform:uppercase;margin-bottom:7px;margin-top:12px}
.st:first-child{margin-top:0}
.card{background:#fffdf5;border:1px solid #e0c97a;border-radius:10px;padding:12px;margin-bottom:9px}
.btn{background:none;border:1px solid #d4b86a;border-radius:8px;padding:9px 13px;font-family:'EB Garamond',serif;font-size:14px;color:#b8860b;cursor:pointer;width:100%;text-align:left;margin-bottom:7px;transition:background .15s;line-height:1.4}
.btn:hover{background:#f5e9c8}
.btn.wise{border-color:#7a9a5a;color:#3a5a1a;background:#f0f7e8}
.btn.rx{border-color:#c4906a;color:#8a4a2a}
.btn.pri{background:#f5e9c8;text-align:center}
.btn.sm{font-size:13px;padding:7px 11px}
.btn.lnk{border:none;color:#b8860b;text-decoration:underline;text-underline-offset:3px;padding:4px 0;width:auto;font-size:13px;display:inline;background:none}
.ibox{background:#f8f0d8;border-left:3px solid #b8860b;border-radius:0 8px 8px 0;padding:11px 13px;font-size:14px;line-height:1.75;color:#4a3a1a;margin:7px 0;font-style:italic;white-space:pre-line}
.bwrap{background:#e8ddb8;border-radius:8px;height:7px;margin:5px 0;overflow:hidden}
.bar{background:linear-gradient(90deg,#d4b86a,#b8860b);height:100%;border-radius:8px;transition:width .6s}
.srow{display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid #e8ddb8}
.srow:last-child{border-bottom:none}
.chk{width:22px;height:22px;border:1px solid #d4b86a;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:11px;margin-top:2px;user-select:none}
.chk.k{background:#7a9a5a;border-color:#7a9a5a;color:#fff}
.chk.m{background:#c4604a;border-color:#c4604a;color:#fff}
.chk.sq{border-radius:4px;width:24px;height:24px}
.chk.sq.ar{background:#c4604a;border-color:#c4604a;color:#fff}
.ta{width:100%;font-family:'EB Garamond',serif;font-size:14px;color:#4a3a1a;background:#fffdf5;border:1px solid #e0c97a;border-radius:8px;padding:9px;resize:none;line-height:1.6}
.inp{width:100%;font-family:'EB Garamond',serif;font-size:14px;color:#4a3a1a;background:#fffdf5;border:1px solid #e0c97a;border-radius:8px;padding:8px 11px;margin-bottom:7px}
.pill{display:inline-block;font-size:11px;padding:2px 8px;border-radius:12px;background:#e8ddb8;color:#8a6a2a;margin-left:6px}
.ov{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.55);z-index:100;display:flex;align-items:flex-start;justify-content:center;padding:16px 12px;overflow-y:auto}
.mod{background:#fdf6e3;border-radius:16px;border:1px solid #d4b86a;width:100%;max-width:440px;padding:18px;max-height:88vh;overflow-y:auto}
.tdis{font-size:50px;color:#b8860b;text-align:center;font-family:'EB Garamond',serif;letter-spacing:2px;padding:14px 0}
.hr2{display:flex;align-items:center;justify-content:space-between;padding:11px 13px 0}
.str{display:flex;align-items:center;gap:5px;font-size:13px;color:#9a7d3a}
.div{border:none;border-top:1px solid #e8ddb8;margin:10px 0}
.cgrid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-top:6px}
.cday{aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:12px;border-radius:6px;color:#9a7d3a}
.cday.hd{background:#f5e9c8;color:#b8860b;font-weight:500}
.cday.td{border:2px solid #b8860b}
.strow{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #e8ddb8;font-size:13px;color:#4a3a1a}
.strow:last-child{border-bottom:none}
.sv{color:#b8860b;font-weight:500;font-size:15px}
.ib{background:none;border:none;cursor:pointer;font-size:19px;padding:4px;line-height:1}
`;

const REPO_TITLES={
  sila:"Sīla — The Foundation",
  akusala:"The 10 Akusala — Seeing Them Clearly",
  kusala:"The 10 Kusala — Wholesome Deeds",
  hindrances:"The Five Hindrances — Removal of Each",
  metta:"Mettā | Loving-Kindness — Antidote to Byāpāda",
  karuna:"Karuṇā | Compassion — Antidote to Byāpāda",
  abhijja:"Abhijjhā — Investigation and Removal",
  mn20:"Removing Unwholesome Thoughts (MN 20)",
  noble:"The Four Noble Truths — Investigative Framework",
  walking:"Walking Meditation",
  indriya:"Indriyasaṃvara — Sense Restraint",
  satipatthana:"Satipatthāna — The Four Foundations",
  anapanasati:"Ānāpānasati — Breath as Anchor",
  jjvm:"Jāti Jarā Vyādhi Maraṇa (AN 5.57)",
  mn13:"The Beauty That Fades — Releasing Attachment to Forms (MN 13)",
  bahiya:"From Contact to Liberation — Breaking the Cycle at its Root",
  paticca:"Paṭicca-samuppāda — Dependent Origination in Daily Life",
  silavanta:"Sīlavanta Sutta — 11 Contemplations of the 5 Aggregates",
  mulapariyaya:"Mūlapariyāya Sutta — The Root of 'I' (MN 1)",
  carana:"15 Caraṇa Dhamma (MN 53)",
};

const TABS=[{id:"morning",label:"Morning"},{id:"journey",label:"Journey"},{id:"breath",label:"Breath"},{id:"satilog",label:"Sati Log"},{id:"evening",label:"Evening"},{id:"insight",label:"Insight"}];

export default function App(){
  const [tab,setTab]=useState("morning");
  const [showSet,setShowSet]=useState(false);
  const [showMenu,setShowMenu]=useState(false);
  const [mv,setMv]=useState("main");
  const [allDays,setAllDays]=useState({}); 
  const [selDay,setSelDay]=useState(null); 
  const [repoId,setRepoId]=useState(null);
  const [guided,setGuided]=useState(null);
  const [gStep,setGStep]=useState(0);
  const [gStart,setGStart]=useState(null);
  const [calMo,setCalMo]=useState(new Date());
  const [set,setSetting]=useState({showTasks:true,breathMins:20});

  const [intention,setIntention]=useState("");
  const [tasks,setTasks]=useState([{t:"",i:""},{t:"",i:""},{t:"",i:""}]);
  const [streak,setStreak]=useState(0);

  const [scIdx,setScIdx]=useState(()=>Math.floor(Math.random()*SCENARIOS.length));
  const [choice,setChoice]=useState(null);
  const [ji,setJi]=useState("");
  const [jMode,setJMode]=useState("scenario");
  const [vIdx,setVIdx]=useState(()=>Math.floor(Math.random()*VEDANA_MOMENTS.length));
  const [vGuess,setVGuess]=useState(null);
  const [vSeen,setVSeen]=useState(0);
  const [vRight,setVRight]=useState(0);
  const [loadJ,setLoadJ]=useState(false);
  const [mn20on,setMn20on]=useState(false);
  const [mn20pick,setMn20pick]=useState(null);
  const [mn20i,setMn20i]=useState("");
  const [loadMN,setLoadMN]=useState(false);
  const [still,setStill]=useState(0);

  const [breathOn,setBreathOn]=useState(false);
  const [breathSec,setBreathSec]=useState(set.breathMins*60);
  const [breathTot,setBreathTot]=useState(set.breathMins*60);
  const [breathInt,setBreathInt]=useState(null);
  const [breathNote,setBreathNote]=useState("");
  const [breathDone,setBreathDone]=useState(false);
  const bRef=useRef(null);

  const [silaS,setSilaS]=useState(Array(5).fill(null));
  const [silaN,setSilaN]=useState(Array(5).fill(""));

  const [satiLog,setSatiLog]=useState([]);
  const [satiDraft,setSatiDraft]=useState("");

  const [abh,setAbh]=useState(false);
  const [abhN,setAbhN]=useState("");
  const [bya,setBya]=useState(false);
  const [byaN,setByaN]=useState("");
  const [pullN,setPullN]=useState("");
  const [evN,setEvN]=useState("");
  const [evI,setEvI]=useState("");
  const [loadEv,setLoadEv]=useState(false);

  const [genI,setGenI]=useState("");
  const [loadGI,setLoadGI]=useState(false);

  const todayIns=INSIGHTS[new Date().getDay()%INSIGHTS.length];
  const sc=SCENARIOS[scIdx];
  const ch=sc.choices;

  useEffect(()=>{(async()=>{
    const m=await loadSection("morning");
    if(m){setIntention(m.intention||"");if(m.tasks)setTasks(m.tasks);}
    const s=await loadSection("sila");
    if(s){if(s.silaS)setSilaS(s.silaS);if(s.silaN)setSilaN(s.silaN);}
    const sl=await loadSection("satilog");
    if(sl&&sl.entries)setSatiLog(sl.entries);
    const e=await loadSection("evening");
    if(e){setAbh(!!e.abh);setAbhN(e.abhN||"");setBya(!!e.bya);setByaN(e.byaN||"");setPullN(e.pullN||"");setEvN(e.evN||"");}
  })();},[]);

  useEffect(()=>{
    if(breathOn){bRef.current=setInterval(()=>{setBreathSec(t=>{if(t<=1){clearInterval(bRef.current);setBreathOn(false);setBreathDone(true);playBowl();appendSession("breath",{durationMins:set.breathMins,intention:breathInt?.title,notes:breathNote});return 0;}if(t%300===0)playBowl();return t-1;});},1000);}else clearInterval(bRef.current);
    return()=>clearInterval(bRef.current);
  },[breathOn]);

  async function ai(p){
    try{
      const r=await fetch("/.netlify/functions/chat",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-5",
          max_tokens:800,
          system:"You are a warm Dhamma guide grounded in the Pali suttas. Respond in 2-4 sentences like a gentle experienced teacher. Reference Pali terms naturally. Never be preachy.",
          messages:[{role:"user",content:p}]
        })
      });
      const d=await r.json();
      return d.content?.[0]?.text||"";
    }catch(e){return "Unable to connect. Please check your internet connection.";}
  }

  async function pickChoice(c,i){
    if(choice!==null)return;
    setChoice(i);setLoadJ(true);
    const isAk=["abhijja","vyapada"].includes(sc.tag);
    const t=await ai(`Householder encounters: "${sc.text}". Response: "${c.text}". Dhamma lens: ${sc.tag}. Brief warm sutta-grounded reflection.`);
    setJi(t);setLoadJ(false);
    if(c.type==="wise")setStill(s=>Math.min(100,s+25));
    else if(isAk)setMn20on(true);
  }

  async function pickMN20(m,i){
    if(mn20pick!==null)return;
    setMn20pick(i);setLoadMN(true);
    const t=await ai(`Practitioner applies MN 20 "${m.name}" to ${sc.tag==="abhijja"?"abhijjā":"byāpāda"}. Method: "${m.inst}". One paragraph guided application.`);
    setMn20i(t);setLoadMN(false);
    setStill(s=>Math.min(100,s+20));
  }

  function nextSc(){setScIdx(i=>(i+1)%SCENARIOS.length);setChoice(null);setJi("");setMn20on(false);setMn20pick(null);setMn20i("");setLoadJ(false);setLoadMN(false);}

  function guessVedana(tone){
    if(vGuess!==null)return;
    setVGuess(tone);
    setVSeen(s=>s+1);
    if(tone===VEDANA_MOMENTS[vIdx].tone)setVRight(r=>r+1);
    if(tone===VEDANA_MOMENTS[vIdx].tone)setStill(s=>Math.min(100,s+10));
  }
  function nextVedana(){
    setVIdx(i=>{let n=i;while(n===i&&VEDANA_MOMENTS.length>1)n=Math.floor(Math.random()*VEDANA_MOMENTS.length);return n;});
    setVGuess(null);
  }

  async function doEvening(){
    setLoadEv(true);
    await saveSection("sila",{silaS,silaN});
    await saveSection("evening",{abh,abhN,bya,byaN,pullN,evN,still});
    const t=await ai(`Evening for ${USER}. Note:"${evN}". ${abh?`Abhijjhā arose:"${abhN}".`:"Abhijjhā clear."} ${bya?`Byāpāda arose:"${byaN}".`:"Byāpāda clear."} Pull:"${pullN||"none"}". Sīla:${silaS.filter(s=>s==="k").length}/5. Stillness:${still}%. Warm compassionate evening reflection. End with one sutta line.`);
    setEvI(t);setLoadEv(false);setStreak(s=>s+1);
  }

  async function doGenInsight(){
    setLoadGI(true);
    const themes=["anicca","dukkha","anattā","jāti","mettā","the householder's path","viriya","sense restraint"];
    const t=await ai(`Short profound reflection on ${themes[Math.floor(Math.random()*themes.length)]} for a householder practicing Dhamma daily. Core insight in 2-3 sentences plus one practical application. Cite a sutta naturally.`);
    setGenI(t);setLoadGI(false);
  }

  function saveMorning(){saveSection("morning",{intention,tasks});}
  function saveSila(){saveSection("sila",{silaS,silaN});}
  function addSatiEntry(){
    if(!satiDraft.trim())return;
    const now=new Date();
    const stamp=`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    const next=[...satiLog,{time:stamp,text:satiDraft.trim()}];
    setSatiLog(next);setSatiDraft("");
    saveSection("satilog",{entries:next});
  }
  function deleteSatiEntry(idx){
    const next=satiLog.filter((_,i)=>i!==idx);
    setSatiLog(next);
    saveSection("satilog",{entries:next});
  }
  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const bPct=breathTot>0?((breathTot-breathSec)/breathTot)*100:0;

  async function openLog(){const d=await loadAllDays();setAllDays(d);setMv("log");}

  function startGuided(steps,name){setGuided({steps,name});setGStep(0);setGStart(Date.now());setMv("guided");}
  function doneGuided(){const mins=gStart?Math.round((Date.now()-gStart)/60000):0;appendSession("practice",{practiceName:guided?.name||"practice",durationMins:mins});setGuided(null);setGStep(0);setGStart(null);setMv("repo_item");}

  function wkStats(){let bm=0,sk=0,se=0,ac=0,bc=0;const now=new Date();for(let i=0;i<7;i++){const d=new Date(now);d.setDate(d.getDate()-i);const key=d.toISOString().split("T")[0];const day=allDays[key];if(!day)continue;if(day.sessions?.breath)day.sessions.breath.forEach(s=>{bm+=s.durationMins||0;});if(day.sila){sk+=(day.sila.silaS||[]).filter(s=>s==="k").length;se++;}if(day.evening?.abh)ac++;if(day.evening?.bya)bc++;}return{bm,sk:se>0?Math.round(sk/se):null,ac,bc};}

  function closeMenu(){setShowMenu(false);setMv("main");setRepoId(null);setGuided(null);setGStep(0);setGStart(null);}

  return(<>
    <style>{CSS}</style>
    <div className="app">
      <div className="hr2">
        <button className="ib" onClick={()=>{setShowMenu(true);setMv("main");}}>☰</button>
        <div style={{textAlign:"center"}}><span style={{fontSize:"18px",color:"#b8860b"}}>🪷</span><span style={{fontSize:"15px",color:"#b8860b",fontFamily:"'EB Garamond',serif",fontWeight:500,marginLeft:6}}>The Ordinary Path</span></div>
        <button className="ib" onClick={()=>setShowSet(true)}>⚙️</button>
      </div>

      <div style={{margin:"8px 12px 0"}}>
        <div className="tbar">{TABS.map(t=><button key={t.id} className={`tab${tab===t.id?" on":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>
        <div className="panel">

          {tab==="morning"&&<div>
            <p style={{fontSize:"14px",color:"#6a5a3a",fontStyle:"italic",marginBottom:8}}>Good morning, {USER}.</p>
            <p className="st">Morning intention</p>
            <textarea className="ta" rows={2} placeholder="What kusala quality will you cultivate today?" value={intention} onChange={e=>setIntention(e.target.value)} onBlur={saveMorning}/>
            <div style={{display:"flex",alignItems:"center",gap:8,margin:"8px 0"}}>
              <span style={{fontSize:"13px",color:"#8a7a5a",fontStyle:"italic"}}>Begin with the chant:</span>
              <button className="btn lnk" onClick={()=>{setShowMenu(true);setMv("chant");}}>🪷 Open daily chant</button>
            </div>
            {set.showTasks&&<>
              <p className="st">Wise tasks — worldly duties, held rightly</p>
              {tasks.map((tk,i)=><div key={i} style={{marginBottom:8}}>
                <input className="inp" placeholder={`Task ${i+1}`} value={tk.t} onChange={e=>{const n=[...tasks];n[i]={...n[i],t:e.target.value};setTasks(n);}} onBlur={saveMorning}/>
                <input className="inp" style={{fontSize:"13px",color:"#8a7a5a"}} placeholder="In what spirit?" value={tk.i} onChange={e=>{const n=[...tasks];n[i]={...n[i],i:e.target.value};setTasks(n);}} onBlur={saveMorning}/>
              </div>)}
            </>}
            <button className="btn pri" onClick={()=>{saveMorning();setTab("journey");}}>Begin the day with mindfulness ›</button>
            <div className="str" style={{justifyContent:"center",marginTop:8}}><span>🔥</span><span>{streak} day streak</span></div>
          </div>}

          {tab==="journey"&&<div>
            <div style={{display:"flex",gap:6,marginBottom:12}}>
              <button className="btn sm" style={{textAlign:"center",background:jMode==="scenario"?"#f5e9c8":"none"}} onClick={()=>setJMode("scenario")}>Scenarios</button>
              <button className="btn sm" style={{textAlign:"center",background:jMode==="vedana"?"#f5e9c8":"none"}} onClick={()=>setJMode("vedana")}>Vedanā Sorter</button>
            </div>
            {jMode==="vedana"&&<div>
              <p className="st">Vedanā Sorter — catch the feeling-tone</p>
              <p style={{fontSize:"13px",color:"#8a7a5a",fontStyle:"italic",marginBottom:10,lineHeight:1.65}}>Before craving, before "I" — there is only a tone. Sort each moment by its bare feeling-tone, then watch what tends to follow.</p>
              <div className="card"><p style={{fontSize:"15px",color:"#4a3a1a",lineHeight:1.65,fontStyle:"italic"}}>{VEDANA_MOMENTS[vIdx].moment}</p></div>
              {vGuess===null
                ?<><p style={{fontSize:"13px",color:"#8a7a5a",marginBottom:8}}>What is the bare feeling-tone?</p>
                  <button className="btn wise" onClick={()=>guessVedana("pleasant")}>Pleasant — sukha</button>
                  <button className="btn" onClick={()=>guessVedana("neutral")}>Neutral — adukkhamasukha</button>
                  <button className="btn rx" onClick={()=>guessVedana("unpleasant")}>Unpleasant — dukkha</button></>
                :<><div className="ibox" style={{borderColor:vGuess===VEDANA_MOMENTS[vIdx].tone?"#7a9a5a":"#c4906a"}}>
                    <strong>{vGuess===VEDANA_MOMENTS[vIdx].tone?"Seen clearly.":"Look again."}</strong> The tone here is <strong>{VEDANA_MOMENTS[vIdx].tone}</strong>.{"\n\n"}<strong>What tends to follow:</strong> {VEDANA_MOMENTS[vIdx].pull}{"\n\n"}<strong>The gap:</strong> {VEDANA_MOMENTS[vIdx].rest}
                  </div>
                  <p style={{fontSize:"12px",color:"#9a7d3a",marginTop:6,marginBottom:8}}>Seen clearly: {vRight} of {vSeen}</p>
                  <button className="btn sm" onClick={nextVedana}>Next moment ›</button></>}
              <p style={{fontSize:"12px",color:"#9a7d3a",fontStyle:"italic",textAlign:"center",marginTop:14,lineHeight:1.6}}>"Vedanā paccayā taṇhā" — from feeling, craving arises.<br/>See the tone, and the chain can open.</p>
            </div>}
            {jMode==="scenario"&&<div>
            <p className="st">Today's scenario</p>
            <div className="card"><p style={{fontSize:"15px",color:"#4a3a1a",lineHeight:1.65,fontStyle:"italic"}}>{sc.text}</p><span className="pill">{sc.tag}</span></div>
            {choice===null&&<><p style={{fontSize:"13px",color:"#8a7a5a",marginBottom:8}}>How do you meet this moment?</p>{ch.map((c,i)=><button key={i} className={`btn ${c.type==="wise"?"wise":"rx"}`} onClick={()=>pickChoice(c,i)}>{c.text}</button>)}</>}
            {loadJ&&<p style={{color:"#9a7d3a",fontSize:"13px",fontStyle:"italic",padding:"7px 0"}}>The mind observes...</p>}
            {ji&&<div className="ibox">{ji}</div>}
            {mn20on&&mn20pick===null&&<>
              <p className="st" style={{color:"#8a4a2a",marginTop:10}}>MN 20 — five methods</p>
              {MN20.map((m,i)=><div key={i} style={{background:"#f8f0d8",border:"1px solid #e0c97a",borderRadius:8,padding:9,marginBottom:7,cursor:"pointer"}} onClick={()=>pickMN20(m,i)}>
                <p style={{fontSize:"13px",color:"#b8860b",fontWeight:500}}>{m.name}</p>
                <p style={{fontSize:"13px",color:"#6a5a3a",marginTop:3,fontStyle:"italic",lineHeight:1.6}}>{m.inst}</p>
              </div>)}
            </>}
            {loadMN&&<p style={{color:"#9a7d3a",fontSize:"13px",fontStyle:"italic",padding:"7px 0"}}>Applying the method...</p>}
            {mn20i&&<div className="ibox" style={{borderColor:"#7a9a5a"}}>{mn20i}</div>}
            {ji&&<><p style={{fontSize:"13px",color:"#9a7d3a",marginTop:10}}>Stillness cultivated</p><div className="bwrap"><div className="bar" style={{width:`${still}%`}}/></div><p style={{fontSize:"12px",color:"#9a7d3a",marginBottom:8}}>{still}% present</p><button className="btn sm" onClick={nextSc}>Next scenario ›</button></>}
            </div>}
          </div>}

          {tab==="breath"&&<div>
            <p className="st">Session intention — MN 118</p>
            {ANA_INT.map((a,i)=><div key={i} style={{background:breathInt?.title===a.title?"#f0f7e8":"#fffdf5",border:`1px solid ${breathInt?.title===a.title?"#7a9a5a":"#e0c97a"}`,borderRadius:8,padding:"8px 11px",marginBottom:6,cursor:"pointer"}} onClick={()=>{if(!breathOn)setBreathInt(a);}}>
              <p style={{fontSize:"13px",color:"#4a3a1a",fontWeight:500}}>{a.title}</p>
              <p style={{fontSize:"11px",color:"#8a7a5a",fontStyle:"italic",marginTop:1}}>{a.sutta}</p>
            </div>)}
            {breathInt&&<div className="ibox" style={{marginBottom:8}}>{breathInt.inst}</div>}
            <div className="tdis">{fmt(breathSec)}</div>
            <div className="bwrap" style={{height:9,marginBottom:12}}><div className="bar" style={{width:`${bPct}%`}}/></div>
            <div style={{display:"flex",gap:7,marginBottom:9}}>
              <button className="btn pri" style={{flex:1,textAlign:"center"}} onClick={()=>{if(!breathDone){setBreathOn(r=>!r);if(!breathOn)playBowl();}}}>{breathOn?"Pause":breathDone?"Done ✓":"Begin"}</button>
              <button className="btn sm" style={{flex:.5,textAlign:"center"}} onClick={()=>{setBreathOn(false);setBreathSec(set.breathMins*60);setBreathTot(set.breathMins*60);setBreathDone(false);}}>Reset</button>
              <button className="btn sm" style={{flex:.3,textAlign:"center"}} onClick={playBowl}>🔔</button>
            </div>
            {breathDone&&<><p className="st">Session note</p><textarea className="ta" rows={2} placeholder="What did you observe?" value={breathNote} onChange={e=>setBreathNote(e.target.value)}/><div className="ibox" style={{marginTop:6}}>Sādhu. {set.breathMins} minutes of ānāpānasati. This is not a small thing.</div></>}
          </div>}

         {tab==="satilog"&&<div>
            <p className="st">Sati Log — what arose this hour</p>
            <p style={{fontSize:"13px",color:"#8a7a5a",fontStyle:"italic",marginBottom:10,lineHeight:1.65}}>Pause through the day. Note what arose, what pulled you, what sīla was touched.</p>
            <textarea className="ta" rows={3} placeholder="What arose? What pulled the mind? Which precept was near?" value={satiDraft} onChange={e=>setSatiDraft(e.target.value)}/>
            <button className="btn pri sm" style={{marginTop:7}} onClick={addSatiEntry}>＋ Add entry</button>
            <div style={{marginTop:14,background:"#fffdf5",border:"1px solid #e0c97a",borderRadius:10,padding:"4px 14px",backgroundImage:"repeating-linear-gradient(#fffdf5,#fffdf5 31px,#ece0b8 32px)",lineHeight:"32px",minHeight:128}}>
              {satiLog.length===0&&<p style={{fontSize:"13px",color:"#b8a06a",fontStyle:"italic",lineHeight:"32px"}}>The page is empty. The first pause begins it.</p>}
              {satiLog.map((e,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,borderBottom:"none"}}>
                <span style={{fontSize:"12px",color:"#b8860b",fontWeight:500,flexShrink:0,fontVariantNumeric:"tabular-nums",lineHeight:"32px"}}>{e.time}</span>
                <span style={{fontSize:"13px",color:"#4a3a1a",flex:1,lineHeight:"32px"}}>{e.text}</span>
                <button className="ib" style={{fontSize:"13px",color:"#c4906a",lineHeight:"32px",padding:0}} onClick={()=>deleteSatiEntry(i)}>✕</button>
              </div>)}
            </div>
            <p style={{fontSize:"12px",color:"#9a7d3a",fontStyle:"italic",textAlign:"center",marginTop:12,lineHeight:1.6}}>"Sato sampajāno" — mindful and clearly knowing.<br/>Set hourly reminders in your calendar (see menu).</p>
          </div>}

          {tab==="evening"&&<div>
            <p className="st">Pañca Sīla — today's honest log</p>
            <p style={{fontSize:"13px",color:"#8a7a5a",fontStyle:"italic",marginBottom:10,lineHeight:1.65}}>"Aṇumattesu vajjesu bhayadassāvī" — seeing danger in the slightest fault.</p>
            {SILA5.map((s,i)=><div key={i} className="srow">
              <div style={{display:"flex",gap:5,flexShrink:0,marginTop:3}}>
                <div className={`chk${silaS[i]==="k"?" k":""}`} onClick={()=>setSilaS(st=>{const n=[...st];n[i]=n[i]==="k"?null:"k";return n;})}>{silaS[i]==="k"&&"✓"}</div>
                <div className={`chk${silaS[i]==="m"?" m":""}`} onClick={()=>setSilaS(st=>{const n=[...st];n[i]=n[i]==="m"?null:"m";return n;})}>{silaS[i]==="m"&&"✕"}</div>
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:"13px",color:"#4a3a1a",fontStyle:"italic",lineHeight:1.5}}>{s.pali}</p>
                <p style={{fontSize:"12px",color:"#8a7a5a"}}>{s.en}</p>
                {silaS[i]==="m"&&<textarea className="ta" style={{marginTop:6,minHeight:60}} rows={3} placeholder={s.prompt} value={silaN[i]} onChange={e=>setSilaN(n=>{const nn=[...n];nn[i]=e.target.value;return nn;})} onBlur={saveSila}/>}
              </div>
            </div>)}
            <div style={{display:"flex",gap:10,marginTop:12,marginBottom:4,justifyContent:"center"}}>
              {[{v:silaS.filter(s=>s==="k").length,l:"Kept",c:"#4a6a2a"},{v:silaS.filter(s=>s==="m").length,l:"Missed",c:"#8a4a2a"},{v:5-silaS.filter(s=>s==="k").length-silaS.filter(s=>s==="m").length,l:"Unlogged",c:"#9a7d3a"}].map(({v,l,c})=>(
                <div key={l} style={{textAlign:"center"}}><p style={{fontSize:"22px",color:c,fontWeight:500}}>{v}</p><p style={{fontSize:"11px",color:"#8a7a5a"}}>{l}</p></div>
              ))}
            </div>
            <hr className="div"/>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <span style={{fontSize:"13px",color:"#8a7a5a",fontStyle:"italic"}}>Close with the chant:</span>
              <button className="btn lnk" onClick={()=>{setShowMenu(true);setMv("chant");}}>🪷 Open daily chant</button>
            </div>
            <p className="st">Did abhijjhā arise today?</p>
            <div style={{display:"flex",gap:8,marginBottom:7,alignItems:"center"}}>
              <div className={`chk sq${abh?" ar":""}`} onClick={()=>setAbh(v=>!v)}>{abh&&"✕"}</div>
              <span style={{fontSize:"13px",color:"#4a3a1a",fontStyle:"italic"}}>Abhijjhā — covetousness</span>
            </div>
            {abh&&<textarea className="ta" rows={3} style={{marginBottom:9}} placeholder="Where did it arise? What triggered it?" value={abhN} onChange={e=>setAbhN(e.target.value)}/>}
           {(abh||bya)&&<div style={{margin:"6px 0 10px"}}><span style={{fontSize:"13px",color:"#8a7a5a",fontStyle:"italic"}}>Having seen this arise: </span><button className="btn lnk" onClick={()=>{setShowMenu(true);setRepoId("mn20");setMv("repo_item");}}>explore Removing Unwholesome Thoughts (MN 20) ›</button></div>}
            <p className="st">Did byāpāda arise today?</p>
            <div style={{display:"flex",gap:8,marginBottom:7,alignItems:"center"}}>
              <div className={`chk sq${bya?" ar":""}`} onClick={()=>setBya(v=>!v)}>{bya&&"✕"}</div>
              <span style={{fontSize:"13px",color:"#4a3a1a",fontStyle:"italic"}}>Byāpāda — ill-will</span>
            </div>
            {bya&&<textarea className="ta" rows={3} style={{marginBottom:9}} placeholder="Where did it arise?" value={byaN} onChange={e=>setByaN(e.target.value)}/>}
            <p className="st">What pulled your time today?</p>
            <textarea className="ta" rows={3} style={{marginBottom:9}} placeholder="Screens, worry, procrastination..." value={pullN} onChange={e=>setPullN(e.target.value)}/>
            <p className="st">Evening reflection</p>
            <textarea className="ta" rows={3} placeholder="How was the day overall?" value={evN} onChange={e=>setEvN(e.target.value)}/>
            <div style={{display:"flex",gap:8,margin:"10px 0"}}>
              {[{v:`${still}%`,l:"Stillness",c:"#b8860b"},{v:`${silaS.filter(s=>s==="k").length}/5`,l:"Sīla",c:"#4a6a2a"}].map(({v,l,c})=>(
                <div key={l} className="card" style={{flex:1,textAlign:"center",padding:"8px 6px"}}><p style={{fontSize:"18px",color:c,fontWeight:500}}>{v}</p><p style={{fontSize:"10px",color:"#8a7a5a"}}>{l}</p></div>
              ))}
            </div>
            <button className="btn pri" onClick={doEvening}>Receive evening reflection ›</button>
            {loadEv&&<p style={{color:"#9a7d3a",fontSize:"13px",fontStyle:"italic",padding:"7px 0"}}>The day is seen clearly...</p>}
            {evI&&<><div className="ibox" style={{marginTop:8}}>{evI}</div><div style={{textAlign:"center",marginTop:12}}><p style={{fontSize:"13px",color:"#9a7d3a",fontStyle:"italic"}}>"Santuṭṭho" — content and satisfied.<br/>Rest well.</p><div className="str" style={{justifyContent:"center",marginTop:8}}><span>🔥</span><span>{streak} day streak</span></div></div></>}
          </div>}

          {tab==="insight"&&<div>
            <p className="st">Daily contemplation</p>
            <div className="card">
              <p style={{fontSize:"11px",color:"#9a7d3a",letterSpacing:".06em",marginBottom:5}}>{todayIns.contemplation.toUpperCase()}</p>
              <p style={{fontSize:"15px",color:"#4a3a1a",fontStyle:"italic",lineHeight:1.7,marginBottom:8}}>{todayIns.quote}</p>
              <p style={{fontSize:"12px",color:"#9a7d3a",marginBottom:6}}>{todayIns.sutta}</p>
              <hr className="div"/>
              <p style={{fontSize:"13px",color:"#6a5a3a",lineHeight:1.75}}>{todayIns.seed}</p>
            </div>
            <button className="btn sm pri" onClick={doGenInsight}>Generate random Dhamma reflection ›</button>
            {loadGI&&<p style={{color:"#9a7d3a",fontSize:"13px",fontStyle:"italic",padding:"7px 0"}}>The Dhamma arises...</p>}
            {genI&&<div className="ibox">{genI}</div>}
            <p className="st" style={{marginTop:12}}>The four reflections — AN 5.57</p>
            {[["Jāti","I too am subject to birth.","#e8f0d8","#4a6a2a"],["Jarā","I too am subject to ageing.","#f0e8d8","#6a4a2a"],["Vyādhi","I too am subject to sickness.","#e8d8e8","#5a3a5a"],["Maraṇa","I too am subject to death.","#e8e0d0","#5a4a3a"]].map(([n,t,bg,col])=>(
              <div key={n} style={{background:bg,borderRadius:8,padding:"9px 11px",marginBottom:7}}><p style={{fontSize:"13px",fontWeight:500,color:col,marginBottom:2}}>{n}</p><p style={{fontSize:"13px",color:col,fontStyle:"italic",lineHeight:1.6}}>{t}</p></div>
            ))}
            <div style={{marginTop:14,padding:"10px 0",borderTop:"1px solid #e8ddb8",textAlign:"center"}}>
            <p style={{fontSize:"12px",color:"#9a7d3a",fontStyle:"italic"}}>Explore further at <a href="https://depth-of-dhamma.net" target="_blank" rel="noopener noreferrer" style={{color:"#b8860b",borderBottom:"1px dotted #d4b86a"}}>depth-of-dhamma.net ↗</a></p>
          </div>
          </div>}

        </div>
      </div>
      <p style={{textAlign:"center",fontSize:"11px",color:"#b8a06a",padding:"6px 0 12px",fontStyle:"italic"}}>sādhu · sādhu · sādhu</p>

      {showSet&&<div className="ov" onClick={()=>setShowSet(false)}><div className="mod" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <p style={{fontSize:"16px",color:"#b8860b",fontWeight:500}}>Settings</p>
          <button className="ib" onClick={()=>setShowSet(false)}>✕</button>
        </div>
        <p className="st">Sections</p>
        <label style={{display:"flex",alignItems:"center",gap:8,fontSize:"14px",color:"#4a3a1a",marginBottom:10,cursor:"pointer"}}>
          <input type="checkbox" checked={set.showTasks} onChange={e=>setSetting(s=>({...s,showTasks:e.target.checked}))}/>Show Wise Tasks in Morning tab
        </label>
        <p className="st">Breath duration</p>
        <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:10}}>
          {[5,10,15,20,30,45].map(d=><button key={d} className="btn sm" style={{width:"auto",flex:"none",background:set.breathMins===d?"#f5e9c8":"none"}} onClick={()=>{setSetting(s=>({...s,breathMins:d}));setBreathSec(d*60);setBreathTot(d*60);}}>{d} min</button>)}
        </div>
        <button className="btn pri" style={{marginTop:10}} onClick={()=>setShowSet(false)}>Save & close</button>
      </div></div>}

      {showMenu&&<div className="ov" onClick={closeMenu}><div className="mod" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {mv!=="main"&&<button className="ib" style={{fontSize:"16px"}} onClick={()=>{if(mv==="guided"){setMv("repo_item");}else if(mv==="repo_item"){setMv("repo");}else if(mv==="logday"){setMv("log");}else setMv("main");}}>←</button>}
            <p style={{fontSize:"15px",color:"#b8860b",fontWeight:500}}>{mv==="main"?"Menu":mv==="chant"?"Daily Chant":mv==="repo"?"Knowledge Repository":mv==="guided"?"Guided Practice":mv==="logday"?selDay?.key||"Log Entry":mv==="repo_item"&&repoId?REPO_TITLES[repoId]||REPO_DATA[repoId]?.title||"Teaching":"Practice Log"}</p>
          </div>
          <button className="ib" onClick={closeMenu}>✕</button>
        </div>
        {mv==="main"&&<>
          <button className="btn" onClick={()=>setMv("chant")}>🪷 Daily chant</button>
          <button className="btn" onClick={openLog}>📅 Practice log</button>
          <button className="btn" onClick={()=>setMv("repo")}>📚 Knowledge repository</button>
        </>}
        {mv==="chant"&&<>
          <p style={{fontSize:"12px",color:"#9a7d3a",textAlign:"center",marginBottom:8}}>Recite three times daily</p>
          <div className="card"><p style={{fontSize:"14px",lineHeight:2.1,color:"#4a3a1a",fontStyle:"italic",textAlign:"center",padding:"8px 0"}}>{CHANT}</p></div>
          <p className="st">Line by line</p>
          {CHANT_LINES.map(([p,e])=><div key={p} style={{padding:"7px 0",borderBottom:"1px solid #e8ddb8"}}><p style={{fontSize:"13px",color:"#4a3a1a",fontStyle:"italic"}}>{p}</p><p style={{fontSize:"12px",color:"#8a7a5a",marginTop:2}}>{e}</p></div>)}
          <button className="btn sm" style={{marginTop:10,textAlign:"center"}} onClick={playGong}>🔔 Sound gong</button>
        </>}
       {mv==="repo"&&<>
          <p style={{fontSize:"12px",color:"#8a7a5a",fontStyle:"italic",marginBottom:10}}>Tap any topic to read the teaching.</p>
          {Object.entries(REPO_DATA).map(([id,item])=><div key={id} style={{background:"#fffdf5",border:"1px solid #e0c97a",borderRadius:10,padding:"11px 13px",marginBottom:8,cursor:"pointer"}} onClick={()=>{setRepoId(id);setMv("repo_item");}}>
          <p style={{fontSize:"14px",color:"#b8860b",fontWeight:500}}>{REPO_TITLES[id]||item.title||id}</p>
          <p style={{fontSize:"12px",color:"#9a7d3a",marginTop:2}}>{item.sutta||""}</p>
          </div>)}
        </>}
       {mv==="repo_item"&&repoId&&REPO_DATA[repoId]&&<>
          <p style={{fontSize:"12px",color:"#9a7d3a",marginBottom:8}}>{REPO_DATA[repoId].sutta}</p>
          <div style={{fontSize:"14px",color:"#4a3a1a",lineHeight:1.8,marginBottom:8,whiteSpace:"pre-line"}}>{REPO_DATA[repoId].teaching}</div>
          {REPO_DATA[repoId].steps&&<><p className="st">The Practice</p>{REPO_DATA[repoId].steps.map((s,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:8}}><span style={{fontSize:"13px",color:"#b8860b",fontWeight:500,flexShrink:0}}>{i+1}.</span><p style={{fontSize:"13px",color:"#4a3a1a",lineHeight:1.7}}>{s}</p></div>)}</>}
          {REPO_DATA[repoId].guided&&<button className="btn pri" style={{marginTop:8}} onClick={()=>startGuided(REPO_DATA[repoId].guided,REPO_DATA[repoId].title||repoId)}>Guide me through this now ›</button>}
        </>}
        {mv==="guided"&&guided&&<>
          <p style={{fontSize:"12px",color:"#9a7d3a",fontStyle:"italic",marginBottom:8}}>{guided.name}</p>
          <p style={{fontSize:"12px",color:"#b8a06a",marginBottom:8}}>Step {gStep+1} of {guided.steps.length} — {guided.steps[gStep].title}</p>
          <div style={{background:"#f8f0d8",borderRadius:10,padding:14,marginBottom:10,fontSize:"14px",color:"#4a3a1a",lineHeight:1.8,whiteSpace:"pre-line"}}>{guided.steps[gStep].instruction}</div>
          <div className="bwrap" style={{marginBottom:12}}><div className="bar" style={{width:`${((gStep+1)/guided.steps.length)*100}%`}}/></div>
        {gStep<guided.steps.length-1
          ?<button className="btn pri" onClick={()=>{playBowl();setGStep(s=>s+1);}}>I have done this ›</button>
          :<><div className="ibox">Notice the quality of the mind. This turning toward — however small — is the path itself.</div><button className="btn pri" style={{marginTop:8}} onClick={doneGuided}>Complete practice ✓</button></>}
        </>}
       {mv==="log"&&<>
  {(()=>{const s=wkStats();return(<><p className="st">This week</p><div className="card">{[["Breath watched",s.bm>0?`${s.bm} min`:"none yet"],["Sīla avg",s.sk!==null?`${s.sk}/5`:"—"],["Abhijjhā arose",`${s.ac} days`],["Byāpāda arose",`${s.bc} days`]].map(([l,v])=><div className="strow" key={l}><span>{l}</span><span className="sv">{v}</span></div>)}</div></>);})()}
  <p className="st" style={{marginTop:12}}>Calendar — tap a highlighted date</p>
  {(()=>{const yr=calMo.getFullYear(),mo=calMo.getMonth(),fd=new Date(yr,mo,1).getDay(),dim=new Date(yr,mo+1,0).getDate(),ts=todayKey(),mns=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];const cells=[];for(let i=0;i<fd;i++)cells.push(<div key={`e${i}`}/>);for(let d=1;d<=dim;d++){const k=`${yr}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;cells.push(<div key={k} className={`cday${allDays[k]?" hd":""}${k===ts?" td":""}`} style={{cursor:allDays[k]?"pointer":"default"}} onClick={()=>{if(allDays[k]){setSelDay({key:k,data:allDays[k]});setMv("logday");}}}>{d}</div>);}
  return(<><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><button className="btn sm" style={{width:"auto"}} onClick={()=>setCalMo(m=>{const n=new Date(m);n.setMonth(n.getMonth()-1);return n;})}>‹</button><p style={{fontSize:"14px",color:"#b8860b",fontWeight:500}}>{mns[mo]} {yr}</p><button className="btn sm" style={{width:"auto"}} onClick={()=>setCalMo(m=>{const n=new Date(m);n.setMonth(n.getMonth()+1);return n;})}>›</button></div><div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>{["S","M","T","W","T","F","S"].map((d,i)=><div key={i} style={{textAlign:"center",fontSize:"11px",color:"#9a7d3a"}}>{d}</div>)}</div><div className="cgrid">{cells}</div></>);})()}
</>}
{mv==="logday"&&selDay&&(()=>{const{key,data:d}=selDay;return(<>
  <p style={{fontSize:"15px",color:"#b8860b",fontWeight:500,marginBottom:10}}>{key}</p>
  {d.morning&&<><p className="st">Intention</p><p style={{fontSize:"14px",color:"#4a3a1a",lineHeight:1.7,marginBottom:6,fontStyle:"italic"}}>{d.morning.intention||"—"}</p>
  {d.morning.tasks&&d.morning.tasks.filter(t=>t.t).length>0&&<><p className="st">Tasks</p>{d.morning.tasks.filter(t=>t.t).map((t,i)=><div key={i} style={{marginBottom:6}}><p style={{fontSize:"13px",color:"#4a3a1a"}}>{t.t}</p>{t.i&&<p style={{fontSize:"12px",color:"#8a7a5a",fontStyle:"italic"}}>{t.i}</p>}</div>)}</>}</>}
  {d.sila&&<><p className="st">Sīla</p><div className="card">{SILA5.map((s,i)=><div key={i} style={{marginBottom:5}}><span style={{fontSize:"12px",color:"#4a3a1a"}}>{s.pali.split("·")[0].trim()}: </span><span style={{fontSize:"12px",color:d.sila.silaS?.[i]==="k"?"#4a6a2a":d.sila.silaS?.[i]==="m"?"#c4604a":"#9a7d3a",fontWeight:500}}>{d.sila.silaS?.[i]==="k"?"kept":d.sila.silaS?.[i]==="m"?"missed":"unlogged"}</span>{d.sila.silaN?.[i]&&<p style={{fontSize:"12px",color:"#8a7a5a",fontStyle:"italic",marginTop:2}}>{d.sila.silaN[i]}</p>}</div>)}</div></>}
  {d.evening&&<><p className="st">Evening</p><div className="card"><p style={{fontSize:"13px",color:"#4a3a1a",lineHeight:1.8}}><strong>Abhijjhā:</strong> {d.evening.abh?"arose":"clear"}{d.evening.abhN&&<><br/><span style={{color:"#8a7a5a",fontStyle:"italic"}}>{d.evening.abhN}</span></>}<br/><strong>Byāpāda:</strong> {d.evening.bya?"arose":"clear"}{d.evening.byaN&&<><br/><span style={{color:"#8a7a5a",fontStyle:"italic"}}>{d.evening.byaN}</span></>}{d.evening.pullN&&<><br/><strong>What pulled:</strong> <span style={{color:"#8a7a5a",fontStyle:"italic"}}>{d.evening.pullN}</span></>}{d.evening.evN&&<><br/><strong>Reflection:</strong> <span style={{color:"#8a7a5a",fontStyle:"italic"}}>{d.evening.evN}</span></>}</p></div></>}
  {d.sessions?.breath?.length>0&&<><p className="st">Breath sessions</p>{d.sessions.breath.map((s,i)=><div key={i} className="card" style={{padding:"8px 10px",marginBottom:5}}><p style={{fontSize:"13px",color:"#4a3a1a"}}>{s.durationMins} min{s.intention?` — ${s.intention}`:""}</p>{s.notes&&<p style={{fontSize:"12px",color:"#8a7a5a",fontStyle:"italic",marginTop:2}}>{s.notes}</p>}</div>)}</>}
  {d.sessions?.practice?.length>0&&<><p className="st">Guided practice</p>{d.sessions.practice.map((s,i)=><div key={i} className="card" style={{padding:"8px 10px",marginBottom:5}}><p style={{fontSize:"13px",color:"#4a3a1a"}}>{s.practiceName}{s.durationMins>0?` — ${s.durationMins} min`:""}</p></div>)}</>}
  <button className="btn sm" style={{marginTop:8}} onClick={()=>setMv("log")}>← Back to calendar</button>
</>);})()}
      </div></div>}
    </div>
  </>);
}
