const OVERALL_CUTOFF = 100;

const SUBJECTS = {
  hindu: { total:20, cutoff:12 },
  ca: { total:20, cutoff:12 },
  desc: { total:30, cutoff:12 },
  weeklyH: { total:60, cutoff:35 },
  weeklyCA: { total:70, cutoff:30 }
};

const USERS = {
  "9151701": { password:"91517001", dob:"05-07-2000", name:"Deepanshu Yadav", hindu:18, ca:17, desc:25, weeklyH:50, weeklyCA:45 },
  "8504002": { password:"85040002", dob:"25-11-2004", name:"Nikita Soni", hindu:16, ca:14, desc:18, weeklyH:42, weeklyCA:38 },
  "8756203": { password:"87562003", dob:"10-08-2002", name:"Jyoti Yadav", hindu:19, ca:18, desc:24, weeklyH:48, weeklyCA:52 },
  "6001104": { password:"60011004", dob:"29-11-1999", name:"Priyanka Dev", hindu:17, ca:16, desc:20, weeklyH:46, weeklyCA:45 },
  "6205705": { password:"62057005", dob:"25-12-2003", name:"Priyanka Verma", hindu:10, ca:12, desc:12, weeklyH:30, weeklyCA:28 },
  "8303906": { password:"83039006", dob:"27-07-2003", name:"Adweta Sen", hindu:0, ca:0, desc:0, weeklyH:0, weeklyCA:0 }
};

// Captcha
let a = Math.floor(Math.random()*9)+1;
let b = Math.floor(Math.random()*9)+1;
document.getElementById("captchaQ").textContent = `${a} + ${b} = ?`;

function getTotal(u){
  return u.hindu + u.ca + u.desc + u.weeklyH + u.weeklyCA;
}

function login(){
  const roll = rollInput();
}

function rollInput(){
  const roll = document.getElementById("roll").value.trim();
  const pass = document.getElementById("password").value.trim();
  const dob = document.getElementById("dob").value.trim();
  const cap = document.getElementById("captchaAns").value.trim();
  const err = document.getElementById("error");

  if(!roll || !pass || !dob || !cap){
    err.textContent = "Please fill all fields.";
    return;
  }
  if(parseInt(cap) !== a+b){
    err.textContent = "Invalid captcha.";
    return;
  }
  if(!USERS[roll] || USERS[roll].password!==pass || USERS[roll].dob!==dob){
    err.textContent = "Invalid credentials.";
    return;
  }
  err.textContent="";
  showResult(roll);
}

function showResult(roll){
  const u = USERS[roll];

  const totals = Object.values(USERS).map(x => getTotal(x)).sort((a,b)=>b-a);
  const myTotal = getTotal(u);
  const rank = totals.indexOf(myTotal) + 1;
  const percentile = (((totals.length - rank) / totals.length) * 100).toFixed(2);

  const topperRoll = Object.keys(USERS).find(r => getTotal(USERS[r]) === totals[0]);
  const topper = USERS[topperRoll];

  document.getElementById("topperInfo").textContent =
    `${topper.name} – ${getTotal(topper)} Marks`;

  let nameWithBadge = u.name;
  if(rank === 1) nameWithBadge += " 🥇 Gold";
  if(rank === 2) nameWithBadge += " 🥈 Silver";
  if(rank === 3) nameWithBadge += " 🥉 Bronze";

  document.getElementById("name").textContent = nameWithBadge;
  document.getElementById("rollShow").textContent = roll;
  document.getElementById("rank").textContent = rank;
  document.getElementById("percentile").textContent = percentile + "%";

  const hinduClear = u.hindu >= SUBJECTS.hindu.cutoff;
  const caClear = u.ca >= SUBJECTS.ca.cutoff;
  const descClear = u.desc >= SUBJECTS.desc.cutoff;
  const weeklyHClear = u.weeklyH >= SUBJECTS.weeklyH.cutoff;
  const weeklyCAClear = u.weeklyCA >= SUBJECTS.weeklyCA.cutoff;

  document.getElementById("hindu").textContent =
    `${u.hindu}/${SUBJECTS.hindu.total}${hinduClear ? "" : " *"}`;
  document.getElementById("ca").textContent =
    `${u.ca}/${SUBJECTS.ca.total}${caClear ? "" : " *"}`;
  document.getElementById("desc").textContent =
    `${u.desc}/${SUBJECTS.desc.total}${descClear ? "" : " *"}`;
  document.getElementById("weeklyH").textContent =
    `${u.weeklyH}/${SUBJECTS.weeklyH.total}${weeklyHClear ? "" : " *"}`;
  document.getElementById("weeklyCA").textContent =
    `${u.weeklyCA}/${SUBJECTS.weeklyCA.total}${weeklyCAClear ? "" : " *"}`;

  const total = myTotal;
  document.getElementById("total").textContent = `${total}`;
  document.getElementById("cutoff").textContent = OVERALL_CUTOFF;

  const allClear = hinduClear && caClear && descClear && weeklyHClear && weeklyCAClear && total >= OVERALL_CUTOFF;
  const status = document.getElementById("status");
  status.textContent = allClear ? "Qualified" : "Not Qualified";
  status.className = allClear ? "pass" : "fail";

  // Accuracy (objective only)
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
