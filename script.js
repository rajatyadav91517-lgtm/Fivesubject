// Category-wise overall cut-off
const CATEGORY_CUTOFF = { GEN: 100, OBC: 92, SC: 85, ST: 80 };

// Category-wise sectional cut-offs
const SECTIONAL_CUTOFF = {
  hindu: { GEN:12, OBC:10, SC:8, ST:6 },
  ca: { GEN:12, OBC:10, SC:8, ST:6 },
  desc: { GEN:12, OBC:10, SC:8, ST:6 },
  weeklyH: { GEN:35, OBC:30, SC:25, ST:22 },
  weeklyCA: { GEN:30, OBC:26, SC:22, ST:20 }
};

const SUBJECTS = {
  hindu: { total:20 },
  ca: { total:20 },
  desc: { total:30 },
  weeklyH: { total:60 },
  weeklyCA: { total:70 }
};

// Original 8 students (all GENERAL)
const USERS = {
  "9151701": { password:"91517001", dob:"05-07-2000", name:"Deepanshu Yadav", category:"GEN", hindu:20, ca:20, desc:28, weeklyH:55, weeklyCA:62 },
  "8504002": { password:"85040002", dob:"25-11-2004", name:"Nikita Soni", category:"GEN", hindu:18, ca:11, desc:18, weeklyH:42, weeklyCA:40 },
  "8756203": { password:"87562003", dob:"10-08-2002", name:"Jyoti Yadav", category:"GEN", hindu:19, ca:18, desc:25, weeklyH:48, weeklyCA:52 },
  "6001104": { password:"60011004", dob:"29-11-1999", name:"Priyanka Dev", category:"GEN", hindu:17, ca:16, desc:20, weeklyH:46, weeklyCA:45 },
  "6205705": { password:"62057005", dob:"25-12-2003", name:"Priyanka Verma", category:"GEN", hindu:6, ca:8, desc:12, weeklyH:20, weeklyCA:22 },
  "8303906": { password:"83039006", dob:"27-07-2003", name:"Adweta Sen", category:"GEN", hindu:0, ca:0, desc:0, weeklyH:0, weeklyCA:0 },
  "7878107": { password:"78781007", dob:"02-02-2002", name:"Shivani Jha", category:"GEN", hindu:6, ca:10, desc:10, weeklyH:22, weeklyCA:25 },
  "8534808": { password:"85348008", dob:"06-06-2002", name:"Shweta Yadav", category:"GEN", hindu:8, ca:13, desc:14, weeklyH:30, weeklyCA:35 }
};

// Captcha
let a = Math.floor(Math.random()*9)+1;
let b = Math.floor(Math.random()*9)+1;
document.getElementById("captchaQ").textContent = `${a} + ${b} = ?`;

function getTotal(u){
  return u.hindu + u.ca + u.desc + u.weeklyH + u.weeklyCA;
}

function getIndicatorClass(score, cutoff){
  if(score >= cutoff) return "indicator-green";
  if(score >= cutoff * 0.9) return "indicator-orange";
  return "indicator-red";
}

function getBadge(score, cutoff){
  if(score >= cutoff) return '<span class="badge-green">Above Cut-off</span>';
  if(score >= cutoff * 0.9) return '<span class="badge-orange">Near Cut-off</span>';
  return '<span class="badge-red">Below Cut-off</span>';
}

function renderSection(idScore, idCut, scored, total, cutoff){
  const cls = getIndicatorClass(scored, cutoff);
  const badge = getBadge(scored, cutoff);
  document.getElementById(idScore).innerHTML =
    `<span class="${cls}">${scored}/${total}${scored >= cutoff ? "" : " *"}</span> ${badge}`;
  document.getElementById(idCut).textContent = cutoff;
}

