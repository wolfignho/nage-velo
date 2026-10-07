/* Nage & Vélo Cardio — application */
"use strict";
const KEY = "nageVelo.v1";
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const SBY = Object.fromEntries(SESSIONS.map(s => [s.id, s]));
const DBY = Object.fromEntries(DRILLS.map(d => [d.id, d]));
const MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

/* ---------- Dates ---------- */
const pad = n => String(n).padStart(2, "0");
const iso = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const parse = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const today = () => iso(new Date());
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
const wd = s => (parse(s).getDay() + 6) % 7; // 0 = lundi
const monday = s => addDays(s, -wd(s));
const daysBetween = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);
const fmtDate = s => { const d = parse(s); return d.getDate() + " " + MOIS[d.getMonth()]; };
const fmtDateL = s => JOURS[wd(s)] + " " + fmtDate(s);

/* ---------- État ---------- */
function defaults() {
  return { v: 2, settings: { theme: "auto", age: 27, fcmax: null, weeklyGoal: 3, planStart: monday(today()), sound: true, vibrate: true },
    logs: [], tests: [], milestones: {}, active: null, seenBadges: [] };
}
let S;
function load() {
  try { S = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || "{}")); S.settings = Object.assign(defaults().settings, S.settings || {}); }
  catch (e) { S = defaults(); }
  if (!S.v || S.v < 2) { if (+S.settings.weeklyGoal === 4) S.settings.weeklyGoal = 3; S.v = 2; save(); } // v2 : plan autour du foot (3 séances + 1 option)
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast("Impossible d'enregistrer (stockage plein ?)"); } }
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ---------- Calculs ---------- */
const PACE = { E: 44, T: 52, C: 40, R: 50 }; // secondes par 25 m (estimation débutant)
function sessDist(s) { return s.steps.reduce((a, st) => a + (st.d ? st.n * st.d : 0), 0); }
function sessMin(s) {
  let t = 0;
  for (const st of s.steps) { if (st.d) t += st.n * st.d / 25 * (PACE[st.p] - (st.rpe >= 8 ? 6 : 0)); if (st.s) t += st.n * st.s; t += st.n * st.r; }
  return Math.round(t / 60);
}
function sessRpe(s) { const c = s.steps.filter(x => x.p === "C").map(x => x.rpe); return c.length ? Math.max(...c) : 5; }
const fcMax = () => S.settings.fcmax ? +S.settings.fcmax : Math.round(208 - 0.7 * (+S.settings.age || 27));
const zoneOfRpe = r => r <= 2 ? 1 : r <= 4 ? 2 : r <= 6 ? 3 : r <= 8 ? 4 : 5;
function zoneTxt(rpe, swim) {
  const z = ZONES[zoneOfRpe(rpe) - 1], m = fcMax(), off = swim ? 12 : 0;
  return "Zone " + z.z + " · " + Math.round(m * z.pct[0] / 100 - off) + "-" + Math.round(m * z.pct[1] / 100 - off) + " bpm";
}
const typeIc = t => t === "natation" ? "🏊" : "🚴";
const typeCl = t => t === "natation" ? "swim" : "bike";
const fmtDist = l => l.type === "natation" ? (l.distance ? Math.round(l.distance) + " m" : "") : (l.distance ? String(Math.round(l.distance * 10) / 10).replace(".", ",") + " km" : "");

function planWeekOf(dateStr) { const d = daysBetween(S.settings.planStart, dateStr); return d < 0 ? 0 : Math.floor(d / 7) + 1; }
function planKeyDone(k) { return S.logs.some(l => l.planKey === k); }
const isOpt = i => OPTIONAL_SLOTS.includes(i);
const SLOT_DAY = ["Lundi", "Mercredi", "Vendredi", "Samedi"];
function slotLabel(P, i) { const s = SBY[P.s[i]]; return s && s.test ? SLOT_DAY[i] + " · test" : SLOT_LABEL[i]; }
const PLAN_REQ_TOTAL = PLAN.length * REQUIRED_SLOTS.length;
function planReqDone() { return PLAN.reduce((a, w) => a + REQUIRED_SLOTS.filter(i => planKeyDone("w" + w.w + "-" + i)).length, 0); }
function planSlotDate(w, slot) { return addDays(S.settings.planStart, (w - 1) * 7 + SLOT_DAYS[slot]); }

function logXP(l) { return 20 + Math.min(+l.duree || 0, 90) + (l.planKey ? 15 : 0) + ((+l.rpe || 0) >= 7 ? 10 : 0); }
function weekStats(mon) {
  const end = addDays(mon, 6), ls = S.logs.filter(l => l.date >= mon && l.date <= end);
  const r = { n: ls.length, min: 0, minSwim: 0, minBike: 0, swimM: 0, bikeKm: 0, intense: 0 };
  ls.forEach(l => { const d = +l.duree || 0; r.min += d; if (l.type === "natation") { r.minSwim += d; r.swimM += +l.distance || 0; } else { r.minBike += d; r.bikeKm += +l.distance || 0; } if ((+l.rpe || 0) >= 7) r.intense += d; });
  return r;
}
function streakWeeks() {
  const g = +S.settings.weeklyGoal || 3; let m = monday(today()), n = 0;
  if (weekStats(m).n >= g) n++;
  m = addDays(m, -7);
  while (weekStats(m).n >= g) { n++; m = addDays(m, -7); if (n > 200) break; }
  return n;
}
function bestStreak() {
  if (!S.logs.length) return 0;
  const g = +S.settings.weeklyGoal || 3, first = monday(S.logs.map(l => l.date).sort()[0]);
  let m = first, cur = 0, best = 0; const end = monday(today());
  while (m <= end) { if (weekStats(m).n >= g) { cur++; best = Math.max(best, cur); } else cur = 0; m = addDays(m, 7); }
  return best;
}
function testsOf(k) { return S.tests.filter(t => t.key === k).sort((a, b) => a.date < b.date ? -1 : 1); }
function bestTest(k) { const ts = testsOf(k); if (!ts.length) return null; return TESTS[k].mieux === "haut" ? Math.max(...ts.map(t => t.value)) : Math.min(...ts.map(t => t.value)); }

function badgeList() {
  const L = S.logs, sw = L.filter(l => l.type === "natation"), bk = L.filter(l => l.type === "velo");
  const swimM = sw.reduce((a, l) => a + (+l.distance || 0), 0), bikeKm = bk.reduce((a, l) => a + (+l.distance || 0), 0), mins = L.reduce((a, l) => a + (+l.duree || 0), 0);
  const g = +S.settings.weeklyGoal || 3, mons = [...new Set(L.map(l => monday(l.date)))];
  const improved = ["swim12", "swim100", "bike20"].some(k => { const t = testsOf(k); if (t.length < 2) return false; return TESTS[k].mieux === "haut" ? bestTest(k) > t[0].value : bestTest(k) < t[0].value; });
  const ms = Object.keys(S.milestones).length, planDone = planReqDone();
  return [
    ["first", "🎯", "Première séance", L.length >= 1], ["swim1", "🏊", "Premier plongeon", sw.length >= 1], ["bike1", "🚴", "Premier coup de pédale", bk.length >= 1],
    ["s10", "🔟", "10 séances", L.length >= 10], ["s25", "💪", "25 séances", L.length >= 25], ["s50", "🏆", "50 séances", L.length >= 50],
    ["sw5", "🌊", "5 km nagés", swimM >= 5000], ["sw20", "🐬", "20 km nagés", swimM >= 20000], ["bk100", "🛣️", "100 km à vélo", bikeKm >= 100],
    ["bk300", "⛰️", "300 km à vélo", bikeKm >= 300], ["m500", "❤️", "500 min de cardio", mins >= 500], ["m1500", "🔥", "1 500 min de cardio", mins >= 1500],
    ["week", "✅", "Semaine parfaite", mons.some(m => weekStats(m).n >= g)], ["streak4", "📆", "4 semaines d'affilée", bestStreak() >= 4],
    ["test1", "⏱️", "Premier test", S.tests.length >= 1], ["prog", "📈", "Progrès mesuré", improved],
    ["sub2", "⚡", "100 m sous 2:00", (bestTest("swim100") || 999) < 120], ["c500", "🎖️", "500 m en 12 min", (bestTest("swim12") || 0) >= 500],
    ["vo2", "🫁", "4 × 4 min bouclé", L.some(l => l.sessionId === "V6")], ["brasse", "🐸", "Brasse validée (50 m continu)", !!S.milestones.m21], ["ms8", "🧠", "8 jalons techniques", ms >= 8],
    ["msall", "🥇", "Tous les jalons", ms >= MILESTONES.length], ["half", "🌗", "Moitié du plan", planDone >= PLAN_REQ_TOTAL / 2], ["plan", "👑", "Plan 12 semaines terminé", planDone >= PLAN_REQ_TOTAL]
  ].map(([id, e, n, ok]) => ({ id, e, n, ok }));
}
function totalXP() {
  return S.logs.reduce((a, l) => a + logXP(l), 0) + S.tests.length * 40 + Object.keys(S.milestones).length * 25 + badgeList().filter(b => b.ok).length * 50;
}
const LVL_XP = [0, 150, 400, 750, 1200, 1750, 2400, 3150, 4000, 5000];
function levelInfo() {
  const xp = totalXP(); let i = 0; while (i < LVL_XP.length - 1 && xp >= LVL_XP[i + 1]) i++;
  const next = LVL_XP[i + 1]; return { xp, lvl: i + 1, name: LEVELS[i], next, pct: next ? Math.round((xp - LVL_XP[i]) / (next - LVL_XP[i]) * 100) : 100 };
}
function checkBadges() {
  const got = badgeList().filter(b => b.ok && !S.seenBadges.includes(b.id));
  if (got.length) { got.forEach(b => S.seenBadges.push(b.id)); save(); toast("Nouveau badge : " + got.map(b => b.e + " " + b.n).join(", ")); }
}

