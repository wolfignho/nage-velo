/* Nage & Vélo Cardio — supports visuels : vidéos YouTube vérifiées + schémas SVG */
"use strict";

/* ---------- Vidéos (titres et chaînes vérifiés via l'oEmbed YouTube) ---------- */
const VIDEOS = {
  "z9B8vGB4OoY": { t: "Apprendre le battement des jambes | Crawl", c: "SIKANA Français" },
  "z0lTxgcKAg0": { t: "Natation : Exercice de battements avec planche", c: "SmartNatation.com" },
  "Nbh6hr75Ov0": { t: "Éducatif crawl rattrapé - Entraînement de natation", c: "Fédération Française de Natation" },
  "gaiJAR_7M7g": { t: "Exercice pour améliorer le mouvement des bras : « Crawl rattrapé »", c: "SIKANA Français" },
  "8rbeBZf3vi0": { t: "Tuto crawl - Rotation du corps - Éducatif crawl #3", c: "apprentissage natation" },
  "sqN3D7YCbZg": { t: "Swimming - Freestyle - 6-Kick Switch", c: "GoSwim", en: true },
  "UCZrmV-TX0Q": { t: "Tuto 4 : Maîtriser sa respiration en crawl", c: "Fédération Française de Natation" },
  "3S0i9kroZEM": { t: "Apprendre à respirer | Crawl", c: "SIKANA Français" },
  "B8vnFb9pFAc": { t: "Natation : la respiration en crawl", c: "Natation pour tous" },
  "eycnGZacSqE": { t: "Crawl - Nager avec les palmes pour progresser", c: "apprentissage natation" },
  "s1e10o-bet4": { t: "Tuto 8 : Les bases techniques du crawl", c: "Fédération Française de Natation" },
  "SGRTV4RpGO0": { t: "Tuto 1 : L'alignement du corps en crawl", c: "Fédération Française de Natation" },
  "mYV7OcX4E94": { t: "Éducatif crawl 1 bras - Entraînement de natation", c: "Fédération Française de Natation" },
  "9ypX3vALTD0": { t: "Apprendre à nager : les battements sur le dos", c: "Natation pour tous" },
  "GFzbXx7GtzI": { t: "Apprendre le mouvement des jambes | Dos crawlé", c: "SIKANA Français" },
  "nb8ir9MVm6A": { t: "Apprendre le mouvement des bras | Dos crawlé", c: "SIKANA Français" },
  "YRO1JPeEk00": { t: "Exercice pour améliorer le mouvement de bras 1/2 | Dos crawlé", c: "SIKANA Français" },
  "f1KmUSaDceg": { t: "Tuto 10 : Améliorer sa propulsion pour mieux nager sur le dos", c: "Fédération Française de Natation" },
  "8P0POBWbYFE": { t: "Dossiers Technique : les éducatifs Dos Crawlé", c: "Barounuts" },
  "XhOzKCbqgJM": { t: "Apprendre la technique de base | Dos crawlé", c: "SIKANA Français" },
  "uMN4IJfRIOQ": { t: "Tuto 9 : L'alignement du corps et le gainage du dos", c: "Fédération Française de Natation" },
  "UgrnNEMXmpM": { t: "Natation pour tous : le virage brasse/crawl", c: "Natation pour tous" },
  "m7DE6OOEkoQ": { t: "Virages natation - Apprendre les virages de chaque nage", c: "apprentissage natation" },
  "4G8KzYTD0JY": { t: "Analyse éducatif crawl Battements Planche", c: "Mon Coach De Natation" },
  "MC8CVDMGIFM": { t: "Le secret des battements en crawl", c: "apprentissage natation" },
  "APGI2oyAcIQ": { t: "Respirer comme les pros - Les 4 niveaux de respiration en crawl", c: "apprentissage natation" },
  "qzEd5uB7aV8": { t: "Éducatif natation - Respiration 3/5/7 temps", c: "Saint Florent Triathlon" },
  /* Brasse */
  "bwpfKJLQgaA": { t: "Tuto 11 : Les bases techniques de la brasse", c: "Fédération Française de Natation" },
  "2XmFgN0E-6E": { t: "Apprendre la technique de base | Brasse coulée", c: "SIKANA Français" },
  "_hJMe25lgc0": { t: "Erreurs fatales en brasse (comment les éviter ?)", c: "apprentissage natation" },
  "VlhoAbKEM7U": { t: "Apprendre le mouvement des jambes | Brasse coulée", c: "SIKANA Français" },
  "GSDx2XoqQHM": { t: "Apprendre la brasse - perfectionnement du mouvement de jambes", c: "Natation pour tous" },
  "MfzGNT06l8I": { t: "Éducatif natation - Jambes de brasse sur le dos", c: "OpenSwim" },
  "jNt0mPcFDf4": { t: "Apprendre la brasse - Le mouvement des jambes", c: "Natation pour tous" },
  "OCixoIWIgJI": { t: "Brasse avec battements", c: "Natation pour tous" },
  "wrb9AWgW_MA": { t: "Tuto brasse - Brasse battements (éducatif brasse #1)", c: "apprentissage natation" },
  "cKGoGMQpNWU": { t: "Apprendre le mouvement des bras | Brasse coulée", c: "SIKANA Français" },
  "-FCjF19jtZI": { t: "Comment synchroniser les mouvements des jambes et des bras | Brasse coulée", c: "SIKANA Français" },
  "kkgGVAWBA-U": { t: "Apprendre la brasse : associer jambes et respiration", c: "Natation pour tous" },
  "h4z9O-QBGTA": { t: "Apprendre la brasse - Étapes finales", c: "Natation pour tous" },
  "4T0gcsxThxw": { t: "Exercice technique en brasse : 1 fois les bras, 2 fois les jambes", c: "Natation pour tous" },
  "BglWOmWH62I": { t: "Éducatif natation - Brasse 2 jambes 1 bras", c: "OpenSwim" },
  "Eyleud2hC74": { t: "Exercice pour améliorer le mouvement des jambes | Brasse coulée", c: "SIKANA Français" },
  "xvUwadHDkCE": { t: "Exercice : Brasse avec une pause", c: "Natation pour tous" },
  "fT0X9dqK1Wg": { t: "Brasse - Technique imbattable pour une nage efficace et relaxante", c: "apprentissage natation" },
  "H7qPxwxv1ig": { t: "Comment faire un virage | Brasse coulée", c: "SIKANA Français" },
  "6pCUlfrdHAI": { t: "Le virage en brasse", c: "Natation pour tous" },
  /* Vélo */
  "gYciHFqyK3Y": { t: "Comment savoir si votre hauteur de selle est la bonne ?", c: "GCN en Français" },
  "JgwL9sFUkL0": { t: "TUTO - Bien régler votre vélo route avant une sortie", c: "Decathlon FR" },
  "Djuxoa1ApnA": { t: "Comment s'échauffer avant le vélo ? Cyclisme", c: "Alexandre Auffret - Tout pour ma Santé" },
  "2sDzBz6_vLw": { t: "Comment améliorer sa cadence ?", c: "GCN en Français" },
  "sL045xXKtTU": { t: "Pédalage efficace", c: "Global Coaching - Tony Josselin" },
  "sC3reIQeXvM": { t: "Pourquoi monter assis ou en danseuse ?", c: "GCN en Français" },
  "TLuArRrt83Q": { t: "Vaincre les montées à vélo ! Nos meilleures astuces", c: "GCN en Français" },
  "pRy7zF1aNJY": { t: "Pourquoi tout le monde parle de la zone 2 ? Le guide ultime GCN", c: "GCN en Français" },
  "KyFapv0ujEw": { t: "Comprendre les différentes zones d'entraînement !", c: "GCN en Français" },
  "Kj-rCfDhoR8": { t: "Comment faire du fractionné en vélo sans capteur de puissance ?", c: "Mon Coach Vélo" },
  "q93dbqgn49k": { t: "Les fondamentaux du fractionné à PMA en vélo", c: "Mon Coach Vélo" },
  "UjR-Sp2z68Y": { t: "Conseils de pro : les meilleurs exercices pour progresser en montée", c: "GCN en Français" },
  "NrWBnQoKXwM": { t: "5 erreurs à ne pas commettre sur les méthodes de récupération après une sortie en vélo", c: "GCN en Français" }
};