function login(){
  const roll = document.getElementById("roll").value.trim();
  const pass = document.getElementById("password").value.trim();
  const dob = document.getElementById("dob").value.trim();
  const cap = document.getElementById("captchaAns").value.trim();
  const err = document.getElementById("error");

  if(!roll || !pass || !dob || !cap){
    err.textContent = "Please fill all fields.";
    return;
  }
  if(parseInt(cap) !== a + b){
    err.textContent = "Invalid captcha.";
    return;
  }
  if(!USERS[roll] || USERS[roll].password !== pass || USERS[roll].dob !== dob){
    err.textContent = "Invalid credentials.";
    return;
  }
  err.textContent = "";
  showResult(roll);
}

function showResult(roll){
  const u = USERS[roll];
  const cat = u.category;

  // Rank & Percentile
  const totals = Object.values(USERS).map(x => getTotal(x)).sort((a,b)=>b-a);
  const myTotal = getTotal(u);
  const rank = totals.indexOf(myTotal) + 1;
  const percentile = (((totals.length - rank) / totals.length) * 100).toFixed(2);

  // Topper highlight
  const topperTotal = totals[0];
  const topper = Object.values(USERS).find(x => getTotal(x) === topperTotal);
  document.getElementById("topperInfo").textContent =
    `${topper.name} – ${topperTotal} Marks`;

  let nameWithBadge = u.name;
  if(rank === 1) nameWithBadge += " 🥇 Gold";
  else if(rank === 2) nameWithBadge += " 🥈 Silver";
  else if(rank === 3) nameWithBadge += " 🥉 Bronze";

  document.getElementById("name").textContent = nameWithBadge;
  document.getElementById("rollShow").textContent = roll;
  document.getElementById("category").textContent = cat;
  document.getElementById("rank").textContent = rank;
  document.getElementById("percentile").textContent = percentile + "%";

  // Sections with color indicators
  renderSection("hindu", "cut_hindu", u.hindu, SUBJECTS.hindu.total, SECTIONAL_CUTOFF.hindu[cat]);
  renderSection("ca", "cut_ca", u.ca, SUBJECTS.ca.total, SECTIONAL_CUTOFF.ca[cat]);
  renderSection("desc", "cut_desc", u.desc, SUBJECTS.desc.total, SECTIONAL_CUTOFF.desc[cat]);
  renderSection("weeklyH", "cut_weeklyH", u.weeklyH, SUBJECTS.weeklyH.total, SECTIONAL_CUTOFF.weeklyH[cat]);
  renderSection("weeklyCA", "cut_weeklyCA", u.weeklyCA, SUBJECTS.weeklyCA.total, SECTIONAL_CUTOFF.weeklyCA[cat]);

  // Overall with indicator
  const total = myTotal;
  document.getElementById("total").innerHTML =
    `<span class="${getIndicatorClass(total, CATEGORY_CUTOFF[cat])}">${total}</span>`;
  document.getElementById("cutoff").textContent = CATEGORY_CUTOFF[cat];

  const qualified =
    u.hindu >= SECTIONAL_CUTOFF.hindu[cat] &&
    u.ca >= SECTIONAL_CUTOFF.ca[cat] &&
    u.desc >= SECTIONAL_CUTOFF.desc[cat] &&
    u.weeklyH >= SECTIONAL_CUTOFF.weeklyH[cat] &&
    u.weeklyCA >= SECTIONAL_CUTOFF.weeklyCA[cat] &&
    total >= CATEGORY_CUTOFF[cat];

  const status = document.getElementById("status");
  status.textContent = qualified ? "Qualified" : "Not Qualified";
  status.className = qualified ? "pass" : "fail";

  // Accuracy (objective sections only)
  const totalQ = 20 + 20 + 60 + 60;
  const correct = u.hindu + u.ca + u.weeklyH + u.weeklyCA;
  const accuracy = ((correct / totalQ) * 100).toFixed(2);
  document.getElementById("accuracy").textContent = accuracy + "%";

  document.getElementById("loginCard").style.display = "none";
  document.getElementById("resultCard").style.display = "block";
}

function downloadMarksheet(){
  html2pdf().from(document.getElementById("resultCard")).save("Marksheet.pdf");
}

function logout(){
  location.reload();
}