/* ---------- Thème ---------- */
function applyTheme() {
  const t = S.settings.theme, dark = t === "dark" || (t === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = dark ? "#0b1e33" : "#eef4f9";
}

/* ---------- UI de base ---------- */
let tab = "home", libTab = "natation", suiviTab = "journal";
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.remove("hidden"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.add("hidden"), 3200); }
function openSheet(html) { $("#sheetCard").innerHTML = html; $("#sheet").classList.remove("hidden"); $("#sheetCard").scrollTop = 0; }
function closeSheet() { $("#sheet").classList.add("hidden"); $("#sheetCard").innerHTML = ""; }
function head(t, sub) { return `<div class="sheet-head"><div><h1 style="margin:2px 0">${t}</h1>${sub ? `<p class="mut small">${sub}</p>` : ""}</div><button class="x" data-act="close" aria-label="Fermer">✕</button></div>`; }

function render() {
  applyTheme();
  document.querySelectorAll(".tabs button").forEach(b => b.classList.toggle("on", b.dataset.tab === tab));
  const li = levelInfo(); $("#lvlChip").textContent = "Niv. " + li.lvl + " · " + li.xp + " XP";
  const v = $("#view");
  v.innerHTML = ({ home: vHome, plan: vPlan, lib: vLib, suivi: vSuivi, profil: vProfil })[tab]();
  if (tab === "suivi" && suiviTab === "stats") drawCharts();
}

function sessCard(s, extra = {}) {
  const swim = s.type === "natation", d = sessDist(s);
  const meta = [swim ? d + " m" : "", "≈ " + sessMin(s) + " min", "RPE " + sessRpe(s) + "/10"].filter(Boolean).join(" · ");
  return `<button class="sess ${extra.done ? "done" : ""} ${extra.opt ? "opt" : ""}" data-act="sess" data-id="${s.id}" ${extra.pk ? `data-pk="${extra.pk}"` : ""}>
    <div class="ic ${typeCl(s.type)}">${s.test ? "⏱️" : typeIc(s.type)}</div>
    <div class="bd"><div class="t">${extra.label ? `<span class="mut small">${esc(extra.label)} · </span>` : ""}${esc(s.titre)}</div><div class="m">${meta}</div>
    <div class="m">${esc(s.focus)}${extra.date ? " · " + extra.date : ""}</div></div></button>`;
}

/* ---------- Accueil ---------- */
function vHome() {
  const t = today(), w = planWeekOf(t), li = levelInfo(), ws = weekStats(monday(t)), g = +S.settings.weeklyGoal || 3;
  let planHtml = "";
  if (w === 0) planHtml = `<div class="card"><h3>Votre plan commence ${fmtDateL(S.settings.planStart)}</h3><p class="mut">En attendant, faites une séance libre depuis l'onglet Séances.</p></div>`;
  else if (w > 12) planHtml = `<div class="card hl"><h3>🎉 Plan de 12 semaines terminé</h3><p class="mut">Comparez vos tests dans Suivi, puis relancez un nouveau cycle depuis l'onglet Plan.</p></div>`;
  else {
    const P = PLAN[w - 1], slots = P.s.map((id, i) => ({ id, i, k: "w" + w + "-" + i, date: planSlotDate(w, i), opt: isOpt(i) }));
    const req = slots.filter(x => !x.opt), dow = wd(t);
    const todays = slots.find(x => x.date === t && !planKeyDone(x.k));
    const late = dow >= 5 ? null : req.find(x => !planKeyDone(x.k)); // pas de rattrapage la veille ou le jour du match
    const next = todays || req.find(x => !planKeyDone(x.k) && x.date >= t) || late;
    const nReq = req.filter(x => planKeyDone(x.k)).length;
    const title = todays ? (todays.opt ? "Option du jour (facultative)" : "Séance du jour") : next ? (next.date < t ? "Séance à rattraper" : "Prochaine séance") : nReq === req.length ? "Semaine bouclée 💪" : "Place au match ⚽";
    if (dow === 1 || dow === 3) planHtml += `<div class="card foot"><b>⚽ Entraînement de foot ${dow === 1 ? "ce mardi" : "ce jeudi"}.</b> <span class="mut">Pas de séance prévue dans l'application.${dow === 3 ? " Cours de natation aujourd'hui ? C'est un bonus : restez en technique et notez-le en séance libre." : ""}</span>
      ${P.alt ? `<p class="small" style="margin:8px 0 4px">Entraînement annulé ? Remplacez-le par :</p>${sessCard(SBY[P.alt], { label: "Remplacement" })}` : ""}</div>`;
    if (dow === 6) planHtml += `<div class="card foot"><b>⚽ Jour de match.</b> <span class="mut">Bon match ! Demain, vélo tranquille pour récupérer.</span></div>`;
    planHtml += `<div class="card ${todays ? "hl" : ""}"><div class="row sp"><span class="tag">Semaine ${w}/12 · ${P.phase}</span>${P.test ? '<span class="tag test">Semaine de tests</span>' : ""}</div>
      <h3 style="margin-top:10px">${title}</h3>
      ${next ? sessCard(SBY[next.id], { pk: next.k, label: slotLabel(P, next.i), date: fmtDateL(next.date) }) +
        `<button class="btn pri block pl-big" data-act="start" data-id="${next.id}" data-pk="${next.k}">▶ Démarrer la séance</button>` : nReq === req.length ? `<p class="mut">Les ${req.length} séances de la semaine sont faites. Le samedi : repos ou activation légère, puis le match.</p>` : `<p class="mut">Les séances manquées ne se rattrapent pas la veille ni le jour du match : on repart lundi avec la nouvelle semaine.</p>`}
      <p class="mut small" style="margin-top:10px">${nReq}/${req.length} séances faites cette semaine · ${esc(P.note)}</p></div>`;
  }
  const last = S.logs.slice().sort((a, b) => a.date < b.date ? 1 : -1)[0];
  return `<h1>Bonjour Herve 👋</h1>
    <div class="card"><div class="row sp"><b>Niveau ${li.lvl} · ${esc(li.name)}</b><span class="mut small">${li.xp}${li.next ? " / " + li.next : ""} XP</span></div>
      <div class="bar" style="margin-top:8px"><i style="width:${li.pct}%"></i></div></div>
    ${planHtml}
    <h2>Cette semaine</h2>
    <div class="grid3"><div class="stat"><b>${ws.n}/${g}</b><span>séances</span></div><div class="stat"><b>${ws.min}</b><span>min de cardio</span></div><div class="stat"><b>🔥 ${streakWeeks()}</b><span>sem. d'affilée</span></div></div>
    <div class="grid2" style="margin-top:10px"><div class="stat"><b style="color:var(--swim)">${ws.swimM} m</b><span>nagés</span></div><div class="stat"><b style="color:var(--bike)">${String(Math.round(ws.bikeKm * 10) / 10).replace(".", ",")} km</b><span>à vélo</span></div></div>
    <div class="grid2" style="margin-top:14px"><button class="btn swim" data-act="tab" data-tab="lib" data-lib="natation">🏊 Natation</button><button class="btn bike" data-act="tab" data-tab="lib" data-lib="velo">🚴 Vélo</button></div>
    <button class="btn block" style="margin-top:10px" data-act="log">＋ Noter une séance faite</button>
    ${last ? `<p class="mut small" style="margin-top:14px">Dernière séance : ${typeIc(last.type)} ${fmtDateL(last.date)}, ${last.duree} min${fmtDist(last) ? ", " + fmtDist(last) : ""}.</p>` : `<div class="card"><b>Pour commencer</b><ul class="dots mut"><li>Vérifiez la date de début dans l'onglet Plan.</li><li>Pendant la séance, lancez le minuteur : il bipe à chaque départ et à chaque fin de repos.</li><li>En semaine 1, vous faites vos tests pour mesurer votre cardio de départ.</li></ul></div>`}`;
}