/* Vidéos par éducatif (la 1re est intégrée directement dans la fiche) */
const DRILL_VIDEOS = {
  "crawl-complet": ["s1e10o-bet4", "SGRTV4RpGO0"],
  "dos-complet": ["XhOzKCbqgJM", "uMN4IJfRIOQ"],
  "bat-planche": ["z9B8vGB4OoY", "z0lTxgcKAg0"],
  "rattrape": ["Nbh6hr75Ov0", "gaiJAR_7M7g"],
  "rotation-636": ["8rbeBZf3vi0", "sqN3D7YCbZg"],
  "resp-3temps": ["UCZrmV-TX0Q", "3S0i9kroZEM", "B8vnFb9pFAc"],
  "crawl-palmes": ["eycnGZacSqE"],
  "un-bras-crawl": ["mYV7OcX4E94"],
  "bat-dos-planche": ["9ypX3vALTD0", "GFzbXx7GtzI"],
  "dos-un-bras": ["nb8ir9MVm6A", "YRO1JPeEk00"],
  "dos-rotation": ["f1KmUSaDceg", "8P0POBWbYFE"],
  "virage-simple": ["UgrnNEMXmpM", "m7DE6OOEkoQ"],
  "bat-intensifs": ["4G8KzYTD0JY", "MC8CVDMGIFM"],
  "hypoxie": ["APGI2oyAcIQ", "qzEd5uB7aV8"],
  "brasse-complet": ["bwpfKJLQgaA", "2XmFgN0E-6E", "_hJMe25lgc0"],
  "br-jambes-planche": ["VlhoAbKEM7U", "GSDx2XoqQHM"],
  "br-jambes-dos": ["MfzGNT06l8I", "jNt0mPcFDf4"],
  "br-bras-battements": ["OCixoIWIgJI", "wrb9AWgW_MA", "cKGoGMQpNWU"],
  "br-coordination": ["-FCjF19jtZI", "kkgGVAWBA-U", "h4z9O-QBGTA"],
  "br-2j1b": ["4T0gcsxThxw", "BglWOmWH62I", "Eyleud2hC74"],
  "br-glisse": ["xvUwadHDkCE", "fT0X9dqK1Wg"],
  "br-virage": ["H7qPxwxv1ig", "6pCUlfrdHAI"]
};

/* ---------- Fiches technique vélo ---------- */
const BIKE_TECH = [
  { id: "position", ic: "📐", nom: "Bien régler sa position", vids: ["gYciHFqyK3Y", "JgwL9sFUkL0"],
    points: ["Hauteur de selle : talon posé sur la pédale en bas, la jambe est tendue. En pédalant (avant du pied sur la pédale), il reste une légère flexion du genou.",
      "Le bassin ne doit pas se dandiner sur la selle : s'il bouge, la selle est trop haute.",
      "Bras légèrement fléchis, épaules basses et relâchées, mains souples sur le guidon.",
      "Genou au-dessus de la pédale quand la manivelle est à l'horizontale (position 3 h).",
      "Une douleur au genou ou au dos est souvent un problème de réglage : corrigez avant d'ajouter des kilomètres."] },
  { id: "cadence", ic: "🔄", nom: "Pédalage et cadence", vids: ["2sDzBz6_vLw", "sL045xXKtTU"],
    points: ["Cadence de base : 85 à 95 tours de pédale par minute. Comptez les tours d'un pied pendant 15 s puis multipliez par 4.",
      "Mieux vaut un petit braquet qui tourne vite qu'un gros braquet qui force : le cœur travaille, les genoux et les muscles se fatiguent moins.",
      "De 12 h à 5 h, on pousse ; en bas, on « racle » comme pour essuyer une chaussure ; à la remontée, on allège la jambe.",
      "Vélocité : 100-110 tr/min en souplesse, bassin immobile. Si vous rebondissez sur la selle, baissez un peu la cadence.",
      "Côte : passez le petit braquet AVANT que ça devienne dur, pour garder 70-80 tr/min."] },
  { id: "danseuse", ic: "⛰️", nom: "Grimper assis ou en danseuse", vids: ["sC3reIQeXvM", "TLuArRrt83Q"],
    points: ["Assis : le plus économique. Mains en haut du guidon, buste calme, cadence 70-80 tr/min.",
      "En danseuse : pour relancer, passer un passage raide ou soulager les jambes quelques secondes.",
      "Passez une ou deux dents plus dur au moment de vous lever, sinon les jambes « tournent dans le vide ».",
      "Mains sur les cocottes (ou poignées), hanches au-dessus du pédalier, le vélo se balance légèrement sous vous, pas le corps.",
      "Dans le plan : les 20 dernières secondes des 2 dernières montées de la séance Côtes se font en danseuse."] },
  { id: "echauffement", ic: "🔥", nom: "S'échauffer avant le fractionné", vids: ["Djuxoa1ApnA"], start: { "Djuxoa1ApnA": 438 },
    points: ["10 à 12 min progressives : 5 min très faciles, puis montée graduelle jusqu'à un effort de 5-6/10.",
      "Cadence souple (85-95 tr/min) pendant tout l'échauffement.",
      "2 ou 3 accélérations de 15-30 s avant les séances intenses, avec 1 min facile entre chaque.",
      "Par temps froid, allongez l'échauffement de 5 min et couvrez les genoux.",
      "La vidéo démarre à la partie « échauffement spécifique sur le vélo » (7:18) ; le début montre un échauffement articulaire à faire avant de partir."] },
  { id: "zones", ic: "❤️", nom: "Zones cardio et zone 2", vids: ["pRy7zF1aNJY", "KyFapv0ujEw"],
    points: ["Zone 2 = endurance : vous pouvez parler en phrases complètes. C'est elle qui construit le « moteur ».",
      "Environ 80 % de votre temps de vélo doit être facile (zones 1-2) : le foot apporte déjà beaucoup d'intensité.",
      "Sans cardiofréquencemètre, fiez-vous au test de la parole et à l'effort ressenti (RPE).",
      "En côte, restez en zone 2 en passant tout à gauche : on ralentit plutôt que de s'emballer."] },
  { id: "fractionne", ic: "⚡", nom: "Réussir son fractionné", vids: ["Kj-rCfDhoR8", "q93dbqgn49k"],
    points: ["Toujours après un échauffement complet, sur une route calme ou une piste cyclable, jamais en ville.",
      "Effort 8/10 : vous ne pouvez dire que quelques mots. Gardez la même intensité du premier au dernier intervalle.",
      "Pendant la récupération, continuez à pédaler très facilement : c'est de la récupération active.",
      "Sans capteur de puissance : effort ressenti + cadence 90-100 tr/min. Le minuteur bipe à chaque changement.",
      "Dans votre semaine : seulement si un entraînement de foot est annulé, et jamais la veille d'un match."] },
  { id: "cotes", ic: "🏔️", nom: "Répétitions en côte", vids: ["UjR-Sp2z68Y", "TLuArRrt83Q"],
    points: ["Choisissez une côte régulière de 1 à 2 min, avec peu de circulation.",
      "Montée assis, cadence 70-80 tr/min, effort 8/10 ; la descente sert de récupération (freinez, restez prudent).",
      "Buste calme, mains en haut du guidon, respiration ample.",
      "Sans côte : gros braquet sur le plat, à la même cadence."] },
  { id: "recup", ic: "🧘", nom: "Récupérer après le match", vids: ["NrWBnQoKXwM"],
    points: ["Le lundi, 20 à 45 min en zone 1-2 : aucune sensation d'effort, petit braquet.",
      "Hydratez-vous, mangez des protéines et des glucides dans les heures qui suivent le match.",
      "Le sommeil est le premier outil de récupération : visez 7 à 9 h.",
      "Douleur articulaire ou musculaire inhabituelle après le match : repos complet plutôt que vélo."] }
];
const BTBY = Object.fromEntries(BIKE_TECH.map(b => [b.id, b]));
/* Vidéo(s) et fiches par séance vélo */
const BIKE_SESSION_MEDIA = {
  V1: { v: ["pRy7zF1aNJY"], f: ["zones", "cadence", "position"] },
  V2: { v: ["NrWBnQoKXwM"], f: ["recup", "cadence"] },
  V3: { v: ["Kj-rCfDhoR8"], f: ["fractionne", "echauffement"] },
  V4: { v: ["Kj-rCfDhoR8"], f: ["fractionne", "echauffement"] },
  V5: { v: ["KyFapv0ujEw"], f: ["zones", "echauffement"] },
  V6: { v: ["q93dbqgn49k"], f: ["fractionne", "echauffement"] },
  V7: { v: ["UjR-Sp2z68Y"], f: ["cotes", "danseuse", "echauffement"] },
  V8: { v: ["pRy7zF1aNJY"], f: ["zones", "position"] },
  V9: { v: ["Kj-rCfDhoR8"], f: ["fractionne", "echauffement"] },
  V10: { v: ["KyFapv0ujEw"], f: ["zones", "echauffement"] },
  V11: { v: ["2sDzBz6_vLw"], f: ["cadence", "recup"] },
  V12: { v: ["Djuxoa1ApnA"], f: ["echauffement", "cadence"] },
  TV: { v: ["Djuxoa1ApnA"], f: ["echauffement", "zones"] }
};
/* Technique de référence pour les étapes sans éducatif */
function autoTech(st) {
  if (st.drill) return st.drill;
  const n = (st.nom + " " + (st.how || "")).toLowerCase();
  const crawl = n.includes("crawl"), dos = n.includes("dos"), brasse = n.includes("brasse");
  if (brasse && !crawl && !dos) return "brasse-complet";
  if (crawl) return "crawl-complet";
  if (dos) return "dos-complet";
  return null;
}