/* ---------- Plan ---------- */
function vPlan() {
  const t = today(), cw = planWeekOf(t);
  let h = `<h1>Plan cardio 12 semaines</h1><p class="mut">Construit autour du foot : entraînements mardi et jeudi, match dimanche. 3 séances par semaine (lundi, mercredi, vendredi) + 1 option légère le samedi. Tests en semaines 1, 4, 8 et 12.</p>
    <div class="card"><label class="f" for="pStart">Début du plan (un lundi)</label><div class="row"><input class="in" type="date" id="pStart" value="${S.settings.planStart}"><button class="btn sm" data-act="setstart">OK</button></div></div>
    <h2>Semaine type</h2><div class="card">${WEEK_TEMPLATE.map(d => `<div class="zone"><div class="zn" style="background:var(--card2);color:var(--txt)">${d.ic}</div><div><b>${d.j}</b> · ${esc(d.t)}${d.info ? `<div class="mut small">${esc(d.info)}</div>` : ""}</div></div>`).join("")}
    <p class="mut small">Pourquoi cette organisation ? Voir « ⚽ Le plan et le foot » dans Séances › Guide.</p></div>
    <h2>Les 12 semaines</h2>`;
  for (const P of PLAN) {
    const done = REQUIRED_SLOTS.filter(i => planKeyDone("w" + P.w + "-" + i)).length, optDone = OPTIONAL_SLOTS.some(i => planKeyDone("w" + P.w + "-" + i));
    h += `<div class="week ${P.w === cw ? "cur" : ""}"><div class="row sp"><b>Semaine ${P.w} · ${P.phase}${P.w === cw ? " (en cours)" : ""}</b><span class="tag ${done === REQUIRED_SLOTS.length ? "ok" : ""}">${done}/${REQUIRED_SLOTS.length}${optDone ? " +1" : ""}</span></div>
      <p class="mut small">${fmtDate(addDays(S.settings.planStart, (P.w - 1) * 7))} → ${fmtDate(addDays(S.settings.planStart, (P.w - 1) * 7 + 6))} · ${esc(P.note)}</p>
      ${P.s.map((id, i) => sessCard(SBY[id], { pk: "w" + P.w + "-" + i, label: slotLabel(P, i) + (isOpt(i) ? " (facultatif)" : ""), done: planKeyDone("w" + P.w + "-" + i), date: fmtDateL(planSlotDate(P.w, i)), opt: isOpt(i) })).join("")}
      <p class="mut small" style="margin:8px 2px 0">⚽ Mardi et jeudi : entraînement · dimanche : match.${P.alt ? ` Entraînement annulé ? Remplacement : <a href="#" data-act="sess" data-id="${P.alt}">${esc(SBY[P.alt].titre)}</a>.` : ""}</p></div>`;
  }
  return h;
}