/* ---------- Bloc vidéo ---------- */
const ytWatch = (id, start) => "https://www.youtube.com/watch?v=" + id + (start ? "&t=" + start + "s" : "");
function ytFrame(id, start) {
  const v = VIDEOS[id] || { t: "Vidéo" };
  return `<iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1&modestbranding=1${start ? "&start=" + start : ""}" title="${esc(v.t)}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
}
function videoBlock(ids, starts = {}, title) {
  ids = (ids || []).filter(id => VIDEOS[id]); if (!ids.length) return "";
  const off = typeof navigator !== "undefined" && navigator.onLine === false;
  title = title || (ids.length > 1 ? "🎥 Vidéos de démonstration" : "🎥 Vidéo de démonstration");
  return `<div class="card"><h3>${title}</h3>
    ${off ? `<div class="warnbox">📴 Hors connexion : les vidéos ont besoin d'Internet. Le schéma et les explications restent disponibles.</div>` : ""}
    ${ids.map((id, i) => { const v = VIDEOS[id], st = starts[id] || 0; return `<div class="vid">
      <div class="vframe" id="vf-${id}">${i === 0 && !off ? ytFrame(id, st) : `<button class="vplay" data-act="vplay" data-v="${id}" data-s="${st}" aria-label="Lire la vidéo ${esc(v.t)}"><span>▶</span>Lire ici</button>`}</div>
      <div class="vmeta"><b>${esc(v.t)}</b><span class="mut small">${esc(v.c)}${v.en ? " · en anglais, regardez surtout le geste" : ""}${st ? " · démarre à " + Math.floor(st / 60) + ":" + String(st % 60).padStart(2, "0") : ""}</span>
      <a class="small" href="${ytWatch(id, st)}" target="_blank" rel="noopener">Ouvrir sur YouTube ↗</a></div></div>`; }).join("")}
    <p class="mut small">Les vidéos ne fonctionnent pas hors connexion (au bord du bassin sans réseau, regardez-les avant la séance).</p></div>`;
}

/* ---------- Schémas SVG ---------- */
const DEFS = `<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="dg-arw"/></marker></defs>`;
const svg = (w, h, inner, label) => `<svg class="dg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">${DEFS}${inner}</svg>`;
const L = (x1, y1, x2, y2, c = "dg-limb", extra = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${c}" ${extra}/>`;
const T = (x, y, t, a = "start", c = "dg-lbl") => `<text x="${x}" y="${y}" text-anchor="${a}" class="${c}">${t}</text>`;
const C = (x, y, r, c = "dg-skin") => `<circle cx="${x}" cy="${y}" r="${r}" class="${c}"/>`;
const P = (d, c = "dg-path", extra = "") => `<path d="${d}" class="${c}" ${extra}/>`;
const AR = (d, c = "dg-path") => `<path d="${d}" class="${c}" marker-end="url(#ar)"/>`;
const rad = a => a * Math.PI / 180;
const pt = (x, y, len, a) => [x + len * Math.cos(rad(a)), y + len * Math.sin(rad(a))].map(v => Math.round(v * 10) / 10);
function water(w, h, y = 50) { return `<rect x="0" y="${y}" width="${w}" height="${h - y}" class="dg-water"/>` + P(`M0 ${y} ` + Array.from({ length: Math.ceil(w / 20) }, (_, i) => `q5 -3 10 0 t10 0`).join(" "), "dg-surf"); }
/* bras / jambe : segment 1 et 2 avec angles absolus (0 = vers la droite, y vers le bas) */
function limb(x, y, l1, a1, l2, a2, l3 = 0, a3 = 0, c = "dg-limb") {
  const [x2, y2] = pt(x, y, l1, a1), [x3, y3] = pt(x2, y2, l2, a2);
  let o = `<polyline points="${x},${y} ${x2},${y2} ${x3},${y3}" class="${c}"/>`;
  if (l3) { const [x4, y4] = pt(x3, y3, l3, a3); o += L(x3, y3, x4, y4, c + " thin"); }
  return o;
}
/* Nageur vu de côté, tête à droite. prone = ventre (true) ou dos (false) */
function swimmer(o = {}) {
  const Y = o.y || 68, S = [244, Y], H = [174, Y + (o.hipDrop || 2)];
  let g = "";
  // jambes
  const legs = o.legs || [-3, 5];
  legs.forEach((a, i) => { g += limb(H[0], H[1], 42, 180 + a, 40, 180 + a * (o.kneeBend ? 2.2 : 1.15), o.fins ? 0 : 12, 180 + a * 1.2, i ? "dg-limb back" : "dg-limb"); if (o.fins) { const [kx, ky] = pt(H[0], H[1], 42, 180 + a), [ax, ay] = pt(kx, ky, 40, 180 + a * 1.15); g += P(`M${ax} ${ay} l-30 ${-6 + a} l2 12 z`, "dg-fin"); } });
  // tronc + tête
  g += L(H[0], H[1], S[0], S[1], "dg-torso");
  const hx = S[0] + 18, hy = Y - (o.prone === false ? 4 : 1);
  g += C(hx, hy, 10);
  if (o.prone === false) g += C(hx + 3, hy - 9, 2.2, "dg-dark"); else g += `<rect x="${hx + 3}" y="${hy - 2}" width="8" height="5" rx="2" class="dg-goggle"/>`;
  // bras
  (o.arms || []).forEach((a, i) => { g += limb(S[0], S[1], 30, a[0], 28, a[1], 9, a[2] != null ? a[2] : a[1], i ? "dg-limb back" : "dg-limb"); });
  if (o.board) g += `<rect x="${o.board[0]}" y="${o.board[1]}" width="${o.board[2] || 40}" height="7" rx="3" class="dg-board"/>`;
  return g;
}
function bubbles(x, y) { return C(x, y, 2.5, "dg-bub") + C(x + 6, y + 5, 2, "dg-bub") + C(x + 2, y + 10, 1.6, "dg-bub"); }
const dir = (x, y) => AR(`M${x} ${y} h40`, "dg-path acc") + T(x + 44, y + 4, "sens de nage", "start", "dg-lbl mini");

const DIAG = {
  "crawl-complet": () => svg(340, 200, water(340, 200) + swimmer({ arms: [[0, 0], [175, 178]], legs: [-4, 6] }) +
    P("M300 68 Q312 92 290 104 Q240 116 196 86", "dg-path dash", 'marker-end="url(#ar)"') + P("M188 70 Q215 18 296 58", "dg-path dash acc", 'marker-end="url(#ar)"') +
    T(334, 46, "1 entrée", "end", "dg-lbl mini") + T(336, 96, "2 traction", "end", "dg-lbl mini") + T(240, 128, "3 poussée vers la cuisse", "middle", "dg-lbl mini") + T(232, 26, "4 retour aérien coude haut", "middle", "dg-lbl mini") +
    T(100, 112, "battements souples depuis la hanche", "middle", "dg-lbl mini") + T(170, 160, "Corps aligné juste sous la surface, regard vers le fond,", "middle", "dg-lbl") + T(170, 178, "on tourne d'un côté à l'autre à chaque bras.", "middle", "dg-lbl") + dir(10, 20), "Schéma du crawl complet"),
  "dos-complet": () => svg(340, 200, water(340, 200, 56) + swimmer({ prone: false, y: 62, arms: [[0, 0], [175, 178]], legs: [-4, 6] }) +
    P("M186 60 Q200 -6 300 52", "dg-path dash acc", 'marker-end="url(#ar)"') + P("M300 70 Q290 100 200 82", "dg-path dash", 'marker-end="url(#ar)"') +
    T(176, 48, "sortie pouce", "end", "dg-lbl mini") + T(336, 40, "entrée petit doigt", "end", "dg-lbl mini") + T(236, 14, "bras tendu", "middle", "dg-lbl mini") + T(250, 108, "traction coude plié", "middle", "dg-lbl mini") +
    AR("M150 112 v-32", "dg-path acc") + T(150, 126, "hanches hautes", "middle", "dg-lbl mini") + T(292, 92, "tête fixe", "start", "dg-lbl mini") +
    T(170, 165, "Oreilles dans l'eau, regard au plafond.", "middle", "dg-lbl") + T(170, 183, "Quand un bras entre, l'autre sort.", "middle", "dg-lbl") + dir(10, 20), "Schéma du dos crawlé complet"),
  "bat-planche": () => svg(340, 190, water(340, 190) + swimmer({ arms: [[2, 1], [-2, 2]], legs: [-5, 7], board: [292, 63, 44] }) + bubbles(282, 76) +
    P("M74 52 A26 26 0 0 0 74 92", "dg-path dash acc") + T(62, 76, "30-40 cm", "end", "dg-lbl mini") +
    T(176, 112, "hanches hautes", "middle", "dg-lbl mini") + AR("M176 100 v-18", "dg-path") + T(128, 44, "jambes presque tendues", "middle", "dg-lbl mini") + T(334, 104, "on souffle dans l'eau", "end", "dg-lbl mini") +
    T(170, 150, "Battements courts et rapides depuis la hanche,", "middle", "dg-lbl") + T(170, 168, "chevilles relâchées, talons qui affleurent.", "middle", "dg-lbl") + dir(10, 20), "Battements crawl avec planche"),
  "bat-intensifs": () => svg(340, 220, water(340, 120) + swimmer({ arms: [[2, 1], [-2, 2]], legs: [-6, 8], board: [292, 63, 44] }) + bubbles(282, 76) +
    T(170, 108, "fréquence élevée, amplitude courte", "middle", "dg-lbl mini") +
    [0, 1, 2, 3].map(i => `<rect x="${20 + i * 78}" y="${150}" width="44" height="40" rx="4" class="dg-hard"/><rect x="${64 + i * 78}" y="${178}" width="26" height="12" rx="3" class="dg-easy"/>`).join("") +
    T(42, 145, "25 m vite", "middle", "dg-lbl mini") + T(77, 172, "repos", "middle", "dg-lbl mini") + T(170, 212, "Effort 7-8/10 puis repos complet, sur toutes les répétitions.", "middle", "dg-lbl"), "Battements intensifs : effort et repos"),
  "crawl-palmes": () => svg(340, 190, water(340, 190) + swimmer({ arms: [[0, 0], [176, 178]], legs: [-3, 5], fins: true }) + bubbles(282, 76) +
    T(60, 112, "palmes DANS l'eau", "middle", "dg-lbl mini") + T(270, 100, "traction complète", "middle", "dg-lbl mini") +
    T(170, 150, "Les palmes aident à garder le corps à plat :", "middle", "dg-lbl") + T(170, 168, "on nage vite sans perdre la technique.", "middle", "dg-lbl") + dir(10, 20), "Crawl avec palmes"),
  "un-bras-crawl": () => svg(340, 190, water(340, 190) + swimmer({ arms: [[0, 0], [60, 160]], legs: [-5, 7] }) +
    P("M300 68 Q306 96 280 102 Q230 108 196 84", "dg-path dash", 'marker-end="url(#ar)"') + P("M190 70 Q220 20 298 60", "dg-path dash acc", 'marker-end="url(#ar)"') +
    T(336, 46, "entrée devant l'épaule", "end", "dg-lbl mini") + T(236, 124, "coude haut, on pousse l'eau vers les pieds", "middle", "dg-lbl mini") + T(240, 30, "retour coude haut", "middle", "dg-lbl mini") +
    T(170, 160, "Un bras reste tendu devant, l'autre fait tout le trajet.", "middle", "dg-lbl") + T(170, 178, "25 m bras droit, puis 25 m bras gauche.", "middle", "dg-lbl") + dir(10, 20), "Crawl un bras"),
  "rattrape": () => svg(340, 200, `<rect x="0" y="0" width="340" height="200" class="dg-water"/>` + T(170, 18, "Vu du dessus", "middle", "dg-lbl mini") +
    `<ellipse cx="196" cy="100" rx="46" ry="17" class="dg-skinfill"/>` + C(254, 100, 11) + L(152, 92, 86, 88) + L(152, 108, 86, 112, "dg-limb back") +
    L(236, 85, 322, 84) + L(238, 110, 178, 120, "dg-limb back") + P("M178 122 Q220 186 318 98", "dg-path dash acc", 'marker-end="url(#ar)"') +
    T(330, 72, "1 bras attend devant", "end", "dg-lbl mini") + T(250, 172, "2 l'autre bras fait le tour…", "middle", "dg-lbl mini") + T(170, 192, "3 …et vient toucher la main restée devant", "middle", "dg-lbl"), "Crawl rattrapé vu du dessus"),
  "rotation-636": () => svg(340, 200, water(340, 200, 70) +
    `<g transform="translate(70 70) rotate(-38)"><ellipse cx="0" cy="0" rx="34" ry="12" class="dg-skinfill"/></g>` + C(70, 70, 10) + T(70, 112, "6 battements", "middle", "dg-lbl mini") + T(8, 40, "épaule hors de l'eau", "start", "dg-lbl mini") +
    `<g transform="translate(270 70) rotate(38)"><ellipse cx="0" cy="0" rx="34" ry="12" class="dg-skinfill"/></g>` + C(270, 70, 10) + T(270, 112, "6 battements", "middle", "dg-lbl mini") +
    AR("M118 74 Q170 40 222 74", "dg-path acc") + T(176, 56, "3 bras pour basculer", "middle", "dg-lbl mini") + T(170, 20, "Vu de face (le nageur vient vers vous)", "middle", "dg-lbl mini") +
    [...Array(6)].map((_, i) => C(24 + i * 14, 150, 5, "dg-easydot")).join("") + [0, 1, 2].map(i => P(`M${120 + i * 26} 156 q10 -22 20 0`, "dg-path acc")).join("") + [...Array(6)].map((_, i) => C(206 + i * 14, 150, 5, "dg-easydot")).join("") +
    T(170, 184, "côté droit · 3 bras · côté gauche · 3 bras …", "middle", "dg-lbl"), "Rotation 6-3-6"),
  "dos-rotation": () => svg(340, 200, water(340, 200, 70) +
    `<g transform="translate(70 72) rotate(32)"><ellipse cx="0" cy="0" rx="34" ry="12" class="dg-skinfill"/></g>` + C(70, 66, 10) + C(70, 57, 2, "dg-dark") +
    `<g transform="translate(270 72) rotate(-32)"><ellipse cx="0" cy="0" rx="34" ry="12" class="dg-skinfill"/></g>` + C(270, 66, 10) + C(270, 57, 2, "dg-dark") +
    L(70, 30, 70, 110, "dg-path dash") + L(270, 30, 270, 110, "dg-path dash") + T(70, 124, "tête fixe", "middle", "dg-lbl mini") + T(270, 124, "tête fixe", "middle", "dg-lbl mini") +
    AR("M118 60 Q170 26 222 60", "dg-path acc") + T(170, 30, "3 bras", "middle", "dg-lbl mini") + T(108, 46, "épaule sort", "start", "dg-lbl mini") + T(170, 16, "Vu de face, sur le dos", "middle", "dg-lbl mini") +
    [...Array(6)].map((_, i) => C(24 + i * 14, 156, 5, "dg-easydot")).join("") + [0, 1, 2].map(i => P(`M${120 + i * 26} 162 q10 -22 20 0`, "dg-path acc")).join("") + [...Array(6)].map((_, i) => C(206 + i * 14, 156, 5, "dg-easydot")).join("") +
    T(170, 188, "Les épaules tournent comme une broche, la tête jamais.", "middle", "dg-lbl"), "Rotation en dos"),
  "resp-3temps": () => svg(340, 200, `<rect x="0" y="0" width="340" height="200" class="dg-bg"/>` +
    ["D", "G", "D", "G", "D", "G"].map((s, i) => `<rect x="${14 + i * 54}" y="40" width="46" height="34" rx="8" class="${i === 2 || i === 5 ? "dg-hard" : "dg-easy"}"/>` + T(37 + i * 54, 62, (i + 1) + " " + s, "middle", "dg-lbl b")).join("") +
    T(145, 30, "inspire à droite ↓", "middle", "dg-lbl mini") + T(334, 30, "inspire à gauche ↓", "end", "dg-lbl mini") +
    T(170, 92, "bras droit (D) / bras gauche (G) : on inspire tous les 3 bras", "middle", "dg-lbl mini") +
    water(340, 200, 150) + `<g transform="rotate(40 170 150)">${C(170, 150, 18)}<rect x="153" y="141" width="10" height="7" rx="3" class="dg-goggle"/><rect x="177" y="141" width="10" height="7" rx="3" class="dg-goggle"/></g>` +
    T(336, 124, "une lunette reste dans l'eau", "end", "dg-lbl mini") + bubbles(110, 168) + T(100, 190, "entre deux : on souffle en continu", "middle", "dg-lbl mini"), "Respiration 3 temps"),
  "hypoxie": () => svg(340, 200, `<rect x="0" y="0" width="340" height="200" class="dg-bg"/>` +
    [1, 2, 3, 4, 5].map(i => `<rect x="${14 + (i - 1) * 64}" y="34" width="56" height="34" rx="8" class="${i === 5 ? "dg-hard" : "dg-easy"}"/>` + T(42 + (i - 1) * 64, 56, i === 5 ? "5 · inspire" : "bras " + i, "middle", "dg-lbl b")).join("") +
    T(170, 92, "souffler doucement et en continu entre deux inspirations", "middle", "dg-lbl mini") +
    `<rect x="14" y="108" width="312" height="80" rx="10" class="dg-stop"/>` + T(170, 130, "⛔ STOP au moindre inconfort → 3 temps ou 2 temps", "middle", "dg-lbl b") +
    T(170, 152, "Jamais seul · jamais d'hyperventilation avant", "middle", "dg-lbl") + T(170, 172, "Jamais d'apnée sous l'eau · 30 s de repos minimum", "middle", "dg-lbl"), "Respiration 5 temps et sécurité"),
  "bat-dos-planche": () => svg(340, 190, water(340, 190, 56) + `<rect x="212" y="51" width="40" height="8" rx="3" class="dg-board"/>` + swimmer({ prone: false, y: 64, arms: [[200, 352], [198, 356]], legs: [-3, 4] }) +
    AR("M180 104 v-28", "dg-path acc") + T(180, 118, "ventre / hanches hauts", "middle", "dg-lbl mini") + T(336, 100, "oreilles dans l'eau", "end", "dg-lbl mini") + T(110, 44, "genoux sous l'eau", "middle", "dg-lbl mini") +
    T(170, 156, "Planche serrée contre la poitrine, regard au plafond,", "middle", "dg-lbl") + T(170, 174, "seuls les pieds remuent la surface.", "middle", "dg-lbl") + dir(10, 20), "Battements dos avec planche"),
  "dos-un-bras": () => svg(340, 190, water(340, 190, 56) + swimmer({ prone: false, y: 62, arms: [[176, 178]], legs: [-4, 6] }) +
    P("M186 60 Q196 -10 300 52", "dg-path dash acc", 'marker-end="url(#ar)"') + P("M300 70 Q290 100 200 82", "dg-path dash", 'marker-end="url(#ar)"') +
    T(178, 46, "sortie pouce en premier", "end", "dg-lbl mini") + T(336, 38, "entrée petit doigt", "end", "dg-lbl mini") + T(236, 14, "bras tendu, à la verticale", "middle", "dg-lbl mini") +
    T(170, 140, "L'autre bras reste le long du corps.", "middle", "dg-lbl") + T(170, 158, "Entrée dans l'axe de l'épaule (11 h ou 1 h),", "middle", "dg-lbl") + T(170, 176, "jamais derrière la tête.", "middle", "dg-lbl") + dir(10, 20), "Dos crawlé un bras"),
  "virage-simple": () => svg(340, 200, `<rect x="0" y="0" width="340" height="200" class="dg-water"/>` +
    [0, 1, 2, 3].map(i => `<rect x="${78 + i * 85}" y="22" width="6" height="110" class="dg-wall"/>`).join("") +
    // 1 toucher
    L(18, 70, 56, 70, "dg-torso") + C(64, 68, 8) + L(66, 66, 78, 60) + T(42, 150, "1 toucher", "middle", "dg-lbl b") +
    // 2 genoux
    C(140, 66, 8) + P("M132 72 q-14 10 -2 22 q12 6 20 -6", "dg-limb") + L(148, 78, 162, 70) + T(127, 150, "2 genoux", "middle", "dg-lbl b") +
    // 3 pousser
    C(196, 86, 8) + L(204, 88, 230, 88, "dg-torso") + P("M230 88 l10 -8 l8 8", "dg-limb") + L(188, 86, 176, 86) + AR("M226 110 h-46", "dg-path acc") + T(212, 150, "3 pousser", "middle", "dg-lbl b") +
    // 4 flèche
    L(262, 92, 316, 92, "dg-torso") + C(276, 92, 7) + L(268, 92, 254, 92) + AR("M300 112 h-46", "dg-path acc") + bubbles(282, 80) + T(297, 150, "4 flèche", "middle", "dg-lbl b") +
    T(170, 180, "Toucher, tourner, pousser sur le côté, glisser 2-3 s.", "middle", "dg-lbl"), "Virage simple et coulée")
};

/* ---------- Schémas brasse ---------- */
/* Nageur de brasse vu du dessus, tête à droite. arms : "front" | "pull" | "side" ; legs : "tendues" | "repli" */
function frogTop(cx, cy, o = {}) {
  let g = `<ellipse cx="${cx}" cy="${cy}" rx="40" ry="15" class="dg-skinfill"/>` + C(cx + 52, cy, 10);
  const sh = [cx + 32, cy], hp = [cx - 34, cy];
  for (const sg of [-1, 1]) {
    const back = "";
    const S = [sh[0], sh[1] + sg * 11], H = [hp[0], hp[1] + sg * 8];
    if (o.arms === "pull") g += `<polyline points="${S[0]},${S[1]} ${S[0] + 20},${S[1] + sg * 22} ${S[0] + 46},${S[1] + sg * 26}" class="dg-limb${back}"/>`;
    else if (o.arms === "side") g += `<polyline points="${S[0]},${S[1]} ${S[0] - 4},${S[1] + sg * 22} ${S[0] - 22},${S[1] + sg * 30}" class="dg-limb${back}"/>`;
    else if (o.arms !== "none") g += `<polyline points="${S[0]},${S[1]} ${S[0] + 34},${S[1] - sg * 3} ${S[0] + 68},${S[1] - sg * 6}" class="dg-limb${back}"/>`;
    if (o.legs === "repli") {
      const K = [H[0] - 34, H[1] + sg * 12], A = [H[0] - 12, H[1] + sg * 28];
      g += `<polyline points="${H[0]},${H[1]} ${K[0]},${K[1]} ${A[0]},${A[1]}" class="dg-limb${back}"/>` + L(A[0], A[1], A[0] - 3, A[1] + sg * 13, "dg-limb thin" + back);
    } else g += `<polyline points="${H[0]},${H[1]} ${H[0] - 40},${H[1] - sg * 4} ${H[0] - 78},${H[1] - sg * 6}" class="dg-limb${back}"/>` + L(H[0] - 78, H[1] - sg * 6, H[0] - 90, H[1] - sg * 6, "dg-limb thin" + back);
  }
  return g;
}
/* Cases de séquence (ex. tirer → respirer → pousser → glisser) */
const frogAt = (x, y, k, o) => `<g transform="translate(${x} ${y}) scale(${k})">${frogTop(0, 0, o)}</g>`;
function seqBoxes(y, items, w = 74, gap = 8, x0 = 14) {
  return items.map((it, i) => { const x = x0 + i * (w + gap); return `<rect x="${x}" y="${y}" width="${w}" height="34" rx="8" class="${it.c || "dg-easy"}"/>` + T(x + w / 2, y + 15, it.t, "middle", "dg-lbl b") + (it.s ? T(x + w / 2, y + 28, it.s, "middle", "dg-lbl mini") : "") + (i < items.length - 1 ? AR(`M${x + w + 1} ${y + 17} h${gap - 2}`, "dg-path acc") : ""); }).join("");
}
/* Pied vu de côté : flexion (canard) ou pointe */
function footSide(x, y, flex) {
  return L(x, y - 26, x, y, "dg-limb") + (flex ? L(x, y, x + 18, y - 4, "dg-limb thin") : L(x, y, x + 4, y + 18, "dg-limb thin"));
}
Object.assign(DIAG, {
  "brasse-complet": () => svg(340, 230, `<rect x="0" y="0" width="340" height="140" class="dg-water"/>` + T(334, 134, "vu du dessus", "end", "dg-lbl mini") +
    frogTop(170, 76, { arms: "pull", legs: "repli" }) +
    P("M300 66 Q300 38 252 40 Q232 46 236 70", "dg-path dash acc", 'marker-end="url(#ar)"') + P("M300 86 Q300 114 252 112 Q232 106 236 82", "dg-path dash acc", 'marker-end="url(#ar)"') +
    P("M128 42 Q70 30 46 72", "dg-path dash", 'marker-end="url(#ar)"') + P("M128 110 Q70 122 46 80", "dg-path dash", 'marker-end="url(#ar)"') +
    T(334, 30, "bras : tirer jusqu'aux épaules", "end", "dg-lbl mini") + T(6, 28, "jambes : pousser en demi-cercle", "start", "dg-lbl mini") + T(100, 134, "pieds en canard", "middle", "dg-lbl mini") +
    seqBoxes(152, [{ t: "1 tirer", s: "bras" }, { t: "2 respirer", s: "tête sort" }, { t: "3 pousser", s: "jambes" }, { t: "4 glisser", s: "1-2 s", c: "dg-hard" }]) +
    T(170, 210, "Bras et jambes ne travaillent jamais en même temps.", "middle", "dg-lbl") + T(170, 226, "Ce sont surtout les jambes qui font avancer.", "middle", "dg-lbl mini"), "Schéma de la brasse complète"),
  "br-jambes-planche": () => svg(340, 230, `<rect x="0" y="0" width="340" height="132" class="dg-water"/>` + T(334, 16, "vu du dessus", "end", "dg-lbl mini") +
    frogTop(190, 72, { arms: "front", legs: "repli" }) + `<rect x="296" y="52" width="36" height="40" rx="6" class="dg-board"/>` +
    P("M140 40 Q76 26 52 66", "dg-path dash acc", 'marker-end="url(#ar)"') + P("M140 104 Q76 118 52 78", "dg-path dash acc", 'marker-end="url(#ar)"') +
    T(232, 124, "1 talons vers les fesses", "middle", "dg-lbl mini") + T(8, 30, "3 pousser l'eau en arrière", "start", "dg-lbl mini") + T(8, 120, "4 jambes serrées, glisse", "start", "dg-lbl mini") + T(314, 44, "planche", "middle", "dg-lbl mini") +
    `<rect x="14" y="142" width="150" height="62" rx="10" class="dg-easy"/>` + footSide(54, 186, true) + T(110, 168, "2 pied fléchi", "middle", "dg-lbl b") + T(110, 184, "« en canard » ✓", "middle", "dg-lbl mini") +
    `<rect x="176" y="142" width="150" height="62" rx="10" class="dg-stop"/>` + footSide(216, 176, false) + T(272, 168, "pied en pointe", "middle", "dg-lbl b") + T(272, 184, "aucune prise ✗", "middle", "dg-lbl mini") +
    T(170, 222, "Genoux pas plus larges que les hanches. Sans palmes.", "middle", "dg-lbl"), "Jambes de brasse avec planche"),
  "br-jambes-dos": () => svg(340, 200, water(340, 200, 70) +
    `<rect x="214" y="58" width="44" height="8" rx="3" class="dg-board"/>` + L(170, 66, 240, 64, "dg-torso") + C(258, 60, 10) + C(261, 51, 2.2, "dg-dark") +
    `<polyline points="170,66 132,94 106,72" class="dg-limb"/>` + L(106, 72, 100, 60, "dg-limb thin") + `<polyline points="170,68 124,72 82,74" class="dg-limb back"/>` +
    P("M100 58 Q62 70 74 98", "dg-path dash acc", 'marker-end="url(#ar)"') + T(132, 112, "genou SOUS l'eau", "middle", "dg-lbl mini") + T(60, 50, "pied fléchi", "middle", "dg-lbl mini") + T(40, 118, "pousser", "middle", "dg-lbl mini") +
    AR("M214 104 v-32", "dg-path acc") + T(218, 118, "hanches hautes", "middle", "dg-lbl mini") + T(336, 92, "oreilles dans l'eau", "end", "dg-lbl mini") +
    T(170, 152, "Descendez les talons sous vous (pas les genoux vers le ventre),", "middle", "dg-lbl") + T(170, 170, "pieds en canard, puis poussez jusqu'à jambes serrées.", "middle", "dg-lbl") + T(170, 188, "Vous voyez vos genoux sortir ? Ils plient trop depuis la hanche.", "middle", "dg-lbl mini"), "Jambes de brasse sur le dos"),
  "br-bras-battements": () => svg(340, 210, `<rect x="0" y="0" width="340" height="140" class="dg-water"/>` + T(6, 16, "vu du dessus", "start", "dg-lbl mini") +
    frogTop(160, 76, { arms: "pull", legs: "tendues" }) +
    P("M290 66 Q292 36 244 38 Q222 44 226 70", "dg-path dash acc", 'marker-end="url(#ar)"') + P("M290 86 Q292 116 244 114 Q222 108 226 82", "dg-path dash acc", 'marker-end="url(#ar)"') +
    [0, 1, 2].map(i => P(`M${14 + i * 8} 64 v24`, "dg-path acc")).join("") + T(30, 104, "battements", "middle", "dg-lbl mini") +
    T(334, 30, "écarter, tirer jusqu'aux épaules…", "end", "dg-lbl mini") + T(334, 132, "…mains sous le menton, puis devant", "end", "dg-lbl mini") +
    seqBoxes(150, [{ t: "tirer", s: "coudes hauts" }, { t: "inspirer", s: "tête monte" }, { t: "allonger", s: "tête replonge" }, { t: "1 s devant", s: "bras tendus", c: "dg-hard" }]) +
    T(170, 204, "Les battements de crawl continuent pendant tout l'exercice.", "middle", "dg-lbl"), "Bras de brasse avec battements de crawl"),
  "br-coordination": () => svg(340, 220, `<rect x="0" y="0" width="340" height="220" class="dg-bg"/>` +
    seqBoxes(20, [{ t: "1 tirer", s: "bras" }, { t: "2 respirer", s: "tête sort" }, { t: "3 pousser", s: "jambes" }, { t: "4 glisser", s: "« 1, 2 »", c: "dg-hard" }]) +
    P("M309 58 Q309 84 170 84 Q31 84 31 60", "dg-path dash acc", 'marker-end="url(#ar)"') + T(170, 98, "on recommence", "middle", "dg-lbl mini") +
    water(340, 220, 118) + frogAt(96, 162, 0.6, { arms: "pull", legs: "tendues" }) + T(88, 208, "bras tirent, jambes tendues", "middle", "dg-lbl mini") +
    frogAt(258, 162, 0.6, { arms: "front", legs: "repli" }) + T(252, 208, "bras devant, puis jambes", "middle", "dg-lbl mini"), "Coordination de la brasse"),
  "br-2j1b": () => svg(340, 200, `<rect x="0" y="0" width="340" height="200" class="dg-bg"/>` +
    seqBoxes(30, [{ t: "complet", s: "+ respiration" }, { t: "jambes", s: "en flèche" }, { t: "glisse", s: "1-2 s", c: "dg-hard" }, { t: "complet", s: "+ respiration" }], 74, 8) +
    T(170, 20, "1 cycle = 1 bras + 2 jambes", "middle", "dg-lbl mini") +
    water(340, 200, 84) + frogAt(178, 120, 0.7, { arms: "front", legs: "repli" }) + T(334, 104, "tête rentrée", "end", "dg-lbl mini") +
    T(170, 172, "Le 2e coup de jambes se fait bras tendus devant,", "middle", "dg-lbl") + T(170, 190, "tête entre les bras, en soufflant dans l'eau.", "middle", "dg-lbl"), "2 coups de jambes pour 1 coup de bras"),
  "br-glisse": () => svg(340, 200, `<rect x="0" y="0" width="340" height="200" class="dg-water"/>` + `<rect x="18" y="26" width="6" height="120" class="dg-wall"/><rect x="316" y="26" width="6" height="120" class="dg-wall"/>` +
    T(170, 18, "25 m", "middle", "dg-lbl b") + L(30, 18, 120, 18, "dg-path") + L(220, 18, 310, 18, "dg-path") +
    T(30, 52, "sans glisse : 16 mouvements", "start", "dg-lbl mini") + [...Array(16)].map((_, i) => C(36 + i * 17.5, 64, 5, "dg-hard")).join("") +
    T(30, 100, "avec glisse : 11 mouvements", "start", "dg-lbl mini") + [...Array(11)].map((_, i) => C(36 + i * 26, 112, 5, "dg-easydot") + (i < 10 ? L(43 + i * 26, 112, 55 + i * 26, 112, "dg-path acc") : "")).join("") +
    T(170, 140, "trait = 2 s en flèche après chaque poussée", "middle", "dg-lbl mini") +
    T(170, 170, "Comptez vos mouvements par 25 m", "middle", "dg-lbl") + T(170, 188, "et enlevez-en 1 ou 2 à chaque série.", "middle", "dg-lbl"), "Glisse longue en brasse"),
  "br-virage": () => svg(340, 200, `<rect x="0" y="0" width="340" height="200" class="dg-water"/>` +
    [0, 1, 2, 3].map(i => `<rect x="${78 + i * 85}" y="22" width="6" height="110" class="dg-wall"/>`).join("") +
    L(18, 72, 56, 72, "dg-torso") + C(64, 70, 8) + L(62, 64, 78, 58) + L(62, 76, 78, 82, "dg-limb back") + T(42, 150, "1 toucher", "middle", "dg-lbl b") + T(42, 163, "2 mains", "middle", "dg-lbl mini") +
    C(140, 66, 8) + P("M132 72 q-14 10 -2 22 q12 6 20 -6", "dg-limb") + L(148, 66, 162, 58) + L(134, 74, 116, 96, "dg-limb back") + T(127, 150, "2 genoux,", "middle", "dg-lbl b") + T(127, 163, "1 main sous l'eau", "middle", "dg-lbl mini") +
    C(196, 86, 8) + L(204, 88, 230, 88, "dg-torso") + P("M230 88 l10 -8 l8 8", "dg-limb") + L(188, 86, 176, 86) + AR("M226 110 h-46", "dg-path acc") + T(212, 150, "3 pousser", "middle", "dg-lbl b") + T(212, 163, "sur le côté", "middle", "dg-lbl mini") +
    L(262, 92, 316, 92, "dg-torso") + C(276, 92, 7) + L(268, 92, 254, 92) + AR("M300 112 h-46", "dg-path acc") + bubbles(282, 80) + T(297, 150, "4 flèche", "middle", "dg-lbl b") + T(297, 163, "1 bras, 1 jambes", "middle", "dg-lbl mini") +
    T(170, 188, "Toucher à 2 mains, tourner, pousser, glisser, repartir.", "middle", "dg-lbl"), "Virage brasse")
});

/* ---------- Schémas vélo ---------- */
function bikeFrame(x, y, s = 1) { // vélo vu de côté, roue arrière centrée en (x,y)
  const W = 92 * s, r = 30 * s;
  return C(x, y, r, "dg-wheel") + C(x + W, y, r, "dg-wheel") + `<polyline points="${x},${y} ${x + 38 * s},${y} ${x + 28 * s},${y - 46 * s} ${x},${y}" class="dg-frame"/>` +
    `<polyline points="${x + 38 * s},${y} ${x + 78 * s},${y - 42 * s} ${x + W},${y}" class="dg-frame"/>` + L(x + 28 * s, y - 46 * s, x + 78 * s, y - 42 * s, "dg-frame") +
    L(x + 26 * s, y - 50 * s, x + 18 * s, y - 54 * s, "dg-frame") + `<rect x="${x + 10 * s}" y="${y - 58 * s}" width="${22 * s}" height="${5 * s}" rx="2" class="dg-dark"/>` +
    L(x + 78 * s, y - 42 * s, x + 80 * s, y - 54 * s, "dg-frame") + P(`M${x + 80 * s} ${y - 54 * s} h${10 * s} q6 0 4 8`, "dg-frame") + C(x + 38 * s, y, 4 * s, "dg-dark");
}
const BDIAG = {
  position: () => svg(340, 200, `<rect width="340" height="200" class="dg-bg"/>` + L(0, 180, 340, 180, "dg-path") + bikeFrame(110, 150) +
    C(212, 66, 10) + L(140, 94, 200, 74, "dg-torso") + L(200, 74, 228, 92, "dg-limb") + L(228, 92, 196, 96, "dg-limb thin") +
    `<polyline points="140,94 162,128 150,174" class="dg-limb"/>` + `<polyline points="140,94 176,116 160,140" class="dg-limb back"/>` +
    T(152, 196, "en bas : genou à peine fléchi (25-35°)", "middle", "dg-lbl mini") + T(336, 96, "coudes souples", "end", "dg-lbl mini") + T(336, 110, "épaules basses", "end", "dg-lbl mini") + T(110, 64, "dos ≈ 45°", "end", "dg-lbl mini") +
    T(170, 22, "Talon sur la pédale en bas = jambe tendue", "middle", "dg-lbl") + T(170, 40, "→ bonne hauteur de selle", "middle", "dg-lbl"), "Position sur le vélo"),
  cadence: () => svg(340, 200, `<rect width="340" height="200" class="dg-bg"/>` + C(120, 100, 56, "dg-wheel") + L(120, 100, 160, 140, "dg-frame") + C(120, 100, 5, "dg-dark") + `<rect x="152" y="136" width="20" height="7" rx="2" class="dg-dark"/>` +
    P("M120 44 A56 56 0 0 1 168 128", "dg-path hard", 'marker-end="url(#ar)"') + P("M168 128 A56 56 0 0 1 80 140", "dg-path acc", 'marker-end="url(#ar)"') + P("M74 132 A56 56 0 0 1 112 45", "dg-path dash", 'marker-end="url(#ar)"') +
    T(184, 74, "12 h → 5 h : on pousse", "start", "dg-lbl mini") + T(120, 178, "en bas : on « racle »", "middle", "dg-lbl mini") + T(56, 76, "on allège", "end", "dg-lbl mini") +
    T(250, 112, "85-95", "middle", "dg-big") + T(250, 132, "tours / minute", "middle", "dg-lbl mini") + T(250, 156, "15 s × 4 = votre cadence", "middle", "dg-lbl mini"), "Cycle de pédalage et cadence"),
  danseuse: () => svg(340, 240, `<rect width="340" height="240" class="dg-bg"/>` + `<polygon points="0,236 340,150 340,240 0,240" class="dg-hill"/>` + `<g transform="translate(40 44) rotate(-12 170 150)">${bikeFrame(120, 150)}` +
    C(206, 48, 10) + L(166, 78, 198, 58, "dg-torso") + L(198, 60, 212, 92, "dg-limb") + `<polyline points="166,78 172,118 158,150" class="dg-limb"/><polyline points="166,78 184,112 178,140" class="dg-limb back"/></g>` +
    T(20, 30, "Debout : hanches au-dessus du pédalier,", "start", "dg-lbl") + T(20, 48, "mains sur les cocottes,", "start", "dg-lbl") + T(20, 66, "1-2 dents plus dur en se levant.", "start", "dg-lbl"), "Grimper en danseuse"),
  echauffement: () => profileSvg([{ t: 300, r: 2 }, { t: 180, r: 3 }, { t: 120, r: 4 }, { t: 60, r: 5 }, { t: 30, r: 7 }, { t: 60, r: 2 }, { t: 30, r: 7 }, { t: 60, r: 2 }, { t: 30, r: 7 }, { t: 60, r: 3 }], "Échauffement : 10-12 min progressives + accélérations"),
  zones: () => svg(340, 200, `<rect width="340" height="200" class="dg-bg"/>` + [["Z1", "Récup", "Vous pourriez chanter", 2], ["Z2", "Endurance", "Phrases complètes", 4], ["Z3", "Tempo", "Phrases courtes", 6], ["Z4", "Seuil", "Quelques mots", 8], ["Z5", "VO2max", "Impossible de parler", 10]].map(([z, n, p, r], i) =>
    `<rect x="14" y="${16 + i * 36}" width="${100 + r * 5}" height="28" rx="6" class="dz${i + 1}"/>` + T(22, 35 + i * 36, z + " · " + n, "start", "dg-lbl b dark") + T(172, 35 + i * 36, p, "start", "dg-lbl mini")).join(""), "Zones cardio et test de la parole"),
  fractionne: () => profileSvg([{ t: 600, r: 3 }, { t: 30, r: 8 }, { t: 30, r: 2 }, { t: 30, r: 8 }, { t: 30, r: 2 }, { t: 30, r: 8 }, { t: 30, r: 2 }, { t: 30, r: 8 }, { t: 30, r: 2 }, { t: 30, r: 8 }, { t: 30, r: 2 }, { t: 300, r: 2 }], "Fractionné : effort 8/10 puis récupération en pédalant"),
  cotes: () => svg(340, 200, `<rect width="340" height="200" class="dg-bg"/>` + `<polygon points="20,180 300,60 320,60 320,180" class="dg-hill"/>` + AR("M60 150 L280 70", "dg-path acc") + AR("M300 92 L80 180", "dg-path dash") +
    T(150, 96, "montée 1 min 30 · 8/10", "middle", "dg-lbl b") + T(150, 112, "assis · 70-80 tr/min", "middle", "dg-lbl mini") + T(250, 150, "descente = récup", "middle", "dg-lbl mini") + T(268, 50, "20 s en danseuse", "middle", "dg-lbl mini") + T(170, 24, "6 répétitions, descente prudente", "middle", "dg-lbl"), "Répétitions en côte"),
  recup: () => profileSvg([{ t: 300, r: 2 }, { t: 1200, r: 3 }, { t: 300, r: 2 }], "Récupération : tout en zone 1-2, aucune sensation d'effort")
};

/* ---------- Profil d'intensité d'une séance (barres = durée × effort) ---------- */
const ZCOL = ["dz1", "dz2", "dz3", "dz4", "dz5"];
function profileSvg(blocks, caption) {
  const W = 340, H = 170, pl = 26, pr = 6, pt = 14, pb = 34, cw = W - pl - pr, ch = H - pt - pb;
  const tot = blocks.reduce((a, b) => a + b.t, 0) || 1; let x = pl, g = "";
  for (let z = 1; z <= 5; z++) { const y = pt + ch - ch * (z * 2) / 10; g += L(pl, y, W - pr, y, "dg-grid") + T(pl - 4, y + 4, "Z" + z, "end", "dg-lbl mini"); }
  for (const b of blocks) {
    const w = Math.max(1.2, cw * b.t / tot), h = b.r ? ch * Math.max(b.r, 1) / 10 : 0, z = b.r ? Math.min(5, Math.max(1, b.r <= 2 ? 1 : b.r <= 4 ? 2 : b.r <= 6 ? 3 : b.r <= 8 ? 4 : 5)) : 0;
    if (h) g += `<rect x="${x.toFixed(1)}" y="${(pt + ch - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" class="${ZCOL[z - 1]}"/>`;
    else g += `<rect x="${x.toFixed(1)}" y="${pt + ch - 3}" width="${w.toFixed(1)}" height="3" class="dg-restbar"/>`;
    x += w;
  }
  const min = Math.round(tot / 60), step = min > 60 ? 15 : min > 25 ? 10 : 5;
  for (let m = 0; m <= min; m += step) { const xx = pl + cw * m * 60 / tot; g += T(xx, pt + ch + 14, m + "′", "middle", "dg-lbl mini"); }
  return `<svg class="dg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(caption)}">${L(pl, pt + ch, W - pr, pt + ch, "dg-path")}${g}${T(W / 2, H - 4, esc(caption), "middle", "dg-lbl mini")}</svg>`;
}
const SWIM_PACE = { E: 44, T: 52, C: 40, R: 50 };
function sessionBlocks(s) {
  const out = [];
  for (const st of s.steps) for (let i = 0; i < st.n; i++) {
    const t = st.s || Math.round(st.d / 25 * (SWIM_PACE[st.p] - (st.rpe >= 8 ? 6 : 0)));
    out.push({ t, r: st.rpe });
    if (st.r) out.push({ t: st.r, r: s.type === "velo" ? 2 : 0 });
  }
  return out;
}
function sessionProfile(s) {
  return profileSvg(sessionBlocks(s), s.type === "velo" ? "Profil de la séance : hauteur = effort, largeur = durée" : "Profil estimé : hauteur = effort, trait plat = repos au mur");
}