/* ---------- Bibliothèque ---------- */
function vLib() {
  const segs = [["natation", "🏊 Natation"], ["velo", "🚴 Vélo"], ["educ", "🎥 Technique"], ["guide", "❤️ Guide"]];
  let h = `<h1>Séances & conseils</h1><div class="seg">${segs.map(([k, n]) => `<button class="${libTab === k ? "on" : ""}" data-act="lib" data-lib="${k}">${n}</button>`).join("")}</div>`;
  if (libTab === "natation" || libTab === "velo") {
    h += `<p class="mut small">${libTab === "natation" ? "Bassin de 25 m. Toutes les séances sont orientées cardio : technique + travail du souffle." : "Choisissez une route calme. Le minuteur bipe à chaque changement d'allure."}</p>`;
    h += SESSIONS.filter(s => s.type === libTab).map(s => sessCard(s)).join("");
  } else if (libTab === "educ") {
    h += `<p class="mut small">Chaque fiche contient un schéma (disponible hors connexion) et une ou plusieurs vidéos de démonstration (Internet nécessaire).</p>`;
    for (const g of ["Nage complète", "Crawl", "Dos", "Brasse", "Général"]) h += `<h2>${g === "Brasse" ? "🐸" : "🏊"} ${g === "Dos" ? "Éducatifs dos crawlé" : g === "Crawl" ? "Éducatifs crawl" : g === "Brasse" ? "Éducatifs brasse" : g === "Général" ? "Virage et jambes" : "La nage complète"}</h2>` + DRILLS.filter(d => d.nage === g).map(d => `<button class="sess" data-act="drill" data-id="${d.id}"><div class="ic swim">${d.securite ? "⚠️" : "🎓"}</div><div class="bd"><div class="t">${esc(d.nom)}</div><div class="m">${esc(d.niveau)} · ${(DRILL_VIDEOS[d.id] || []).length} vidéo(s) + schéma</div></div></button>`).join("");
    h += `<h2>🚴 Technique vélo</h2>` + BIKE_TECH.map(b => `<button class="sess" data-act="btech" data-id="${b.id}"><div class="ic bike">${b.ic}</div><div class="bd"><div class="t">${esc(b.nom)}</div><div class="m">${b.vids.length} vidéo(s) + schéma</div></div></button>`).join("");
  } else h += guideHtml();
  return h;
}
function guideHtml() {
  const m = fcMax();
  return `<div class="card"><h3>Vos zones cardio</h3><p class="mut small">FC max ${S.settings.fcmax ? "saisie" : "estimée (208 − 0,7 × âge)"} : <b>${m} bpm</b>. Modifiable dans Profil. En natation, retirez environ 12 bpm.</p>
    ${ZONES.map((z, i) => `<div class="zone"><div class="zn" style="background:${["#7fd3ff", "#2ee6a6", "#ffcf4a", "#ff8a3d", "#ff5d6c"][i]}">Z${z.z}</div><div><b>${z.nom}</b> · ${Math.round(m * z.pct[0] / 100)}-${Math.round(m * z.pct[1] / 100)} bpm · RPE ${z.rpe}<div class="mut small">Test de la parole : ${z.parole}</div></div></div>`).join("")}</div>
    <div class="card"><h3>L'échelle RPE (effort ressenti)</h3><ul class="dots mut"><li><b>1-2</b> très facile, récupération</li><li><b>3-4</b> facile, vous pouvez discuter : c'est l'endurance qui construit le « moteur »</li><li><b>5-6</b> soutenu, phrases courtes</li><li><b>7-8</b> dur, quelques mots</li><li><b>9-10</b> maximal, impossible de parler</li></ul>
    <p class="mut small">Pour progresser en cardio : environ 80 % du temps facile (zones 1-2) et 20 % dur (zones 4-5). Le foot apporte déjà beaucoup d'intensité.</p></div>
    <div class="card"><h3>⚽ Le plan et le foot</h3><ul class="dots">${FOOT_LOGIC.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <div class="card"><h3>🏊 Sécurité natation</h3><ul class="dots">${SAFETY.natation.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <div class="card"><h3>🚴 Sécurité vélo</h3><ul class="dots">${SAFETY.velo.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <div class="card"><h3>⚽ Avec le foot</h3><ul class="dots">${SAFETY.general.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>`;
}

/* ---------- Détail séance / éducatif ---------- */
function sessDetail(id, pk) {
  const s = SBY[id], swim = s.type === "natation";
  let h = head((s.test ? "⏱️ " : typeIc(s.type) + " ") + esc(s.titre), esc(s.focus));
  h += `<div class="row wrap" style="margin:8px 0"><span class="tag ${typeCl(s.type)}">${swim ? "Natation" : "Vélo"}</span><span class="tag">${esc(s.niveau)}</span>${swim ? `<span class="tag">${sessDist(s)} m</span>` : ""}<span class="tag">≈ ${sessMin(s)} min</span><span class="tag">RPE max ${sessRpe(s)}/10</span></div>`;
  h += `<div class="card dgcard">${sessionProfile(s)}</div>`;
  if (swim && s.steps.some(x => /brasse/i.test(x.nom) || (DBY[x.drill] && DBY[x.drill].genou))) h += `<div class="warnbox">${KNEE_TXT}</div>`;
  if (swim && s.steps.some(x => x.drill === "hypoxie")) h += `<div class="warnbox">⚠️ Cette séance contient de l'hypoxie légère : uniquement sous surveillance, jamais d'hyperventilation ni d'apnée sous l'eau, arrêt au moindre inconfort.</div>`;
  let ph = "";
  h += `<ul class="steps">`;
  for (const st of s.steps) {
    if (st.p !== ph) { ph = st.p; h += `<li class="ph">${PH[ph]}</li>`; }
    const qty = st.d ? (st.n > 1 ? st.n + " × " : "") + st.d + " m" : (st.n > 1 ? st.n + " × " : "") + fmtDur(st.s);
    h += `<li><b>${qty}</b> · ${esc(st.nom)}${st.r ? ` <span class="mut">· repos ${fmtDur(st.r)}</span>` : ""}
      <div class="mut small">Effort ${st.rpe}/10 · ${zoneTxt(st.rpe, swim)}</div>${st.how ? `<div class="small">${esc(st.how)}</div>` : ""}
      ${st.drill ? `<button class="btn sm" style="margin-top:6px" data-act="drill" data-id="${st.drill}">🎥 Éducatif : vidéo + schéma</button>` : swim && autoTech(st) ? `<button class="btn sm" style="margin-top:6px" data-act="drill" data-id="${autoTech(st)}">🎥 Technique ${autoTech(st) === "dos-complet" ? "du dos" : autoTech(st) === "brasse-complet" ? "de la brasse" : "du crawl"}</button>` : ""}</li>`;
  }
  h += `</ul>`;
  if (!swim && BIKE_SESSION_MEDIA[s.id]) { const M = BIKE_SESSION_MEDIA[s.id]; h += videoBlock(M.v, BTBY.echauffement.start) + `<div class="card"><h3>📚 Fiches technique pour cette séance</h3><div class="row wrap">${M.f.map(f => `<button class="btn sm" data-act="btech" data-id="${f}">${BTBY[f].ic} ${esc(BTBY[f].nom)}</button>`).join("")}</div></div>`; }
  h += `<div class="warnbox" style="background:var(--card2);border-color:var(--line)">${swim ? "Matériel : planche, palmes, pince-nez, lunettes. Posez le téléphone au bord dans une pochette étanche : il bipe au départ de chaque répétition. Sur iPhone, montez le volume et désactivez le mode silencieux pour entendre les bips." : "Casque, éclairage, bidon. Lancez le minuteur avant de partir et gardez les yeux sur la route : les bips vous guident (volume monté, mode silencieux désactivé)."}</div>
    <button class="btn pri block pl-big" data-act="start" data-id="${s.id}" ${pk ? `data-pk="${pk}"` : ""}>▶ Démarrer avec le minuteur</button>
    <button class="btn block" style="margin-top:10px" data-act="log" data-id="${s.id}" ${pk ? `data-pk="${pk}"` : ""}>✓ Je l'ai faite sans minuteur</button>`;
  openSheet(h);
}
const KNEE_TXT = "🦵 Brasse et genou : le fouetté sollicite l'intérieur du genou. Si votre genou gauche (ou l'autre) vous fait mal ou est encore bandé, ne forcez pas : fouetté plus petit et plus lent, ou battements de crawl à la place des jambes de brasse. Pas de palmes pour les jambes de brasse.";
function fmtDur(sec) { if (sec < 60) return sec + " s"; const m = Math.floor(sec / 60), r = sec % 60; return r ? m + " min " + pad(r) : m + " min"; }
function drillDetail(id) {
  const d = DBY[id];
  openSheet(head("🎓 " + esc(d.nom), esc(d.nage) + " · " + esc(d.niveau)) +
    (d.genou ? `<div class="warnbox">${KNEE_TXT}</div>` : "") +
    (d.securite ? `<div class="warnbox">⚠️ Exercice à risque s'il est mal fait : jamais seul, jamais d'hyperventilation, jamais d'apnée sous l'eau. Arrêt immédiat au moindre vertige.</div>` : "") +
    (DIAG[d.id] ? `<div class="card dgcard">${DIAG[d.id]()}</div>` : "") +
    videoBlock(DRILL_VIDEOS[d.id]) +
    `<div class="card"><h3>🎯 Objectif</h3><p>${esc(d.objectif)}</p></div>
     <div class="card"><h3>👣 Étapes</h3><ol style="padding-left:20px;margin:6px 0">${d.etapes.map(x => `<li style="margin:5px 0">${esc(x)}</li>`).join("")}</ol></div>
     <div class="card"><h3>❌ Erreurs fréquentes</h3><ul class="dots">${d.erreurs.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
     <div class="card"><h3>🧰 Matériel</h3><p>${esc(d.materiel.join(" · "))}</p></div>
     <button class="btn block" data-act="close">Fermer</button>`);
}

function bikeTechDetail(id) {
  const b = BTBY[id];
  openSheet(head(b.ic + " " + esc(b.nom), "Technique vélo") + (BDIAG[id] ? `<div class="card dgcard">${BDIAG[id]()}</div>` : "") + videoBlock(b.vids, b.start || {}) +
    `<div class="card"><h3>👉 À retenir</h3><ul class="dots">${b.points.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div><button class="btn block" data-act="close">Fermer</button>`);
}

/* ---------- Saisie d'une séance ---------- */
let form = {};
function logForm(pre = {}) {
  const s = pre.sessionId ? SBY[pre.sessionId] : null;
  form = Object.assign({ date: today(), type: s ? s.type : "natation", sessionId: null, planKey: null, distance: s && s.type === "natation" ? sessDist(s) : "", duree: s ? sessMin(s) : 30, rpe: s ? sessRpe(s) : 5, fc: "", ressenti: 4, notes: "" }, pre);
  if (pre.edit) form = Object.assign({}, pre.edit);
  drawForm();
}
function drawForm() {
  const f = form, swim = f.type === "natation", s = f.sessionId ? SBY[f.sessionId] : null;
  const opts = SESSIONS.filter(x => x.type === f.type).map(x => `<option value="${x.id}" ${f.sessionId === x.id ? "selected" : ""}>${esc(x.titre)}</option>`).join("");
  let testF = "";
  if (s && s.test && !f.id) testF = swim ? `<div class="card"><h3>⏱️ Résultats du test</h3><label class="f" for="t12">Distance en 12 min (m)</label><input class="in" id="t12" type="number" inputmode="numeric" placeholder="ex. 450" value="${f.t12 || ""}">
      <p class="mut small">Cette distance s'ajoutera automatiquement à la distance totale de la séance.</p><label class="f" for="t100">Temps au 100 m crawl (min:s)</label><input class="in" id="t100" inputmode="numeric" placeholder="ex. 2:15" value="${f.t100 || ""}"></div>`
    : `<div class="card"><h3>⏱️ Résultat du test</h3><label class="f" for="t20">Distance en 20 min (km)</label><input class="in" id="t20" type="number" step="0.1" inputmode="decimal" placeholder="ex. 9,5" value="${f.t20 || ""}"><p class="mut small">Indiquez aussi votre FC moyenne pendant le test dans le champ FC ci-dessous si vous l'avez.</p></div>`;
  openSheet(head(f.id ? "Modifier la séance" : "Noter une séance", s ? esc(s.titre) : "Séance libre") + `
    <div class="seg"><button class="${swim ? "on" : ""}" data-act="ftype" data-v="natation">🏊 Natation</button><button class="${!swim ? "on" : ""}" data-act="ftype" data-v="velo">🚴 Vélo</button></div>
    <label class="f" for="fDate">Date</label><input class="in" type="date" id="fDate" value="${f.date}" max="${today()}">
    <label class="f" for="fSess">Séance</label><select class="in" id="fSess"><option value="">Séance libre / cours</option>${opts}</select>
    ${testF}
    <div class="grid2"><div><label class="f" for="fDist">Distance (${swim ? "m" : "km"})</label><input class="in" id="fDist" type="number" ${swim ? 'step="25" inputmode="numeric"' : 'step="0.1" inputmode="decimal"'} value="${f.distance}"></div>
    <div><label class="f" for="fDur">Durée (min)</label><input class="in" id="fDur" type="number" inputmode="numeric" value="${f.duree}"></div></div>
    <label class="f">Intensité (RPE ${f.rpe}/10)</label><div class="choices">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => `<button class="${+f.rpe === i ? "on" : ""}" data-act="frpe" data-v="${i}">${i}</button>`).join("")}</div>
    <label class="f" for="fFc">FC moyenne (bpm, optionnel)</label><input class="in" id="fFc" type="number" inputmode="numeric" placeholder="ex. 145" value="${f.fc || ""}">
    <label class="f">Ressenti</label><div class="choices">${["😫", "😕", "😐", "🙂", "🤩"].map((e, i) => `<button class="${+f.ressenti === i + 1 ? "on" : ""}" data-act="fres" data-v="${i + 1}" aria-label="Ressenti ${i + 1}">${e}</button>`).join("")}</div>
    <label class="f" for="fNotes">Notes</label><textarea class="in" id="fNotes" placeholder="Sensations, technique, ce qui a marché…">${esc(f.notes)}</textarea>
    <button class="btn pri block pl-big" style="margin-top:14px" data-act="fsave">${f.id ? "Enregistrer" : "Enregistrer la séance"}</button>
    ${f.id ? `<button class="btn block danger" style="margin-top:10px" data-act="fdel">Supprimer cette séance</button>` : ""}`);
}
function readForm() {
  const g = id => { const e = document.getElementById(id); return e ? e.value : undefined; };
  Object.assign(form, { date: g("fDate") || today(), sessionId: g("fSess") || null, distance: g("fDist"), duree: g("fDur"), fc: g("fFc"), notes: g("fNotes") || "" });
  ["t12", "t100", "t20"].forEach(k => { const v = g(k); if (v !== undefined) form[k] = v; });
}
const num = v => { const n = parseFloat(String(v == null ? "" : v).replace(",", ".")); return isFinite(n) ? n : null; };
function parseMMSS(v) { v = String(v || "").trim(); if (!v) return null; if (v.includes(":") || v.includes("'")) { const [m, s] = v.split(/[:']/); return (+m || 0) * 60 + (+s || 0); } const n = num(v); return n == null ? null : n; }
function saveForm() {
  readForm(); const f = form;
  const l = { id: f.id || uid(), date: f.date, type: f.type, sessionId: f.sessionId || null, planKey: f.planKey || null, distance: num(f.distance) || 0, duree: Math.max(0, Math.round(num(f.duree) || 0)), rpe: +f.rpe || 5, fc: num(f.fc), ressenti: +f.ressenti || 3, notes: f.notes.trim(), ts: f.ts || Date.now() };
  if (!l.duree) { toast("Indiquez la durée de la séance."); return; }
  if (l.sessionId && !l.planKey) { // rattache au plan si la séance est prévue cette semaine
    const w = planWeekOf(l.date); if (w >= 1 && w <= 12) { const i = PLAN[w - 1].s.findIndex((id, j) => id === l.sessionId && !planKeyDone("w" + w + "-" + j)); if (i >= 0) l.planKey = "w" + w + "-" + i; }
  }
  if (l.sessionId && l.planKey) { const w = +l.planKey.slice(1).split("-")[0], i = +l.planKey.split("-")[1]; if (!PLAN[w - 1] || PLAN[w - 1].s[i] !== l.sessionId) l.planKey = null; }
  const idx = S.logs.findIndex(x => x.id === l.id); if (idx >= 0) S.logs[idx] = l; else S.logs.push(l);
  const addT = (key, value) => { if (value != null && value > 0) S.tests.push({ id: uid(), date: l.date, key, value, logId: l.id }); };
  if (!f.id && num(f.t12) > 0) { l.distance += num(f.t12); const ix = S.logs.findIndex(x => x.id === l.id); S.logs[ix] = l; }
  if (!f.id) { addT("swim12", num(f.t12)); addT("swim100", parseMMSS(f.t100)); addT("bike20", num(f.t20)); }
  S.active = null; save(); closeSheet(); toast("Séance enregistrée : +" + logXP(l) + " XP 💪"); render(); checkBadges();
}

/* ---------- Suivi ---------- */
function vSuivi() {
  const segs = [["journal", "Journal"], ["stats", "Stats"], ["tests", "Tests"], ["tech", "Technique"]];
  let h = `<h1>Suivi</h1><div class="seg">${segs.map(([k, n]) => `<button class="${suiviTab === k ? "on" : ""}" data-act="suivi" data-v="${k}">${n}</button>`).join("")}</div>`;
  if (suiviTab === "journal") {
    h += `<button class="btn pri block" data-act="log">＋ Noter une séance</button>`;
    const ls = S.logs.slice().sort((a, b) => a.date === b.date ? b.ts - a.ts : a.date < b.date ? 1 : -1);
    if (!ls.length) h += `<p class="mut" style="margin-top:14px">Aucune séance pour l'instant. Lancez-en une depuis l'accueil ou notez une séance déjà faite.</p>`;
    let curW = "";
    for (const l of ls) {
      const m = monday(l.date); if (m !== curW) { curW = m; const st = weekStats(m); h += `<h3 style="margin-top:18px">Semaine du ${fmtDate(m)} <span class="mut small">· ${st.n} séance(s) · ${st.min} min</span></h3>`; }
      const s = l.sessionId ? SBY[l.sessionId] : null;
      h += `<button class="check log" data-act="editlog" data-id="${l.id}" style="display:block"><div class="row sp"><b>${typeIc(l.type)} ${s ? esc(s.titre) : l.type === "natation" ? "Natation libre" : "Vélo libre"}</b><span>${["😫", "😕", "😐", "🙂", "🤩"][(l.ressenti || 3) - 1]}</span></div>
        <div class="mut small">${fmtDateL(l.date)} · ${l.duree} min${fmtDist(l) ? " · " + fmtDist(l) : ""} · RPE ${l.rpe}${l.fc ? " · " + l.fc + " bpm" : ""}${l.planKey ? " · plan S" + l.planKey.slice(1).split("-")[0] : ""}</div>${l.notes ? `<div class="small">${esc(l.notes)}</div>` : ""}</button>`;
    }
  } else if (suiviTab === "stats") {
    const L = S.logs, swimM = L.filter(l => l.type === "natation").reduce((a, l) => a + (+l.distance || 0), 0), bikeKm = L.filter(l => l.type === "velo").reduce((a, l) => a + (+l.distance || 0), 0);
    const mins = L.reduce((a, l) => a + (+l.duree || 0), 0);
    const longSwim = Math.max(0, ...L.filter(l => l.type === "natation").map(l => +l.distance || 0)), longBike = Math.max(0, ...L.filter(l => l.type === "velo").map(l => +l.distance || 0));
    const mons = [...new Set(L.map(l => monday(l.date)))], bestW = Math.max(0, ...mons.map(m => weekStats(m).min));
    h += `<div class="grid3"><div class="stat"><b>${L.length}</b><span>séances</span></div><div class="stat"><b>${mins}</b><span>min cardio</span></div><div class="stat"><b>${Math.round(mins / 60 * 10) / 10}</b><span>heures</span></div></div>
      <div class="card"><h3>Minutes de cardio par semaine</h3><canvas class="chart" id="cMin"></canvas><div class="legend"><span><i style="background:var(--swim)"></i>Natation</span><span><i style="background:var(--bike)"></i>Vélo</span><span><i style="background:var(--bad)"></i>dont intense (RPE ≥ 7)</span></div></div>
      <div class="card"><h3>Distance nagée par semaine (m)</h3><canvas class="chart" id="cSwim"></canvas></div>
      <div class="card"><h3>Distance à vélo par semaine (km)</h3><canvas class="chart" id="cBike"></canvas></div>
      <h2>🏅 Records personnels</h2><div class="grid2">
      <div class="stat"><b>${Math.round(longSwim)} m</b><span>plus longue nage</span></div><div class="stat"><b>${String(Math.round(longBike * 10) / 10).replace(".", ",")} km</b><span>plus longue sortie</span></div>
      <div class="stat"><b>${Math.round(swimM / 100) / 10} km</b><span>nagés au total</span></div><div class="stat"><b>${Math.round(bikeKm)} km</b><span>à vélo au total</span></div>
      <div class="stat"><b>${bestW} min</b><span>meilleure semaine</span></div><div class="stat"><b>${bestStreak()}</b><span>meilleure série (sem.)</span></div>
      ${["swim12", "swim100", "bike20"].map(k => `<div class="stat"><b>${bestTest(k) != null ? TESTS[k].fmt(bestTest(k)) : "—"}</b><span>${TESTS[k].nom}</span></div>`).join("")}
      <div class="stat"><b>${bestTest("fcRepos") != null ? TESTS.fcRepos.fmt(bestTest("fcRepos")) : "—"}</b><span>FC repos la plus basse</span></div></div>`;
  } else if (suiviTab === "tests") {
    h += `<p class="mut">Les tests mesurent votre cardio toutes les 4 semaines (séances « Test » du plan). Vous pouvez aussi ajouter un résultat à la main, comme votre FC au réveil.</p>
      <button class="btn pri block" data-act="addtest">＋ Ajouter un résultat</button>`;
    for (const k of Object.keys(TESTS)) {
      const ts = testsOf(k), T = TESTS[k];
      h += `<div class="card"><div class="row sp"><h3 style="margin:0">${T.nom}</h3>${ts.length >= 2 ? diffTag(k, ts) : ""}</div>
        ${ts.length ? `<canvas class="chart" id="ct-${k}" style="height:140px"></canvas>` : `<p class="mut small">Pas encore de résultat.</p>`}
        ${ts.slice().reverse().map(t => `<div class="row sp small log"><span>${fmtDateL(t.date)}</span><span class="row"><b>${T.fmt(t.value)}</b><button class="btn sm" data-act="deltest" data-id="${t.id}" aria-label="Supprimer">🗑</button></span></div>`).join("")}</div>`;
    }
    setTimeout(drawTestCharts, 0);
  } else {
    const n = Object.keys(S.milestones).length;
    h += `<p class="mut">Cochez chaque jalon quand vous l'avez réussi (+25 XP). ${n}/${MILESTONES.length} validés.</p><div class="bar"><i style="width:${n / MILESTONES.length * 100}%"></i></div>`;
    for (const g of ["Crawl", "Dos", "Brasse", "Général", "Souffle", "Vélo"]) {
      h += `<h3 style="margin-top:16px">${g}</h3>` + MILESTONES.filter(m => m.g === g).map(m => `<button class="check ${S.milestones[m.id] ? "on" : ""}" data-act="ms" data-id="${m.id}"><span class="bx">${S.milestones[m.id] ? "✓" : ""}</span><span>${esc(m.t)}${S.milestones[m.id] ? `<span class="mut small"> · ${fmtDate(S.milestones[m.id])}</span>` : ""}</span></button>`).join("");
    }
  }
  return h;
}
function diffTag(k, ts) {
  const a = ts[0].value, b = ts[ts.length - 1].value, T = TESTS[k], better = T.mieux === "haut" ? b > a : b < a, d = Math.abs(b - a);
  const txt = k === "swim100" ? fmtMMSS(d) : k === "bike20" ? String(Math.round(d * 10) / 10).replace(".", ",") + " km" : Math.round(d) + " " + T.unite;
  return `<span class="tag ${better ? "ok" : ""}">${b === a ? "=" : (better ? "▲ " : "▼ ") + txt} depuis le 1er</span>`;
}
function addTestForm() {
  openSheet(head("Ajouter un résultat") + `<label class="f" for="atK">Test</label><select class="in" id="atK">${Object.entries(TESTS).map(([k, t]) => `<option value="${k}">${t.nom} (${k === "swim100" ? "min:s" : t.unite})</option>`).join("")}</select>
    <label class="f" for="atV">Résultat</label><input class="in" id="atV" placeholder="ex. 450 · 2:10 · 9,5 · 58">
    <label class="f" for="atD">Date</label><input class="in" type="date" id="atD" value="${today()}" max="${today()}">
    <button class="btn pri block" style="margin-top:14px" data-act="savetest">Enregistrer</button>`);
}

/* ---------- Graphiques ---------- */
function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
function setupCanvas(c) { const r = c.getBoundingClientRect(), dpr = window.devicePixelRatio || 1; c.width = Math.max(1, r.width * dpr); c.height = Math.max(1, r.height * dpr); const x = c.getContext("2d"); x.scale(dpr, dpr); return { x, w: r.width, h: r.height }; }
function drawBars(id, labels, series, stackedOverlay) {
  const c = document.getElementById(id); if (!c) return; const { x, w, h } = setupCanvas(c);
  const pl = 30, pb = 20, pt = 8, cw = w - pl - 4, ch = h - pb - pt, n = labels.length;
  const tot = labels.map((_, i) => series.reduce((a, s) => a + (s.stack ? s.vals[i] : 0), 0) || Math.max(...series.map(s => s.vals[i])));
  const max = Math.max(1, ...tot) * 1.15;
  x.font = "11px -apple-system,Segoe UI,Roboto,sans-serif"; x.fillStyle = css("--mut"); x.strokeStyle = css("--line"); x.lineWidth = 1;
  for (let g = 0; g <= 3; g++) { const y = pt + ch - ch * g / 3; x.beginPath(); x.moveTo(pl, y); x.lineTo(w, y); x.stroke(); x.fillText(String(Math.round(max * g / 3)), 0, y + 4); }
  const bw = cw / n * 0.62;
  labels.forEach((lb, i) => {
    const cx = pl + cw * (i + 0.5) / n; let y0 = pt + ch;
    series.forEach(s => { if (!s.stack) return; const hh = ch * s.vals[i] / max; x.fillStyle = s.color; x.fillRect(cx - bw / 2, y0 - hh, bw, hh); y0 -= hh; });
    series.forEach(s => { if (s.stack) return; const hh = ch * s.vals[i] / max; x.fillStyle = s.color; x.fillRect(cx - bw / 2 + bw * 0.3, pt + ch - hh, bw * 0.4, hh); });
    x.fillStyle = css("--mut"); x.textAlign = "center"; x.fillText(lb, cx, h - 5); x.textAlign = "left";
  });
}
function drawLine(id, pts, fmt) {
  const c = document.getElementById(id); if (!c) return; const { x, w, h } = setupCanvas(c);
  const pl = 8, pr = 8, pt = 22, pb = 20, vals = pts.map(p => p.v); let mn = Math.min(...vals), mx = Math.max(...vals);
  if (mn === mx) { mn -= 1; mx += 1; } const pad_ = (mx - mn) * 0.15; mn -= pad_; mx += pad_;
  const X = i => pts.length === 1 ? w / 2 : pl + 20 + (w - pl - pr - 40) * i / (pts.length - 1), Y = v => pt + (h - pt - pb) * (1 - (v - mn) / (mx - mn));
  x.strokeStyle = css("--acc"); x.lineWidth = 3; x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(X(i), Y(p.v)) : x.moveTo(X(i), Y(p.v))); x.stroke();
  x.font = "11px -apple-system,Segoe UI,Roboto,sans-serif"; x.textAlign = "center";
  pts.forEach((p, i) => { x.fillStyle = css("--acc"); x.beginPath(); x.arc(X(i), Y(p.v), 5, 0, 7); x.fill(); x.fillStyle = css("--txt"); x.fillText(fmt(p.v), X(i), Y(p.v) - 10); x.fillStyle = css("--mut"); x.fillText(fmtDate(p.d), X(i), h - 5); });
}
function drawCharts() {
  const mons = []; let m = monday(today()); for (let i = 7; i >= 0; i--) mons.push(addDays(m, -7 * i));
  const st = mons.map(weekStats), lb = mons.map(x => { const d = parse(x); return d.getDate() + "/" + (d.getMonth() + 1); });
  drawBars("cMin", lb, [{ vals: st.map(s => s.minSwim), color: css("--swim"), stack: 1 }, { vals: st.map(s => s.minBike), color: css("--bike"), stack: 1 }, { vals: st.map(s => s.intense), color: css("--bad") }]);
  drawBars("cSwim", lb, [{ vals: st.map(s => s.swimM), color: css("--swim"), stack: 1 }]);
  drawBars("cBike", lb, [{ vals: st.map(s => Math.round(s.bikeKm * 10) / 10), color: css("--bike"), stack: 1 }]);
}
function drawTestCharts() { for (const k of Object.keys(TESTS)) { const ts = testsOf(k); if (ts.length) drawLine("ct-" + k, ts.map(t => ({ d: t.date, v: t.value })), TESTS[k].fmt); } }

/* ---------- Profil ---------- */
function vProfil() {
  const li = levelInfo(), bs = badgeList(), st = S.settings;
  return `<h1>Profil</h1>
    <div class="card hl"><div class="row sp"><div><div class="mut small">Niveau ${li.lvl}/10</div><b style="font-size:20px">${esc(li.name)}</b></div><b style="font-size:20px">${li.xp} XP</b></div>
      <div class="bar" style="margin-top:10px"><i style="width:${li.pct}%"></i></div><p class="mut small">${li.next ? "Encore " + (li.next - li.xp) + " XP pour « " + esc(LEVELS[li.lvl]) + " »." : "Niveau maximum atteint !"}</p>
      <p class="mut small">XP : séance = 20 + 1 par minute (+15 si elle fait partie du plan, +10 si intense) · test +40 · jalon +25 · badge +50.</p></div>
    <h2>Badges (${bs.filter(b => b.ok).length}/${bs.length})</h2><div class="badges">${bs.map(b => `<div class="badge ${b.ok ? "" : "off"}"><span class="e">${b.e}</span>${esc(b.n)}</div>`).join("")}</div>
    <h2>Réglages</h2><div class="card">
      <div class="grid2"><div><label class="f" for="sAge">Âge</label><input class="in" id="sAge" type="number" inputmode="numeric" value="${st.age || ""}"></div>
      <div><label class="f" for="sFc">FC max mesurée (option)</label><input class="in" id="sFc" type="number" inputmode="numeric" placeholder="${fcMax()} estimée" value="${st.fcmax || ""}"></div></div>
      <label class="f" for="sGoal">Objectif de séances par semaine</label><select class="in" id="sGoal">${[2, 3, 4, 5, 6].map(n => `<option ${+st.weeklyGoal === n ? "selected" : ""}>${n}</option>`).join("")}</select>
      <label class="f">Thème</label><div class="seg">${[["auto", "Auto"], ["dark", "🌙 Sombre"], ["light", "☀️ Clair"]].map(([k, n]) => `<button class="${st.theme === k ? "on" : ""}" data-act="theme" data-v="${k}">${n}</button>`).join("")}</div>
      <button class="check ${st.sound ? "on" : ""}" data-act="tog" data-v="sound"><span class="bx">${st.sound ? "✓" : ""}</span>Bips sonores pendant les séances</button>
      <button class="check ${st.vibrate ? "on" : ""}" data-act="tog" data-v="vibrate"><span class="bx">${st.vibrate ? "✓" : ""}</span>Vibrations (Android ; l'iPhone ne les gère pas dans le navigateur)</button>
      <button class="btn pri block" style="margin-top:12px" data-act="savesettings">Enregistrer les réglages</button></div>
    <h2>Sauvegarde</h2><div class="card"><p class="mut small">Vos données restent sur ce téléphone. Exportez une sauvegarde de temps en temps (Fichiers ou iCloud Drive).</p>
      <div class="grid2"><button class="btn" data-act="export">⬇️ Exporter</button><button class="btn" data-act="import">⬆️ Importer</button></div><input type="file" id="impFile" accept=".json,application/json" class="hidden"></div>
    <div class="card"><h3>📲 Installer l'application</h3><p class="mut small">Dans Safari : bouton Partager, puis « Sur l'écran d'accueil ». Elle fonctionne ensuite sans réseau, même au bord du bassin.</p></div>
    <button class="btn block danger" style="margin-top:6px" data-act="reset">Tout effacer</button>
    <p class="mut small" style="text-align:center;margin-top:18px">Nage &amp; Vélo Cardio · v3</p>`;
}
function exportData() {
  const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" }), a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = "nage-velo-sauvegarde-" + today() + ".json"; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  toast("Sauvegarde exportée");
}
function importData(file) {
  const r = new FileReader();
  r.onload = () => { try { const d = JSON.parse(r.result); if (!d || !Array.isArray(d.logs)) throw 0; if (!confirm("Remplacer vos données actuelles par cette sauvegarde ?")) return; S = Object.assign(defaults(), d); S.settings = Object.assign(defaults().settings, d.settings || {}); save(); render(); toast("Sauvegarde importée ✓"); } catch (e) { toast("Fichier invalide"); } };
  r.readAsText(file);
}

/* ---------- Son, vibration, écran allumé ---------- */
let AC = null, wakeLock = null;
function audioInit() { try { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === "suspended") AC.resume(); const b = AC.createBuffer(1, 1, 22050), s = AC.createBufferSource(); s.buffer = b; s.connect(AC.destination); s.start(0); } catch (e) { } }
function beep(freq = 880, dur = 0.15, n = 1, gap = 0.12) {
  if (!S.settings.sound || !AC) return;
  try { for (let i = 0; i < n; i++) { const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + i * (dur + gap); o.type = "square"; o.frequency.value = freq; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + dur + 0.02); } } catch (e) { }
}
function vib(p) { if (S.settings.vibrate && navigator.vibrate) try { navigator.vibrate(p); } catch (e) { } }
async function keepAwake() { try { if ("wakeLock" in navigator && !wakeLock) { wakeLock = await navigator.wakeLock.request("screen"); wakeLock.addEventListener("release", () => { wakeLock = null; }); } } catch (e) { } }
function releaseAwake() { try { wakeLock && wakeLock.release(); } catch (e) { } wakeLock = null; }

/* ---------- Lecteur de séance ---------- */
function flatten(s) { const out = []; s.steps.forEach((st, si) => { for (let r = 1; r <= st.n; r++) out.push({ si, r, n: st.n, st }); }); return out; }
let ticker = null;
function startSession(id, pk) {
  audioInit(); closeSheet();
  S.active = { sid: id, pk: pk || null, i: 0, phase: "work", t0: Date.now(), pausedAt: null, start: Date.now(), pausedMs: 0, dist: 0, lastBeep: null, testVals: {} };
  save(); beep(1320, 0.12, 2); vib([200, 100, 200]); openPlayer();
}
function openPlayer() { $("#player").classList.remove("hidden"); document.body.style.overflow = "hidden"; keepAwake(); clearInterval(ticker); ticker = setInterval(tick, 250); drawPlayer(); }
function closePlayer() { clearInterval(ticker); ticker = null; $("#player").classList.add("hidden"); document.body.style.overflow = ""; releaseAwake(); }
const A = () => S.active;
function phaseElapsed() { const a = A(); return ((a.pausedAt || Date.now()) - a.t0) / 1000; }
function totalElapsed() { const a = A(); return ((a.pausedAt || Date.now()) - a.start - a.pausedMs) / 1000; }
function curItem() { const a = A(), items = flatten(SBY[a.sid]); return { items, it: items[a.i] }; }
function phaseLen() { const a = A(), { it } = curItem(); if (!it) return null; if (a.phase === "rest") return it.st.r; return it.st.s || null; }
function setPhase(phase, i) { const a = A(); a.phase = phase; if (i != null) a.i = i; a.t0 = Date.now(); if (a.pausedAt) { a.pausedAt = Date.now(); } a.lastBeep = null; save(); }
function advance(fromDone) {
  const a = A(), { items, it } = curItem();
  if (a.phase === "work") {
    if (fromDone && it.st.d) a.dist += it.st.d;
    const last = a.i >= items.length - 1;
    if (last) return finish();
    if (it.st.r > 0) { setPhase("rest"); beep(520, 0.25); vib(300); }
    else { setPhase("work", a.i + 1); beep(1320, 0.12, 2); vib([200, 100, 200]); }
  } else { if (a.i >= items.length - 1) return finish(); setPhase("work", a.i + 1); beep(1320, 0.12, 2); vib([200, 100, 200]); }
  drawPlayer();
}
function goPrev() { const a = A(); if (a.phase === "rest") setPhase("work"); else if (a.i > 0) { const { items } = curItem(); const p = items[a.i - 1]; if (p.st.d && a.dist >= p.st.d) a.dist -= p.st.d; setPhase("work", a.i - 1); } else setPhase("work"); drawPlayer(); }
function togglePause() { const a = A(); if (a.pausedAt) { const d = Date.now() - a.pausedAt; a.t0 += d; a.pausedMs += d; a.pausedAt = null; keepAwake(); } else a.pausedAt = Date.now(); save(); drawPlayer(); }
function finish() { const a = A(); if (a.pausedAt) { a.pausedMs += Date.now() - a.pausedAt; } a.phase = "done"; a.end = Date.now() - a.pausedMs; a.pausedAt = null; save(); beep(1046, 0.18, 3, 0.08); vib([300, 100, 300, 100, 500]); drawPlayer(); }
function tick() {
  const a = A(); if (!a || a.phase === "done") return;
  const len = phaseLen(), el = phaseElapsed();
  if (len) { const rem = Math.ceil(len - el); if (!a.pausedAt && rem <= 3 && rem >= 1 && a.lastBeep !== rem) { a.lastBeep = rem; beep(880, 0.1); } if (!a.pausedAt && el >= len) { advance(false); return; } }
  updTime();
}
const mmss = sec => { sec = Math.max(0, Math.floor(sec)); const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return (h ? h + ":" + pad(m) : m) + ":" + pad(s); };
function updTime() {
  const a = A(); const t = document.getElementById("plTime"); if (!t) return;
  const len = phaseLen(), el = phaseElapsed(); t.textContent = len ? mmss(Math.ceil(len - el)) : mmss(el);
  const tt = document.getElementById("plTot"); if (tt) tt.textContent = mmss(totalElapsed()) + (SBY[a.sid].type === "natation" ? " · " + a.dist + " m" : "");
}
function drawPlayer() {
  const a = A(), p = $("#player"); if (!a) return closePlayer();
  const s = SBY[a.sid], swim = s.type === "natation";
  if (a.phase === "done") {
    const min = Math.max(1, Math.round((a.end - a.start) / 60000));
    p.className = "player rest";
    p.innerHTML = `<div class="pl-mid"><div style="font-size:64px">🎉</div><div class="pl-name">Séance terminée !</div><p class="pl-how">${esc(s.titre)} · ${min} min${swim ? " · " + a.dist + " m" : ""}</p>
      <p class="pl-how">Bien joué Herve. Notez votre ressenti pour suivre vos progrès cardio.</p></div>
      <button class="btn pri block pl-big" data-act="plsave">✓ Enregistrer la séance</button><button class="btn block" style="margin-top:10px" data-act="plquit">Quitter sans enregistrer</button>`;
    return;
  }
  const { items, it } = curItem(), st = it.st, rest = a.phase === "rest", next = rest ? items[a.i + 1] : (st.r > 0 ? null : items[a.i + 1]);
  const workTxt = st.d ? st.d + " m" : fmtDur(st.s), nxt = items[a.i + 1];
  p.className = "player " + (rest ? "rest" : "work " + (swim ? "swimmode" : "bikemode"));
  const prog = Math.round(a.i / items.length * 100);
  p.innerHTML = `<div class="pl-top"><button class="btn sm" data-act="plquit">✕ Quitter</button><b id="plTot" class="small"></b><button class="btn sm" data-act="plinfo">ℹ️ Séance</button></div>
    <div class="pl-prog"><i style="width:${prog}%"></i></div><div class="mut small" style="text-align:center">${PH[st.p]} · étape ${a.i + 1}/${items.length}</div>
    <div class="pl-mid">
      <div class="pl-phase" style="color:${rest ? "var(--acc)" : swim ? "var(--swim)" : "var(--bike)"}">${rest ? "Repos" : st.test ? "⏱️ Test" : st.rpe >= 7 ? "Effort" : "En cours"}${a.pausedAt ? " · en pause" : ""}</div>
      <div class="pl-name">${rest ? "Récupérez" : esc(workTxt + " · " + st.nom)}</div>
      ${st.n > 1 ? `<div class="pl-rep">Répétition ${it.r}/${it.n}</div>` : ""}
      <div class="pl-time" id="plTime">0:00</div>
      <div class="pl-rep">${rest ? "Prochain départ au bip" : (st.d ? "Appuyez sur « Fait » en touchant le mur" : "Bip à la fin") + " · effort " + st.rpe + "/10"}</div>
      ${!rest && (st.how || st.drill) ? `<div class="pl-how">${esc(st.how || DBY[st.drill].objectif)}</div>` : ""}
      ${!rest && st.drill ? `<div><button class="btn sm" data-act="drill" data-id="${st.drill}">🎥 Voir l'éducatif</button></div>` : ""}
      ${!rest && st.r > 0 && nxt ? `<div class="pl-next">Ensuite : repos ${fmtDur(st.r)}, puis ${nxt.st.d ? nxt.st.d + " m" : fmtDur(nxt.st.s)} · ${esc(nxt.st.nom)}</div>` : nxt ? `<div class="pl-next">Ensuite : ${nxt.st.d ? nxt.st.d + " m" : fmtDur(nxt.st.s)} · ${esc(nxt.st.nom)}${nxt.n > 1 ? ` (${nxt.r}/${nxt.n})` : ""}</div>` : `<div class="pl-next">Dernière étape 💪</div>`}
    </div>
    <div class="pl-ctl"><button class="btn" data-act="plprev" aria-label="Précédent">⏮</button>
      ${!rest && st.d ? `<button class="btn pri pl-big" data-act="pldone">✓ Fait</button>` : `<button class="btn pri pl-big" data-act="plpause">${a.pausedAt ? "▶ Reprendre" : "⏸ Pause"}</button>`}
      <button class="btn" data-act="plnext" aria-label="Suivant">⏭</button></div>
    ${!rest && st.d ? `<button class="btn block sm" style="margin-top:8px" data-act="plpause">${a.pausedAt ? "▶ Reprendre" : "⏸ Pause"}</button>` : ""}`;
  updTime();
}
function playerSave() {
  const a = A(), s = SBY[a.sid], min = Math.max(1, Math.round((a.end - a.start) / 60000));
  closePlayer(); logForm({ sessionId: s.id, type: s.type, planKey: a.pk, duree: min, distance: s.type === "natation" ? a.dist : "", rpe: sessRpe(s) });
}

/* ---------- Événements ---------- */
document.addEventListener("click", e => {
  const b = e.target.closest("[data-act]"); if (!b) return;
  if (b.tagName === "A") e.preventDefault();
  const act = b.dataset.act, d = b.dataset;
  if (act.startsWith("pl")) audioInit();
  switch (act) {
    case "tab": tab = d.tab; if (d.lib) libTab = d.lib; closeSheet(); render(); scrollTo(0, 0); break;
    case "lib": libTab = d.lib; render(); break;
    case "suivi": suiviTab = d.v; render(); break;
    case "sess": sessDetail(d.id, d.pk); break;
    case "drill": drillDetail(d.id); break;
    case "btech": bikeTechDetail(d.id); break;
    case "vplay": { const f = document.getElementById("vf-" + d.v); if (f) f.innerHTML = ytFrame(d.v, +d.s || 0); break; }
    case "close": closeSheet(); break;
    case "start": startSession(d.id, d.pk); break;
    case "log": logForm(d.id ? { sessionId: d.id, planKey: d.pk || null } : {}); break;
    case "editlog": { const l = S.logs.find(x => x.id === d.id); if (l) logForm({ edit: Object.assign({}, l) }); break; }
    case "ftype": readForm(); form.type = d.v; form.sessionId = null; form.distance = ""; drawForm(); break;
    case "frpe": readForm(); form.rpe = +d.v; drawForm(); break;
    case "fres": readForm(); form.ressenti = +d.v; drawForm(); break;
    case "fsave": saveForm(); break;
    case "fdel": if (confirm("Supprimer cette séance ?")) { S.logs = S.logs.filter(l => l.id !== form.id); S.tests = S.tests.filter(t => t.logId !== form.id); save(); closeSheet(); render(); } break;
    case "setstart": { const v = $("#pStart").value; if (v) { S.settings.planStart = monday(v); save(); render(); toast("Début du plan : " + fmtDateL(S.settings.planStart)); } break; }
    case "ms": if (S.milestones[d.id]) delete S.milestones[d.id]; else { S.milestones[d.id] = today(); toast("Jalon validé : +25 XP 🎯"); } save(); render(); checkBadges(); break;
    case "addtest": addTestForm(); break;
    case "savetest": { const k = $("#atK").value, v = k === "swim100" ? parseMMSS($("#atV").value) : num($("#atV").value); if (!v || v <= 0) { toast("Résultat invalide"); return; } S.tests.push({ id: uid(), date: $("#atD").value || today(), key: k, value: v }); save(); closeSheet(); render(); toast("Résultat enregistré : +40 XP"); checkBadges(); break; }
    case "deltest": if (confirm("Supprimer ce résultat ?")) { S.tests = S.tests.filter(t => t.id !== d.id); save(); render(); } break;
    case "theme": S.settings.theme = d.v; save(); render(); break;
    case "tog": S.settings[d.v] = !S.settings[d.v]; save(); render(); break;
    case "savesettings": S.settings.age = num($("#sAge").value) || 27; S.settings.fcmax = num($("#sFc").value) || null; S.settings.weeklyGoal = +$("#sGoal").value || 4; save(); render(); toast("Réglages enregistrés"); break;
    case "export": exportData(); break;
    case "import": $("#impFile").click(); break;
    case "reset": if (confirm("Effacer toutes vos séances, tests et réglages ? Pensez à exporter avant.") && confirm("Vraiment tout effacer ?")) { S = defaults(); save(); render(); } break;
    case "plpause": togglePause(); break;
    case "pldone": advance(true); break;
    case "plnext": advance(false); break;
    case "plprev": goPrev(); break;
    case "plinfo": sessDetailRO(A().sid); break;
    case "plsave": playerSave(); break;
    case "plquit": if (A().phase === "done" || confirm("Quitter la séance en cours ? Elle ne sera pas enregistrée.")) { S.active = null; save(); closePlayer(); render(); } break;
  }
});
function sessDetailRO(id) { sessDetail(id); const c = $("#sheetCard"); c.querySelectorAll('[data-act=start],[data-act=log]').forEach(x => x.remove()); }
document.addEventListener("change", e => {
  if (e.target.id === "impFile" && e.target.files[0]) { importData(e.target.files[0]); e.target.value = ""; }
  if (e.target.id === "fSess") { readForm(); const s = SBY[form.sessionId]; if (s && !form.id) { form.distance = s.type === "natation" ? sessDist(s) : ""; form.duree = sessMin(s); form.rpe = sessRpe(s); } drawForm(); }
});
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && S.active && ticker) { keepAwake(); if (AC && AC.state === "suspended") AC.resume(); tick(); } });
matchMedia("(prefers-color-scheme: dark)").addEventListener && matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);

/* ---------- Démarrage ---------- */
load(); render();
if (S.active && SBY[S.active.sid] && Date.now() - S.active.start < 4 * 3600e3) { if (!S.active.pausedAt && S.active.phase !== "done") S.active.pausedAt = Date.now(); openPlayer(); toast("Séance en cours reprise (en pause)"); }
else if (S.active) { S.active = null; save(); }
if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("./sw.js").catch(() => { });
