/**
 * ORD'IMPACT — SITE COMPLET V10
 * Toutes les pages · Nouveaux services · Boutique · Espace client · Dashboard
 */
import { useState, useEffect, useRef, createContext, useContext } from "react";

const db = {
  get: async k => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } },
  set: async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch {} },
};

const C = {
  navy:"#001E50", navy2:"#0A1B45", orange:"#F47820", orange2:"#F05A1E",
  blue:"#1E78B4", cyan:"#1E96D2", pale:"#B4D2F0",
  cream:"#F7F9FC", warm:"#FFF7ED", line:"#E4EBF5",
  mid:"#64748B", muted:"#94A3B8", dark:"#0A1628",
  green:"#16A34A", red:"#DC2626", amber:"#D97706", purple:"#7C3AED",
  white:"#FFFFFF",
};

const PRFX = [
  {code:"+594",flag:"🇬🇫",label:"Guyane"},
  {code:"+33", flag:"🇫🇷",label:"France"},
  {code:"+596",flag:"🇲🇶",label:"Martinique"},
  {code:"+590",flag:"🇬🇵",label:"Guadeloupe"},
  {code:"+262",flag:"🇷🇪",label:"Réunion"},
  {code:"+55", flag:"🇧🇷",label:"Brésil"},
  {code:"+1",  flag:"🇺🇸",label:"USA"},
  {code:"+32", flag:"🇧🇪",label:"Belgique"},
];

const isEmail = v => /\S+@\S+\.\S+/.test(v||"");
const isName  = v => (v||"").trim().length >= 2;
const isPhone = v => (v||"").replace(/\D/g,"").length >= 6;
const fSt = (v, fn) => !v ? "" : fn(v) ? "ok" : "err";

const Ctx = createContext({});
const useApp = () => useContext(Ctx);

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("vis"); io.disconnect(); } }, { threshold:0.08 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return ref;
}

/* ── SERVICES DATA ── */
const SVCS_PRES = [
  {icon:"📋",label:"Assistance administrative générale",price:"Sur devis"},
  {icon:"🚗",label:"Cession de véhicule",price:"Sur devis"},
  {icon:"🇫🇷",label:"Dossier de naturalisation",price:"Sur devis"},
  {icon:"🪪",label:"Duplicata de permis de conduire",price:"À partir de 25 €"},
  {icon:"🚘",label:"Carte grise minute",price:"À partir de 35 €",form:"cartegrise"},
  {icon:"🌍",label:"Procédure d'immigration",price:"Sur devis",form:"immigration"},
  {icon:"🗂️",label:"Secrétariat administratif",price:"À partir de 20 €/h",form:"secretariat"},
];
const SVCS_ONLINE = [
  {icon:"📱",label:"Création de visuels & réseaux sociaux",price:"À partir de 30 €",form:"visuels"},
  {icon:"⌨️",label:"Frappe de documents",price:"À partir de 15 €",form:"frappe"},
  {icon:"📲",label:"Gestion de vos réseaux sociaux",price:"À partir de 80 €/mois",form:"reseaux"},
  {icon:"✉️",label:"Signature email professionnelle",price:"À partir de 20 €",form:"signature"},
  {icon:"🖼️",label:"Bannière",price:"À partir de 25 €",form:"banniere"},
  {icon:"📄",label:"Flyers",price:"À partir de 30 €",form:"flyers"},
  {icon:"💼",label:"Carte de visite virtuelle & interactive",price:"À partir de 35 €",form:"cartevisite"},
  {icon:"🍽️",label:"Menu interactif",price:"À partir de 120 €",form:"menuinteractif"},
  {icon:"📦",label:"Fiche produit",price:"À partir de 20 €/fiche",form:"ficheproduit"},
];

const DIG_PRODS = [
  {id:1,name:"Kit Organisation Documents",price:15,desc:"Checklist + modèles de classement numérique",cat:"Organisation",emoji:"📂",file:"kit.pdf",active:true},
  {id:2,name:"Pack Lettres Administratives",price:9,desc:"5 modèles prêts à l'emploi",cat:"Courrier",emoji:"✉️",file:"pack.pdf",active:true},
  {id:3,name:"Guide CAF / APL Pas à Pas",price:12,desc:"Guide illustré étape par étape",cat:"Guides",emoji:"🏠",file:"guide-caf.pdf",active:true},
  {id:4,name:"Tableau Budget Familial",price:8,desc:"Fichier Excel pré-formaté",cat:"Organisation",emoji:"💰",file:"budget.xlsx",active:true},
  {id:5,name:"Guide Impôts en Guyane",price:14,desc:"Déclaration de revenus expliquée",cat:"Guides",emoji:"📋",file:"guide-impots.pdf",active:true},
];
const DROP_PRODS = [
  {id:101,name:"Chemise à soufflet A4",price:4.99,desc:"Classement de documents, coloris assortis",cat:"Papeterie",emoji:"📁",active:true},
  {id:102,name:"Classeur à anneaux A4",price:7.99,desc:"Classeur rigide 8 cm, idéal pour archivage",cat:"Classement",emoji:"📚",active:true},
  {id:103,name:"Pochettes plastiques x100",price:9.99,desc:"Pochettes perforées transparentes A4",cat:"Classement",emoji:"🗃️",active:true},
  {id:104,name:"Étiquettes autocollantes x540",price:6.99,desc:"Étiquettes blanches pour classement",cat:"Papeterie",emoji:"🏷️",active:true},
];

const DEFAULT_SD = {
  heroTitle:"L'administration simplifiée.",
  heroSub:"Parce que la paperasse ne devrait pas vous bloquer — je prends en charge toutes vos démarches administratives, de A à Z.",
  aboutTitle:"8 ans d'expertise à votre service",
  aboutText:"Titulaire d'un BAC PRO ARCU (Accueil Relation Client et Usagers) obtenu en 2017, j'accompagne particuliers et professionnels en Guyane depuis 8 ans.",
  aboutMission:"Mon objectif : vous éviter les tracas administratifs, vous faire gagner du temps et vous redonner la sérénité. Chaque situation est unique — je m'adapte à vous.",
  phone:"06 94 47 33 22",
  email:"ordimpact@gmail.com",
  waNumber:"33694473322",
  instagram:"https://www.instagram.com/ordimpact",
  digProducts:DIG_PRODS,
  dropProducts:DROP_PRODS,
};

/* ════════════════════════════════════════
   CSS GLOBAL
════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Sora',system-ui,sans-serif;background:#fff;color:#0A1B45;overflow-x:hidden;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#F47820;border-radius:3px}

@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeL{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:none}}
@keyframes fadeR{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:none}}
@keyframes float{0%,100%{transform:translateY(0) rotate(var(--r,0deg))}50%{transform:translateY(-10px) rotate(var(--r,0deg))}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes spin2{from{transform:rotate(0)}to{transform:rotate(-360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(244,120,32,.4)}70%{box-shadow:0 0 0 12px rgba(244,120,32,0)}}
@keyframes toastIn{from{opacity:0;transform:translateY(-8px) scale(.96)}to{opacity:1;transform:none}}
@keyframes glow2{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes popIn{0%{transform:scale(0)}60%{transform:scale(1.12)}100%{transform:scale(1)}}

.rv{opacity:0;transform:translateY(22px);transition:opacity .65s cubic-bezier(.16,1,.3,1),transform .65s cubic-bezier(.16,1,.3,1)}
.rv.vis{opacity:1;transform:none}
.rl{opacity:0;transform:translateX(-22px);transition:opacity .65s cubic-bezier(.16,1,.3,1),transform .65s cubic-bezier(.16,1,.3,1)}
.rl.vis{opacity:1;transform:none}
.rr{opacity:0;transform:translateX(22px);transition:opacity .65s cubic-bezier(.16,1,.3,1),transform .65s cubic-bezier(.16,1,.3,1)}
.rr.vis{opacity:1;transform:none}

.card{background:#fff;border-radius:18px;border:1.5px solid #E4EBF5;box-shadow:0 2px 14px rgba(0,30,80,.05);transition:transform .26s cubic-bezier(.34,1.56,.64,1),box-shadow .26s,border-color .2s}
.cardh:hover{transform:translateY(-5px);box-shadow:0 16px 40px rgba(0,30,80,.12);border-color:#C4D0E8}

.btn-p{cursor:pointer;font-family:inherit;font-weight:700;border:none;background:#F47820;color:#fff;padding:12px 24px;border-radius:12px;font-size:14px;display:inline-flex;align-items:center;gap:8px;transition:all .22s;white-space:nowrap;text-decoration:none}
.btn-p:hover{background:#E06810;transform:translateY(-2px);box-shadow:0 8px 24px rgba(244,120,32,.4)}
.btn-n{cursor:pointer;font-family:inherit;font-weight:600;border:2px solid #001E50;background:transparent;color:#001E50;padding:11px 22px;border-radius:12px;font-size:14px;display:inline-flex;align-items:center;gap:8px;transition:all .22s;white-space:nowrap}
.btn-n:hover{background:#001E50;color:#fff;transform:translateY(-2px)}
.btn-wa{cursor:pointer;font-family:inherit;font-weight:700;border:none;background:#25D366;color:#fff;padding:11px 20px;border-radius:12px;font-size:14px;display:inline-flex;align-items:center;gap:8px;transition:all .22s;text-decoration:none}
.btn-wa:hover{background:#1dbb5a;transform:translateY(-2px)}
.btn-pay{cursor:pointer;font-family:inherit;font-weight:800;border:none;background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;padding:14px 28px;border-radius:14px;font-size:15px;display:flex;align-items:center;justify-content:center;gap:9px;width:100%;transition:all .22s;box-shadow:0 6px 18px rgba(22,163,74,.3)}
.btn-pay:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(22,163,74,.45)}

.nav-a{cursor:pointer;font-family:inherit;background:none;border:none;font-size:13.5px;font-weight:600;color:rgba(255,255,255,.7);padding:8px 12px;border-radius:9px;transition:all .18s;white-space:nowrap}
.nav-a:hover{color:#fff;background:rgba(255,255,255,.1)}
.nav-a.on{color:#F47820;background:rgba(244,120,32,.15)}

input,textarea,select{font-family:'Sora',system-ui,sans-serif;font-size:14px;padding:12px 15px;border-radius:11px;border:1.5px solid #E4EBF5;background:#F7F9FC;color:#0A1B45;outline:none;width:100%;transition:all .2s}
input:focus,textarea:focus,select:focus{border-color:#1E78B4;background:#fff;box-shadow:0 0 0 3px rgba(30,120,180,.1)}
input.ok{border-color:#16A34A;background:#f0fdf4}
input.err{border-color:#DC2626;background:#fef2f2}
label{font-size:12.5px;font-weight:700;color:#001E50;display:block;margin-bottom:6px}

.chip{cursor:pointer;font-family:inherit;padding:9px 14px;border-radius:9px;border:1.5px solid #E4EBF5;background:#fff;font-size:13px;font-weight:500;color:#64748B;transition:all .18s;display:flex;align-items:center;gap:7px}
.chip:hover,.chip.on{border-color:#F47820;color:#F47820;background:#FFF7ED;font-weight:700}

.badge{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px}

.modal-bg{position:fixed;inset:0;background:rgba(0,20,60,.55);backdrop-filter:blur(5px);z-index:800;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto;animation:fadeIn .2s}
.modal{background:#fff;border-radius:22px;padding:32px;max-width:640px;width:100%;margin:auto;position:relative;animation:fadeUp .32s cubic-bezier(.34,1.56,.64,1)}

.dash-nav{cursor:pointer;display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:11px;font-size:13px;font-weight:600;color:rgba(255,255,255,.55);transition:all .18s;border:none;background:none;font-family:inherit;width:100%;text-align:left}
.dash-nav:hover,.dash-nav.on{background:rgba(244,120,32,.15);color:#F47820}

.toast{position:fixed;top:14px;right:18px;z-index:9999;padding:12px 20px;border-radius:13px;font-weight:700;font-size:13px;display:flex;align-items:center;gap:9px;box-shadow:0 8px 28px rgba(0,0,0,.2);animation:toastIn .3s ease;min-width:240px}
.toast-ok{background:#001E50;color:#fff}
.toast-err{background:#DC2626;color:#fff}

.stripe{background:linear-gradient(135deg,#6772e5,#5469d4);color:#fff;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700}
.divline{width:44px;height:3px;background:#F47820;border-radius:2px}
.tag{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;letter-spacing:.3px;padding:4px 11px;border-radius:8px}

.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:44px 20px;gap:10px;color:#94A3B8;text-align:center}
.table{width:100%;border-collapse:collapse;font-size:13px}
.table th{text-align:left;padding:9px 13px;color:#94A3B8;font-weight:700;font-size:11px;letter-spacing:.5px;text-transform:uppercase;border-bottom:1px solid #E4EBF5}
.table td{padding:11px 13px;border-bottom:1px solid #F3F6FB;vertical-align:middle}
.table tr:last-child td{border-bottom:none}
.table tr:hover td{background:#FAFBFD}
.progress{height:5px;border-radius:99px;background:#E4EBF5;overflow:hidden}
.prog-fill{height:100%;border-radius:99px;transition:width .8s}
`;

/* ── Logo SVG ── */
function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" fill="#001E50"/>
      <path d="M40 12 A28 28 0 0 1 68 40" stroke="#F47820" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      <path d="M40 12 A28 28 0 1 0 68 40" stroke="#1E96D2" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      <rect x="37" y="17" width="6" height="46" rx="3" fill="white"/>
      <path d="M57 22 L68 11" stroke="#F47820" strokeWidth="4.5" strokeLinecap="round"/>
      <circle cx="69" cy="10" r="4" fill="#F47820"/>
    </svg>
  );
}

function Blobs({ op=0.1 }) {
  return (
    <div style={{ position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0 }}>
      <div style={{ position:"absolute",top:"-15%",right:"-8%",width:420,height:420,background:C.orange,opacity:op,filter:"blur(80px)",borderRadius:"50%" }}/>
      <div style={{ position:"absolute",bottom:"-15%",left:"-8%",width:380,height:380,background:C.blue,opacity:op,filter:"blur(80px)",borderRadius:"50%" }}/>
    </div>
  );
}

function Toast({ t }) {
  if (!t) return null;
  return <div className={`toast toast-${t.type}`}>{t.type==="ok"?"✓":"✕"} {t.msg}</div>;
}

function Modal({ onClose, children }) {
  return (
    <div className="modal-bg" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <button onClick={onClose} style={{ position:"absolute",top:14,right:14,width:32,height:32,borderRadius:"50%",background:C.cream,border:"none",cursor:"pointer",fontSize:16,color:C.muted,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit" }}>✕</button>
        {children}
      </div>
    </div>
  );
}

function Spinner({ light=false }) {
  return <div style={{ width:18,height:18,border:`2.5px solid ${light?"rgba(255,255,255,.3)":"rgba(0,30,80,.15)"}`,borderTopColor:light?"#fff":C.orange,borderRadius:"50%",animation:"spin .7s linear infinite" }}/>;
}

function Avatar({ name, size=40 }) {
  const initials = (name||"").split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()||"?";
  return <div style={{ width:size,height:size,borderRadius:size/3.5,background:`linear-gradient(135deg,${C.navy},${C.blue})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",fontSize:size*.35,flexShrink:0 }}>{initials}</div>;
}

function StatusBadge({ status }) {
  const M = { "Confirmé":"#f0fdf4:#16A34A","confirmé":"#f0fdf4:#16A34A","En attente":"#FFF7ED:#EA580C","en livraison":"#EFF6FF:#1D4ED8","Annulé":"#FEF2F2:#DC2626" };
  const [bg,col] = (M[status]||"#F8FAFC:#64748B").split(":");
  return <span className="badge" style={{ background:bg,color:col }}>{status}</span>;
}

/* ── PHONE FIELD ── */
function PhoneField({ value, onChange, prefix, onPrefix, onVerified }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("input");
  const [code, setCode] = useState("");
  const [inp, setInp] = useState("");
  const [err, setErr] = useState("");
  const sel = PRFX.find(p=>p.code===prefix)||PRFX[0];

  function send() {
    if (!isPhone(value)) { setErr("Numéro invalide"); return; }
    const c = Math.floor(1000+Math.random()*9000).toString();
    setCode(c); setStep("sent"); setErr("");
    console.log("[SMS simulé]", c, "→", prefix, value);
  }
  function verify() {
    if (inp===code) { setStep("done"); onVerified(true); }
    else setErr("Code incorrect");
  }

  return (
    <div>
      <label>Téléphone * <span style={{ fontWeight:400,color:C.muted,fontSize:11 }}>(vérification SMS)</span></label>
      <div style={{ display:"flex",gap:8 }}>
        <div style={{ position:"relative",flexShrink:0 }}>
          <button type="button" onClick={()=>setOpen(!open)} style={{ display:"flex",alignItems:"center",gap:5,padding:"11px 11px",borderRadius:11,border:"1.5px solid #E4EBF5",background:C.cream,cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:600,height:46,whiteSpace:"nowrap" }}>
            {sel.flag} {sel.code} ▾
          </button>
          {open && (
            <div style={{ position:"absolute",top:"110%",left:0,background:"#fff",border:"1.5px solid #E4EBF5",borderRadius:14,boxShadow:"0 10px 28px rgba(0,0,0,.14)",zIndex:200,minWidth:220,maxHeight:250,overflowY:"auto" }}>
              {PRFX.map(p => (
                <button key={p.code} type="button" onClick={()=>{onPrefix(p.code);setOpen(false);}} style={{ display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 14px",background:"none",border:"none",borderBottom:"1px solid #F0F4FA",cursor:"pointer",fontFamily:"inherit",fontSize:13 }}>
                  {p.flag} <strong>{p.code}</strong> <span style={{ color:C.muted,fontSize:12 }}>{p.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex:1,position:"relative" }}>
          <input placeholder="694 12 34 56" value={value} onChange={e=>onChange(e.target.value.replace(/\D/g,""))} disabled={step==="done"} className={step==="done"?"ok":""} style={{ paddingRight:38 }}/>
          {step==="done" && <span style={{ position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",fontSize:15,color:C.green }}>✓</span>}
        </div>
      </div>
      {step==="input" && isPhone(value) && <button type="button" onClick={send} style={{ marginTop:8,background:C.blue,color:"#fff",border:"none",padding:"8px 16px",borderRadius:9,cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:12.5 }}>📱 Recevoir le code SMS</button>}
      {step==="sent" && (
        <div style={{ marginTop:10,background:"#EFF6FF",borderRadius:12,padding:14,border:"1px solid #BFDBFE" }}>
          <p style={{ fontSize:13,color:C.mid,margin:"0 0 10px" }}>Code envoyé au <strong>{prefix}{value}</strong></p>
          <div style={{ display:"flex",gap:8 }}>
            <input value={inp} onChange={e=>setInp(e.target.value.slice(0,4))} maxLength={4} placeholder="1234" style={{ width:90,fontSize:20,fontWeight:800,textAlign:"center",letterSpacing:8 }}/>
            <button type="button" onClick={verify} style={{ background:C.green,color:"#fff",border:"none",padding:"11px 18px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontWeight:700 }}>✓ Valider</button>
          </div>
          {err && <p style={{ color:C.red,fontSize:12,marginTop:6,fontWeight:600 }}>{err}</p>}
          <button type="button" onClick={()=>{setStep("input");setCode("");setInp("");}} style={{ background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",marginTop:6,fontFamily:"inherit" }}>← Changer</button>
        </div>
      )}
      {step==="done" && <div style={{ marginTop:8,display:"flex",alignItems:"center",gap:7,fontSize:12.5,color:C.green,fontWeight:700 }}><span style={{ width:20,height:20,borderRadius:"50%",background:C.green,color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11 }}>✓</span>Numéro vérifié</div>}
    </div>
  );
}

/* ── SF Smart Field ── */
function SF({ label, k, d, setD, type="text", ph, validator, required }) {
  const v = d[k]||"";
  const st = fSt(v, validator||isName);
  return (
    <div>
      {label && <label>{label}{required&&" *"}</label>}
      <div style={{ position:"relative" }}>
        <input type={type} placeholder={ph} value={v} onChange={e=>setD(x=>({...x,[k]:e.target.value}))} className={st} style={{ paddingRight:38 }}/>
        {st && <span style={{ position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",fontSize:15,color:st==="ok"?C.green:C.red }}>{st==="ok"?"✓":"✕"}</span>}
      </div>
    </div>
  );
}

/* ── Confirmed Screen ── */
function Confirmed({ prenom, nom, service, ig, onClose }) {
  return (
    <div style={{ textAlign:"center",padding:"8px 0" }}>
      <div style={{ width:78,height:78,borderRadius:"50%",background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,margin:"0 auto 18px",animation:"popIn .5s ease" }}>✅</div>
      <h3 style={{ fontSize:18,fontWeight:800,color:C.green,margin:"0 0 4px" }}>Merci pour votre confiance,</h3>
      <h2 style={{ fontSize:22,fontWeight:900,color:C.navy,margin:"0 0 12px",fontFamily:"'Fraunces',serif" }}>{prenom} {nom}</h2>
      <p style={{ color:C.mid,fontSize:14,lineHeight:1.8,margin:"0 0 8px" }}>Votre demande <strong>"{service}"</strong> a été reçue.</p>
      <p style={{ color:C.muted,fontSize:13,fontWeight:600,margin:"0 0 20px" }}>Réponse sous 24h — pas plus ! 🚀</p>
      {ig && <div onClick={()=>window.open(ig,"_blank")} style={{ background:"linear-gradient(135deg,#f09433,#dc2743,#bc1888)",borderRadius:13,padding:14,marginBottom:16,cursor:"pointer" }}>
        <div style={{ color:"#fff",fontWeight:800,fontSize:13 }}>📸 Mes astuces organisation sur Instagram !</div>
      </div>}
      <button onClick={onClose} className="btn-n" style={{ justifyContent:"center",width:"100%" }}>Fermer</button>
    </div>
  );
}

/* ── Form Base ── */
function FB({ icon, title, subtitle, bg="#EEF4FF", children }) {
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:18,paddingBottom:15,borderBottom:`1px solid ${C.line}` }}>
        <div style={{ width:46,height:46,borderRadius:13,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:23 }}>{icon}</div>
        <div><h3 style={{ fontSize:18,fontWeight:800,color:C.navy,margin:"0 0 2px" }}>{title}</h3>{subtitle&&<p style={{ fontSize:12,color:C.muted,margin:0 }}>{subtitle}</p>}</div>
      </div>
      {children}
    </div>
  );
}

/* ── Coords Block ── */
function CB({ d, setD, showSociete=false }) {
  const [prefix, setPrefix] = useState("+594");
  return (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
        <SF label="Prénom *" k="prenom" d={d} setD={setD} ph="Marie" required/>
        <SF label="Nom *" k="nom" d={d} setD={setD} ph="Dupont" required/>
      </div>
      {showSociete && <div style={{ marginBottom:12 }}><label>Société / Entreprise</label><input placeholder="SARL Martin" value={d.societe||""} onChange={e=>setD(x=>({...x,societe:e.target.value}))}/></div>}
      <div style={{ marginBottom:12 }}><SF label="Email *" k="email" d={d} setD={setD} type="email" ph="votre@email.fr" validator={isEmail} required/></div>
      <PhoneField value={d.phone||""} onChange={v=>setD(x=>({...x,phone:v}))} prefix={prefix} onPrefix={p=>{setPrefix(p);setD(x=>({...x,prefix:p}));}} onVerified={()=>{}}/>
    </div>
  );
}

/* ════════════════════════════════════════
   APP
════════════════════════════════════════ */
export default function App() {
  const [page, setPage]       = useState("home");
  const [pk, setPk]           = useState(0);
  const [user, setUser]       = useState(null);
  const [isAdmin, setAdm]     = useState(false);
  const [modal, setModal]     = useState(null);
  const [toast, setToast]     = useState(null);
  const [sd, setSd]           = useState(DEFAULT_SD);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [clients, setClients]   = useState([]);
  const [clientDocs, setClientDocs] = useState({});
  const [visitors, setVisitors] = useState(0);

  useEffect(() => {
    (async () => {
      const [b,o,c,s,cd,v,sess] = await Promise.all([
        db.get("oi:b"),db.get("oi:o"),db.get("oi:c"),db.get("oi:sd"),
        db.get("oi:cd"),db.get("oi:v"),db.get("oi:sess"),
      ]);
      if (b) setBookings(b);
      if (o) setOrders(o);
      if (c) setClients(c);
      if (s) setSd(prev=>({...prev,...s}));
      if (cd) setClientDocs(cd);
      const vn=(v||0)+1; setVisitors(vn); await db.set("oi:v",vn);
      if (sess) {
        const cl=(c||[]).find(x=>x.email===sess);
        if (cl) { setUser(cl); if(cl.email==="admin@ordimpact.com") setAdm(true); }
      }
    })();
  }, []);

  function nav(p) { setPage(p); setPk(k=>k+1); setTimeout(()=>window.scrollTo({top:0,behavior:"smooth"}),10); }
  function notify(msg,type="ok") { setToast({msg,type}); setTimeout(()=>setToast(null),3200); }

  async function submitBooking(data) {
    const e={id:Date.now(),...data,status:"En attente",createdAt:new Date().toLocaleDateString("fr-FR")};
    const u=[...bookings,e]; setBookings(u); await db.set("oi:b",u);
    notify("✅ Demande enregistrée !");
  }

  async function purchase(product, buyer) {
    const isNew = !clients.find(c=>c.email===buyer.email);
    const pwd = Math.random().toString(36).slice(-8).toUpperCase();
    let cli = clients.find(c=>c.email===buyer.email);
    if (!cli) {
      cli={id:Date.now(),name:`${buyer.prenom} ${buyer.nom}`,email:buyer.email,phone:buyer.phone||"",password:pwd,createdAt:new Date().toLocaleDateString("fr-FR")};
      const nc=[...clients,cli]; setClients(nc); await db.set("oi:c",nc);
    }
    const ord={id:Date.now(),productId:product.id,productName:product.name,price:product.price,file:product.file||null,isDrop:!!product.isDrop,clientEmail:buyer.email,clientName:cli.name,date:new Date().toLocaleDateString("fr-FR"),status:"confirmé"};
    const no=[...orders,ord]; setOrders(no); await db.set("oi:o",no);
    return {isNew,pwd};
  }

  async function shareDoc(clientEmail,doc) {
    const cur=clientDocs[clientEmail]||[];
    const upd={...clientDocs,[clientEmail]:[...cur,{...doc,id:Date.now(),date:new Date().toLocaleDateString("fr-FR")}]};
    setClientDocs(upd); await db.set("oi:cd",upd);
    notify(`✅ Document partagé !`);
  }

  const ctx={page,nav,user,setUser,isAdmin,setAdm,modal,setModal,sd,setSd,bookings,setBookings,orders,setOrders,clients,setClients,clientDocs,shareDoc,visitors,submitBooking,purchase,notify};

  const MODALS={
    /* services */
    cartegrise:  <FGeneric icon="🚘" title="Carte grise minute" onClose={()=>setModal(null)}/>,
    immigration: <FGeneric icon="🌍" title="Procédure d'immigration" onClose={()=>setModal(null)}/>,
    secretariat: <FGeneric icon="🗂️" title="Secrétariat administratif" onClose={()=>setModal(null)}/>,
    visuels:     <FGeneric icon="📱" title="Visuels & réseaux sociaux" onClose={()=>setModal(null)}/>,
    frappe:      <FGeneric icon="⌨️" title="Frappe de documents" onClose={()=>setModal(null)}/>,
    reseaux:     <FGeneric icon="📲" title="Gestion des réseaux sociaux" onClose={()=>setModal(null)}/>,
    signature:   <FGeneric icon="✉️" title="Signature email" onClose={()=>setModal(null)}/>,
    banniere:    <FGeneric icon="🖼️" title="Bannière" onClose={()=>setModal(null)}/>,
    flyers:      <FGeneric icon="📄" title="Flyers" onClose={()=>setModal(null)}/>,
    cartevisite: <FGeneric icon="💼" title="Carte de visite virtuelle" onClose={()=>setModal(null)}/>,
    menuinteractif:<FGeneric icon="🍽️" title="Menu interactif" onClose={()=>setModal(null)}/>,
    ficheproduit:<FGeneric icon="📦" title="Fiche produit" onClose={()=>setModal(null)}/>,
    autrepart:   <FAutrePart onClose={()=>setModal(null)}/>,
    autopro:     <FAutroPro onClose={()=>setModal(null)}/>,
    archivage:   <FArchivage onClose={()=>setModal(null)}/>,
    dpae:        <FDpae onClose={()=>setModal(null)}/>,
    shoppay:     <FShopPay product={modal?.data} onClose={()=>setModal(null)}/>,
    droporder:   <FDropOrder product={modal?.data} onClose={()=>setModal(null)}/>,
  };

  return (
    <Ctx.Provider value={ctx}>
      <div style={{ fontFamily:"'Sora',system-ui,sans-serif",background:"#fff",overflowX:"hidden" }}>
        <style>{CSS}</style>
        <Toast t={toast}/>
        {modal && MODALS[modal.type] && <Modal onClose={()=>setModal(null)}>{MODALS[modal.type]}</Modal>}
        <NavBar/>
        <main key={pk} style={{ animation:"fadeIn .28s ease" }}>
          {page==="home"      && <HomePage/>}
          {page==="about"     && <AboutPage/>}
          {page==="services"  && <ServicesPage/>}
          {page==="booking"   && <BookingPage/>}
          {page==="shop"      && <ShopPage/>}
          {page==="client"    && <ClientPage/>}
          {page==="contact"   && <ContactPage/>}
          {page==="dashboard" && <DashPage/>}
        </main>
        <SiteFooter/>
        {page!=="booking" && (
          <button onClick={()=>nav("booking")} className="btn-p" style={{ position:"fixed",bottom:24,right:24,zIndex:400,boxShadow:"0 8px 26px rgba(244,120,32,.45)",animation:"pulse 2.5s ease-in-out infinite",fontSize:14,padding:"11px 20px" }}>
            ✨ Diagnostic gratuit
          </button>
        )}
      </div>
    </Ctx.Provider>
  );
}

/* ════════════════════════════════════════
   NAVBAR
════════════════════════════════════════ */
function NavBar() {
  const { page, nav, user, setUser, setAdm, isAdmin } = useApp();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h=()=>setScrolled(window.scrollY>30);
    window.addEventListener("scroll",h); return ()=>window.removeEventListener("scroll",h);
  },[]);

  const LINKS=[
    {id:"about",   label:"Qui suis-je"},
    {id:"services",label:"Mes tarifs"},
    {id:"shop",    label:"Boutique en ligne"},
    {id:"client",  label: user?`👤 ${user.name.split(" ")[0]}`:"Espace client"},
    {id:"contact", label:"Contact"},
  ];

  return (
    <header style={{ position:"sticky",top:0,zIndex:500,background:"#001E50",borderBottom:`3px solid ${C.orange}`,boxShadow:scrolled?"0 4px 24px rgba(0,30,80,.4)":"none",transition:"box-shadow .3s" }}>
      <div style={{ maxWidth:1240,margin:"0 auto",padding:"0 24px",height:64,display:"flex",alignItems:"center",gap:6 }}>
        <div onClick={()=>nav("home")} style={{ cursor:"pointer",display:"flex",alignItems:"center",gap:10,marginRight:14,flexShrink:0 }}>
          <Logo size={38}/>
          <div>
            <div style={{ fontWeight:900,fontSize:16,color:"#fff",letterSpacing:-.3,lineHeight:1 }}>ORD'IMPACT</div>
            <div style={{ fontSize:8.5,color:C.orange,fontWeight:600,fontStyle:"italic",letterSpacing:.3,marginTop:2 }}>Mets de l'ordre. Multiplie ton impact.</div>
          </div>
        </div>
        <nav style={{ display:"flex",alignItems:"center",gap:1,flex:1,flexWrap:"wrap" }}>
          {LINKS.map(({id,label})=>(
            <button key={id} onClick={()=>nav(id)} className={`nav-a${page===id?" on":""}`}>{label}</button>
          ))}
          {isAdmin && <button onClick={()=>nav("dashboard")} className={`nav-a${page==="dashboard"?" on":""}`} style={{ color:"#FFB347" }}>⚙️ Dashboard</button>}
          {user && <button onClick={async()=>{setUser(null);setAdm(false);await db.set("oi:sess",null);}} style={{ background:"none",border:"1px solid rgba(255,255,255,.15)",color:"rgba(255,255,255,.45)",padding:"6px 10px",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"inherit" }}>↩</button>}
        </nav>
        <button onClick={()=>nav("booking")} className="btn-p" style={{ fontSize:13,padding:"9px 16px",flexShrink:0 }}>✨ Diagnostic gratuit</button>
      </div>
    </header>
  );
}

/* ════════════════════════════════════════
   HOME PAGE
════════════════════════════════════════ */
function HomePage() {
  const { nav, sd, setModal } = useApp();
  const [typed, setTyped] = useState("");
  const words = ["en Guyane","pour les familles","pour les pros","sans stress"];
  const [wi, setWi] = useState(0);
  const [del, setDel] = useState(false);
  const r1=useReveal(), r2=useReveal(), r3=useReveal(), r4=useReveal();

  useEffect(()=>{
    const w=words[wi];
    const t=setTimeout(()=>{
      if(!del){if(typed.length<w.length)setTyped(w.slice(0,typed.length+1));else setTimeout(()=>setDel(true),1800);}
      else{if(typed.length>0)setTyped(typed.slice(0,-1));else{setDel(false);setWi(i=>(i+1)%words.length);}}
    },del?45:75);
    return()=>clearTimeout(t);
  },[typed,del,wi]);

  const DOCS=[
    {c:"#E8F4FF",b:"#C7D9FF",r:"-8deg",top:"8%", left:"2%",  icon:"📋",lbl:"Carte grise"},
    {c:"#FFF4E8",b:"#FFD4A8",r:"6deg", top:"5%", right:"2%", icon:"🌍",lbl:"Immigration"},
    {c:"#EFFFEE",b:"#A8F0CC",r:"-3deg",bottom:"12%",left:"4%",icon:"💼",lbl:"Naturalisation"},
    {c:"#FFF0F5",b:"#FFB8D4",r:"8deg", bottom:"8%",right:"3%",icon:"🚘",lbl:"Carte grise"},
  ];

  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",overflow:"hidden",background:"#fff" }}>
        <Blobs/>
        <div style={{ position:"absolute",top:0,right:0,width:"42%",height:"100%",background:C.cream,borderBottomLeftRadius:100,zIndex:0 }}/>
        <div style={{ position:"absolute",left:0,top:"26%",width:5,height:"46%",background:`linear-gradient(${C.orange},${C.cyan})`,borderRadius:"0 4px 4px 0",zIndex:1 }}/>

        <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 52px",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center",position:"relative",zIndex:2 }}>
          <div style={{ animation:"fadeL .8s ease" }}>
            <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:C.warm,borderRadius:9,padding:"5px 13px",marginBottom:22 }}>
              <span style={{ width:7,height:7,borderRadius:"50%",background:C.orange,animation:"glow2 2s infinite" }}/>
              <span style={{ fontSize:11,fontWeight:700,color:C.orange,letterSpacing:.4 }}>Assistante administrative — Guyane française</span>
            </div>
            <h1 style={{ fontSize:48,fontWeight:900,lineHeight:1.08,color:C.navy,letterSpacing:-1.4,marginBottom:6,fontFamily:"'Fraunces',serif" }}>{sd.heroTitle}</h1>
            <h1 style={{ fontSize:48,fontWeight:900,lineHeight:1.08,letterSpacing:-1.4,marginBottom:26,minHeight:"1.15em",fontFamily:"'Fraunces',serif" }}>
              <span style={{ color:C.orange }}>{typed}</span>
              <span style={{ color:C.orange,animation:"blink 1s infinite",marginLeft:2 }}>|</span>
            </h1>
            <p style={{ fontSize:16,color:C.mid,lineHeight:1.85,maxWidth:450,marginBottom:36 }}>{sd.heroSub}</p>
            <div style={{ display:"flex",gap:13,flexWrap:"wrap",marginBottom:40 }}>
              <button onClick={()=>nav("booking")} className="btn-p" style={{ fontSize:15,padding:"13px 26px" }}>Réserver mon diagnostic gratuit →</button>
              <button onClick={()=>nav("services")} className="btn-n" style={{ fontSize:14 }}>Voir les services</button>
            </div>
            <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
              {[{e:"🔒",l:"Discrétion"},{e:"⚡",l:"8 ans d'expertise"},{e:"🎯",l:"Sur mesure"}].map(({e,l},i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",gap:7,background:C.cream,borderRadius:8,padding:"8px 12px",border:`1px solid ${C.line}` }}>
                  <span style={{ fontSize:14 }}>{e}</span><span style={{ fontSize:12,fontWeight:600,color:C.mid }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position:"relative",height:460,animation:"fadeR .9s .15s both" }}>
            {DOCS.map(({c,b,r,top,left,right,bottom,icon,lbl},i)=>(
              <div key={i} style={{ position:"absolute",top,left,right,bottom,width:128,height:148,background:c,border:`2px solid ${b}`,borderRadius:16,padding:"12px 11px","--r":r,animation:`float ${6+i*1.4}s ease-in-out infinite`,animationDelay:`${i*.4}s`,boxShadow:"0 8px 24px rgba(0,30,80,.1)",display:"flex",flexDirection:"column",gap:8 }}>
                <div style={{ fontSize:24 }}>{icon}</div>
                <div style={{ fontSize:11,fontWeight:700,color:C.navy }}>{lbl}</div>
                <div style={{ marginTop:"auto",display:"flex",flexDirection:"column",gap:4 }}>{[70,90,55].map((w,j)=><div key={j} style={{ height:3,width:`${w}%`,background:b,borderRadius:2 }}/>)}</div>
                <div style={{ position:"absolute",bottom:9,right:9,width:17,height:17,borderRadius:"50%",background:C.orange,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <span style={{ color:"#fff",fontSize:8,fontWeight:900 }}>✓</span>
                </div>
              </div>
            ))}
            <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:144,height:144,borderRadius:"50%",background:`linear-gradient(135deg,${C.navy},#0A2B6E)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 22px 55px rgba(0,30,80,.28)",animation:"float 8s ease-in-out infinite" }}>
              <Logo size={70}/>
            </div>
            <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:216,height:216,borderRadius:"50%",border:"2px dashed rgba(244,120,32,.2)",animation:"spin 28s linear infinite",pointerEvents:"none" }}/>
            <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:280,height:280,borderRadius:"50%",border:"1px dashed rgba(30,150,210,.12)",animation:"spin2 38s linear infinite",pointerEvents:"none" }}/>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div style={{ background:C.navy,padding:"12px 0",overflow:"hidden",borderTop:`3px solid ${C.orange}` }}>
        <div style={{ display:"flex",gap:36,animation:"ticker 34s linear infinite",width:"max-content" }}>
          {[...Array(2)].flatMap(()=>
            ["🚘 Carte grise minute","🌍 Immigration","🇫🇷 Naturalisation","⌨️ Frappe de documents","📱 Visuels réseaux sociaux","💼 Carte de visite virtuelle","🍽️ Menu interactif","📄 Flyers","🗂️ Secrétariat administratif","📦 Fiche produit"].map((it,i)=>(
              <span key={i} style={{ fontSize:12,fontWeight:600,color:"rgba(255,255,255,.6)",whiteSpace:"nowrap" }}>{it}<span style={{ color:C.orange,margin:"0 10px" }}>·</span></span>
            ))
          )}
        </div>
      </div>

      {/* Services aperçu */}
      <section style={{ padding:"84px 28px",background:"#fff" }}>
        <div style={{ maxWidth:1160,margin:"0 auto" }}>
          <div ref={r1} className="rv" style={{ marginBottom:48,maxWidth:540 }}>
            <div className="divline" style={{ marginBottom:12 }}/>
            <h2 style={{ fontSize:36,fontWeight:800,color:C.navy,letterSpacing:-.8,lineHeight:1.15,marginBottom:10,fontFamily:"'Fraunces',serif" }}>Tout ce dont vous avez besoin.</h2>
            <p style={{ fontSize:15,color:C.mid,lineHeight:1.8 }}>Services en présentiel à Cayenne & services en ligne depuis partout.</p>
          </div>

          {/* Preview 2 catégories */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:36 }}>
            {/* Présentiel */}
            <div className="card" style={{ padding:"24px 26px",borderLeft:`4px solid ${C.blue}`,cursor:"default" }}>
              <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
                <div style={{ width:40,height:40,borderRadius:11,background:`${C.blue}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>📍</div>
                <div>
                  <div style={{ fontSize:14,fontWeight:800,color:C.navy }}>En présentiel</div>
                  <div style={{ fontSize:12,color:C.muted }}>Cayenne · Matoury · Rémire · 8h–12h</div>
                </div>
              </div>
              {SVCS_PRES.slice(0,4).map((s,i)=>(
                <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.line}`,fontSize:13 }}>
                  <span style={{ color:C.dark }}>{s.icon} {s.label}</span>
                  <span style={{ fontWeight:700,color:C.blue,flexShrink:0,marginLeft:8 }}>{s.price}</span>
                </div>
              ))}
              <button onClick={()=>nav("services")} className="btn-n btn-sm" style={{ marginTop:14,fontSize:12.5 }}>Voir tout →</button>
            </div>
            {/* En ligne */}
            <div className="card" style={{ padding:"24px 26px",borderLeft:`4px solid ${C.orange}`,cursor:"default" }}>
              <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
                <div style={{ width:40,height:40,borderRadius:11,background:`${C.orange}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>💻</div>
                <div>
                  <div style={{ fontSize:14,fontWeight:800,color:C.navy }}>En ligne</div>
                  <div style={{ fontSize:12,color:C.muted }}>Depuis partout · Livraison par email</div>
                </div>
              </div>
              {SVCS_ONLINE.slice(0,4).map((s,i)=>(
                <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.line}`,fontSize:13 }}>
                  <span style={{ color:C.dark }}>{s.icon} {s.label}</span>
                  <span style={{ fontWeight:700,color:C.orange,flexShrink:0,marginLeft:8 }}>{s.price}</span>
                </div>
              ))}
              <button onClick={()=>nav("services")} className="btn-p btn-sm" style={{ marginTop:14,fontSize:12.5 }}>Voir tout →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section style={{ padding:"72px 28px",background:C.cream }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div ref={r2} className="rv" style={{ textAlign:"center",marginBottom:44 }}>
            <div className="divline" style={{ margin:"0 auto 12px" }}/>
            <h2 style={{ fontSize:34,fontWeight:800,color:C.navy,letterSpacing:-.8,fontFamily:"'Fraunces',serif" }}>Comment ça fonctionne ?</h2>
            <p style={{ fontSize:15,color:C.mid,marginTop:8 }}>Un processus simple, clair et rapide.</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:16 }}>
            {[
              {n:"1",icon:"📩",t:"Vous contactez",d:"Via WhatsApp, le formulaire ou le diagnostic gratuit."},
              {n:"2",icon:"💬",t:"Je vous réponds",d:"Sous 24h avec une proposition adaptée."},
              {n:"3",icon:"📋",t:"Devis & paiement",d:"Devis clair, paiement Stripe avant démarrage."},
              {n:"4",icon:"⚙️",t:"Réalisation",d:"Je traite votre dossier dans les délais convenus."},
              {n:"5",icon:"✅",t:"Livraison",d:"Vous recevez votre document ou résultat final."},
            ].map((step,i)=>(
              <div key={i} ref={r2} className="rv" style={{ transitionDelay:`${i*.08}s`,background:"#fff",borderRadius:16,padding:"20px 16px",border:`1px solid ${C.line}`,position:"relative" }}>
                <div style={{ width:30,height:30,borderRadius:9,background:C.orange,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"#fff",marginBottom:10 }}>{step.n}</div>
                <div style={{ fontSize:22,marginBottom:8 }}>{step.icon}</div>
                <div style={{ fontSize:13,fontWeight:700,color:C.navy,marginBottom:5 }}>{step.t}</div>
                <div style={{ fontSize:12,color:C.mid,lineHeight:1.6 }}>{step.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* À propos / Boutique teaser */}
      <section style={{ padding:"72px 28px",background:"#fff" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center" }}>
          <div ref={r3} className="rl">
            <div className="divline" style={{ marginBottom:12 }}/>
            <h2 style={{ fontSize:34,fontWeight:800,color:C.navy,letterSpacing:-.8,lineHeight:1.2,marginBottom:14,fontFamily:"'Fraunces',serif" }}>{sd.aboutTitle}</h2>
            <p style={{ fontSize:15,color:C.mid,lineHeight:1.85,marginBottom:12 }}>{sd.aboutText}</p>
            <p style={{ fontSize:15,color:C.mid,lineHeight:1.85,marginBottom:26 }}>{sd.aboutMission}</p>
            <div style={{ display:"flex",gap:14,flexWrap:"wrap",marginBottom:28 }}>
              {[{n:"8",l:"ans d'expérience"},{n:"BAC PRO",l:"ARCU · 2017"},{n:"< 24h",l:"Délai de réponse"}].map(({n,l},i)=>(
                <div key={i} style={{ background:C.cream,borderRadius:12,padding:"12px 16px",border:`1px solid ${C.line}`,textAlign:"center" }}>
                  <div style={{ fontSize:20,fontWeight:900,color:C.orange }}>{n}</div>
                  <div style={{ fontSize:11,color:C.muted,marginTop:2,fontWeight:600 }}>{l}</div>
                </div>
              ))}
            </div>
            <button onClick={()=>nav("about")} className="btn-n">En savoir plus →</button>
          </div>
          <div ref={r3} className="rr" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            {[{e:"🔒",t:"Discrétion totale",d:"Vos documents restent confidentiels."},{e:"⚡",t:"Réponse rapide",d:"Toujours sous 24h."},{e:"🎯",t:"Sur mesure",d:"Chaque situation est unique."},{e:"🤝",t:"Accompagnement",d:"Je suis là à chaque étape."}].map(({e,t,d},i)=>(
              <div key={i} className="card" style={{ padding:"18px 15px",cursor:"default" }}>
                <div style={{ fontSize:26,marginBottom:9 }}>{e}</div>
                <div style={{ fontWeight:700,color:C.navy,fontSize:13,marginBottom:5 }}>{t}</div>
                <div style={{ fontSize:12,color:C.mid,lineHeight:1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ padding:"0 28px 72px" }}>
        <div ref={r4} className="rv" style={{ maxWidth:1100,margin:"0 auto",background:`linear-gradient(135deg,${C.navy},#0A2B6E)`,borderRadius:22,padding:"60px 64px",display:"grid",gridTemplateColumns:"1fr auto",gap:32,alignItems:"center",position:"relative",overflow:"hidden" }}>
          <Blobs op={0.07}/>
          <div style={{ position:"relative",zIndex:1 }}>
            <div style={{ display:"inline-flex",alignItems:"center",gap:7,background:"rgba(244,120,32,.2)",borderRadius:8,padding:"4px 12px",marginBottom:16 }}>
              <span style={{ fontSize:11,fontWeight:700,color:"#FFB347" }}>Sans engagement · 100% gratuit</span>
            </div>
            <h2 style={{ fontSize:32,fontWeight:800,color:"#fff",lineHeight:1.15,letterSpacing:-.8,margin:"0 0 10px",fontFamily:"'Fraunces',serif" }}>Prêt(e) à en finir avec la paperasse ?</h2>
            <p style={{ color:"rgba(255,255,255,.55)",fontSize:15,lineHeight:1.75,margin:0,maxWidth:400 }}>Un échange gratuit pour trouver la meilleure solution pour vous.</p>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:10,flexShrink:0,position:"relative",zIndex:1 }}>
            <button onClick={()=>nav("booking")} className="btn-p" style={{ fontSize:15,justifyContent:"center" }}>Réserver mon diagnostic →</button>
            <a href={`https://wa.me/${sd.waNumber}`} target="_blank" rel="noreferrer" className="btn-wa" style={{ justifyContent:"center",textDecoration:"none",fontSize:13 }}>💬 WhatsApp</a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ════════════════════════════════════════
   ABOUT PAGE
════════════════════════════════════════ */
function AboutPage() {
  const { sd } = useApp();
  const ref = useReveal();
  return (
    <div>
      <section style={{ background:C.navy,padding:"64px 28px",position:"relative",overflow:"hidden" }}>
        <Blobs/>
        <div style={{ position:"absolute",bottom:0,left:0,width:"100%",height:4,background:`linear-gradient(90deg,${C.orange},${C.cyan})` }}/>
        <div style={{ maxWidth:900,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1 }}>
          <h1 style={{ fontSize:42,fontWeight:900,color:"#fff",letterSpacing:-1,lineHeight:1.1,margin:"0 0 10px",fontFamily:"'Fraunces',serif" }}>À propos de moi</h1>
          <p style={{ color:"rgba(255,255,255,.55)",fontSize:16 }}>8 ans d'expertise au service de votre organisation</p>
        </div>
      </section>
      <div style={{ maxWidth:980,margin:"0 auto",padding:"60px 28px" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1.6fr",gap:56,alignItems:"start" }}>
          <div>
            <div style={{ width:"100%",aspectRatio:"3/4",borderRadius:20,background:`linear-gradient(135deg,${C.navy},#0A2B6E)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",marginBottom:16,boxShadow:"0 18px 50px rgba(0,30,80,.2)" }}>
              <Logo size={78}/>
              <div style={{ color:"rgba(255,255,255,.35)",fontSize:13,marginTop:14,fontStyle:"italic" }}>Photo à ajouter</div>
            </div>
            <a href={sd.instagram} target="_blank" rel="noreferrer" style={{ display:"flex",alignItems:"center",gap:9,background:"linear-gradient(135deg,#f09433,#dc2743,#bc1888)",borderRadius:12,padding:"11px 16px",textDecoration:"none",color:"#fff",fontWeight:700,fontSize:14,marginBottom:9 }}>
              <span>📸</span><div><div style={{ fontWeight:800 }}>Instagram</div><div style={{ fontSize:11,opacity:.8 }}>Astuces & actualités</div></div>
            </a>
            <a href={`https://wa.me/${sd.waNumber}`} target="_blank" rel="noreferrer" className="btn-wa" style={{ justifyContent:"center",width:"100%",textDecoration:"none" }}>📱 WhatsApp</a>
          </div>
          <div ref={ref} className="rr">
            <div className="divline" style={{ marginBottom:12 }}/>
            <h2 style={{ fontSize:30,fontWeight:800,color:C.navy,letterSpacing:-.7,lineHeight:1.2,marginBottom:16,fontFamily:"'Fraunces',serif" }}>{sd.aboutTitle}</h2>
            <p style={{ fontSize:15,color:C.mid,lineHeight:1.85,marginBottom:13 }}>{sd.aboutText}</p>
            <p style={{ fontSize:15,color:C.mid,lineHeight:1.85,marginBottom:24 }}>{sd.aboutMission}</p>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:24 }}>
              {[{n:"8 ans",l:"d'expérience"},{n:"BAC PRO",l:"ARCU · 2017"},{n:"100%",l:"Discrétion"},{n:"< 24h",l:"Délai de réponse"}].map(({n,l},i)=>(
                <div key={i} style={{ background:C.cream,borderRadius:11,padding:"13px 16px",border:`1px solid ${C.line}` }}>
                  <div style={{ fontSize:19,fontWeight:900,color:C.orange }}>{n}</div>
                  <div style={{ fontSize:11,color:C.muted,marginTop:2,fontWeight:600 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ background:"#f0fdf4",borderRadius:12,padding:15,border:"1px solid #bbf7d0" }}>
              <div style={{ fontWeight:700,color:C.green,marginBottom:8 }}>✅ Mes valeurs</div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
                {["Discrétion","Efficacité","Empathie","Transparence","Ponctualité","Sur mesure"].map(v=>(
                  <span key={v} style={{ background:"#dcfce7",color:"#15803d",padding:"3px 11px",borderRadius:8,fontSize:12,fontWeight:700 }}>{v}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   SERVICES PAGE
════════════════════════════════════════ */
function ServicesPage() {
  const { setModal } = useApp();
  const [tab, setTab] = useState("pres");
  const r1=useReveal(), r2=useReveal();

  const TabBtn=({id,label,icon})=>(
    <button onClick={()=>setTab(id)} style={{ padding:"10px 20px",borderRadius:11,fontFamily:"inherit",fontWeight:700,fontSize:13.5,cursor:"pointer",background:tab===id?C.navy:"transparent",color:tab===id?"#fff":C.muted,border:"none",transition:"all .2s" }}>{icon} {label}</button>
  );

  return (
    <div>
      <section style={{ background:C.navy,padding:"64px 28px",position:"relative",overflow:"hidden" }}>
        <Blobs/>
        <div style={{ position:"absolute",bottom:0,left:0,width:"100%",height:4,background:`linear-gradient(90deg,${C.orange},${C.cyan})` }}/>
        <div style={{ maxWidth:1100,margin:"0 auto",position:"relative",zIndex:1 }}>
          <h1 style={{ fontSize:42,fontWeight:900,color:"#fff",letterSpacing:-1,lineHeight:1.1,margin:"0 0 10px",fontFamily:"'Fraunces',serif" }}>Mes Services & Tarifs</h1>
          <p style={{ color:"rgba(255,255,255,.55)",fontSize:15 }}>Cliquez sur un service pour déposer votre demande.</p>
        </div>
      </section>

      <div style={{ maxWidth:1100,margin:"0 auto",padding:"48px 28px" }}>
        {/* Tabs */}
        <div style={{ display:"flex",background:"#fff",borderRadius:13,padding:4,width:"fit-content",border:`1px solid ${C.line}`,gap:4,marginBottom:28 }}>
          <TabBtn id="pres"   label="En présentiel" icon="📍"/>
          <TabBtn id="online" label="En ligne"       icon="💻"/>
        </div>

        {tab==="pres" && (
          <div ref={r1} className="rv">
            <div style={{ background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:14,padding:"14px 18px",marginBottom:22,display:"flex",gap:11,alignItems:"flex-start" }}>
              <span style={{ fontSize:20 }}>📍</span>
              <div>
                <div style={{ fontWeight:700,color:C.navy,fontSize:13,marginBottom:4 }}>Services en présentiel uniquement · 8h à 12h · Je me déplace chez vous</div>
                <div style={{ fontSize:13,color:C.mid }}>Localisation envoyée sur demande WhatsApp · Cayenne, Matoury, Rémire-Montjoly</div>
                <div style={{ display:"flex",gap:10,marginTop:10,flexWrap:"wrap" }}>
                  <a href={`https://wa.me/33694473322?text=${encodeURIComponent("Bonjour, pourriez-vous m'envoyer votre localisation ?")}`} target="_blank" rel="noreferrer" className="btn-wa" style={{ fontSize:12,padding:"7px 14px",textDecoration:"none" }}>📍 Demander la localisation</a>
                  <button onClick={()=>setModal({type:"autrepart"})} style={{ background:"#fff",border:`2px solid ${C.blue}`,color:C.blue,padding:"7px 14px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:12 }}>❓ Autre démarche ?</button>
                </div>
              </div>
            </div>
            <div style={{ background:"#FFF7ED",border:"1px solid #FDE68A",borderRadius:12,padding:"12px 16px",marginBottom:22,fontSize:13,color:"#92400E" }}>
              📍 <strong>Archivage :</strong> visite préalable OBLIGATOIRE pour évaluer l'étendue de la mission — 25 € déduits du devis final.
              <button onClick={()=>setModal({type:"archivage"})} style={{ marginLeft:10,background:"none",border:"none",color:C.orange,fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:13,textDecoration:"underline" }}>Réserver la visite →</button>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:13 }}>
              {SVCS_PRES.map((s,i)=>(
                <div key={i} className={`card${s.form?" cardh":""}`} style={{ padding:"17px 19px",cursor:s.form?"pointer":"default" }} onClick={s.form?()=>setModal({type:s.form,data:s}):undefined}>
                  <div style={{ display:"flex",gap:12,alignItems:"flex-start" }}>
                    <div style={{ width:40,height:40,borderRadius:10,background:`${C.blue}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0 }}>{s.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13,fontWeight:700,color:C.dark,marginBottom:3,lineHeight:1.35 }}>{s.label}</div>
                      <div style={{ fontSize:13,fontWeight:800,color:C.blue }}>{s.price}</div>
                    </div>
                  </div>
                  {s.form && <div style={{ marginTop:9,paddingTop:8,borderTop:`1px solid ${C.line}`,fontSize:12,fontWeight:700,color:C.blue }}>Demander ce service →</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="online" && (
          <div ref={r2} className="rv">
            <div style={{ background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:14,padding:"14px 18px",marginBottom:22,display:"flex",gap:11,alignItems:"flex-start" }}>
              <span style={{ fontSize:20 }}>💻</span>
              <div>
                <div style={{ fontWeight:700,color:C.navy,fontSize:13,marginBottom:3 }}>Services en ligne · 100% digital · Depuis partout</div>
                <div style={{ fontSize:13,color:C.mid }}>Vous remplissez le formulaire → je réalise votre prestation → livraison par email sous 48–72h · Paiement Stripe sécurisé avant démarrage</div>
              </div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:13,marginBottom:20 }}>
              {SVCS_ONLINE.map((s,i)=>(
                <div key={i} className={`card${s.form?" cardh":""}`} style={{ padding:"17px 19px",cursor:s.form?"pointer":"default" }} onClick={s.form?()=>setModal({type:s.form,data:s}):undefined}>
                  <div style={{ display:"inline-flex",alignItems:"center",gap:4,fontSize:10,fontWeight:700,background:`${C.orange}12`,color:C.orange,padding:"2px 8px",borderRadius:6,marginBottom:9 }}>💻 En ligne</div>
                  <div style={{ display:"flex",gap:12,alignItems:"flex-start" }}>
                    <div style={{ width:40,height:40,borderRadius:10,background:`${C.orange}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0 }}>{s.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13,fontWeight:700,color:C.dark,marginBottom:3,lineHeight:1.35 }}>{s.label}</div>
                      <div style={{ fontSize:13,fontWeight:800,color:C.orange }}>{s.price}</div>
                    </div>
                  </div>
                  {s.form && <div style={{ marginTop:9,paddingTop:8,borderTop:`1px solid ${C.line}`,fontSize:12,fontWeight:700,color:C.orange }}>Demander →</div>}
                </div>
              ))}
            </div>
            <div style={{ padding:"16px 20px",background:C.warm,borderRadius:14,border:"1px solid #FED7AA",display:"flex",gap:12,alignItems:"center",flexWrap:"wrap" }}>
              <span style={{ fontSize:22 }}>💡</span>
              <div style={{ flex:1 }}><div style={{ fontWeight:700,color:C.navy,marginBottom:3,fontSize:13 }}>Service non listé ?</div><div style={{ fontSize:12,color:C.mid }}>Décrivez votre besoin — devis sous 24h.</div></div>
              <button onClick={()=>setModal({type:"autopro"})} className="btn-p" style={{ fontSize:12,padding:"8px 15px" }}>❓ Autre service →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   BOOKING PAGE
════════════════════════════════════════ */
function BookingPage() {
  const { submitBooking, sd } = useApp();
  const [step, setStep] = useState(1);
  const [d, setD] = useState({ serviceType:"",service:"",serviceDesc:"",date:"",time:"",prenom:"",nom:"",email:"",phone:"",prefix:"+594",message:"" });
  const [done, setDone] = useState(false);
  const up = (k,v) => setD(x=>({...x,[k]:v}));

  const SVCS_MAP={ Particulier:["Carte grise minute","Immigration","Secrétariat administratif","Naturalisation","Autre démarche"], Professionnel:["Visuels réseaux sociaux","Frappe de documents","Gestion réseaux","Flyers","Bannière","Carte de visite virtuelle","Menu interactif","Fiche produit","Autre"] };
  const P_TIMES=["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30"];
  const O_TIMES=["09:00","09:30","10:00","10:30","11:00","14:00","14:30","15:00","15:30","16:00","17:00"];
  const STEPS=["Votre besoin","Créneau","Coordonnées","Confirmation"];

  if (done) return (
    <div style={{ minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,background:C.cream }}>
      <div style={{ background:"#fff",borderRadius:22,padding:46,maxWidth:480,width:"100%",boxShadow:"0 14px 46px rgba(0,30,80,.1)" }}>
        <Confirmed prenom={d.prenom} nom={d.nom} service="Diagnostic offert" ig={sd.instagram} onClose={()=>{setDone(false);setStep(1);setD({serviceType:"",service:"",serviceDesc:"",date:"",time:"",prenom:"",nom:"",email:"",phone:"",prefix:"+594",message:""}); }}/>
      </div>
    </div>
  );

  return (
    <div>
      <section style={{ background:C.navy,padding:"60px 28px",position:"relative",overflow:"hidden" }}>
        <Blobs/>
        <div style={{ position:"absolute",bottom:0,left:0,width:"100%",height:4,background:`linear-gradient(90deg,${C.orange},${C.cyan})` }}/>
        <div style={{ maxWidth:780,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1 }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:7,background:"rgba(244,120,32,.2)",borderRadius:8,padding:"4px 13px",marginBottom:16 }}>
            <span style={{ fontSize:11,fontWeight:700,color:"#FFB347" }}>Sans engagement · 100% gratuit</span>
          </div>
          <h1 style={{ fontSize:40,fontWeight:900,color:"#fff",letterSpacing:-1,margin:"0 0 9px",fontFamily:"'Fraunces',serif" }}>Diagnostic Offert</h1>
          <p style={{ color:"rgba(255,255,255,.55)",fontSize:15 }}>Premier échange gratuit pour trouver la meilleure solution.</p>
        </div>
      </section>

      <div style={{ maxWidth:640,margin:"0 auto",padding:"46px 28px" }}>
        {/* Stepper */}
        <div style={{ display:"flex",marginBottom:36 }}>
          {STEPS.map((s,i)=>(
            <div key={i} style={{ flex:1,textAlign:"center" }}>
              <div style={{ display:"flex",alignItems:"center" }}>
                {i>0 && <div style={{ flex:1,height:2,borderRadius:2,background:step>i?C.orange:C.line,transition:"background .4s" }}/>}
                <div style={{ width:33,height:33,borderRadius:"50%",background:step>i?C.orange:step===i+1?C.navy:"#fff",color:step>=i+1?"#fff":C.muted,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,flexShrink:0,border:`2px solid ${step>=i+1?(step>i?C.orange:C.navy):C.line}`,transition:"all .35s" }}>{step>i?"✓":i+1}</div>
                {i<3 && <div style={{ flex:1,height:2,borderRadius:2,background:step>i+1?C.orange:C.line,transition:"background .4s" }}/>}
              </div>
              <div style={{ fontSize:10,fontWeight:600,color:step===i+1?C.navy:C.muted,marginTop:4 }}>{s}</div>
            </div>
          ))}
        </div>

        <div style={{ background:"#fff",borderRadius:20,padding:"28px 32px",boxShadow:"0 8px 36px rgba(0,30,80,.08)" }}>
          {step===1 && (
            <div>
              <h3 style={{ fontSize:18,fontWeight:700,color:C.navy,margin:"0 0 20px" }}>Quel est votre profil ?</h3>
              <div style={{ display:"flex",gap:12,marginBottom:20 }}>
                {["Particulier","Professionnel"].map(t=>(
                  <button key={t} type="button" onClick={()=>up("serviceType",t)} style={{ flex:1,padding:"14px",borderRadius:13,border:`2px solid ${d.serviceType===t?C.orange:C.line}`,background:d.serviceType===t?C.warm:"#fafafa",color:d.serviceType===t?C.orange:C.mid,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",transition:"all .2s",display:"flex",flexDirection:"column",alignItems:"center",gap:5 }}>
                    <span style={{ fontSize:24 }}>{t==="Particulier"?"🏠":"💼"}</span>{t}
                  </button>
                ))}
              </div>
              {d.serviceType && (
                <>
                  <div style={{ marginBottom:16 }}>
                    <label style={{ marginBottom:9 }}>Quelle est votre demande ?</label>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                      {(SVCS_MAP[d.serviceType]||[]).map(s=>(
                        <button key={s} type="button" onClick={()=>up("service",s)} className={`chip${d.service===s?" on":""}`}>
                          <span style={{ width:8,height:8,borderRadius:"50%",background:d.service===s?C.orange:C.line,flexShrink:0 }}/>{s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom:18 }}>
                    <label>Expliquez votre besoin * <span style={{ fontWeight:400,color:C.muted,fontSize:11 }}>(obligatoire)</span></label>
                    <textarea placeholder="Décrivez votre situation en quelques mots..." rows={3} value={d.serviceDesc} onChange={e=>up("serviceDesc",e.target.value)} style={{ resize:"vertical" }}/>
                  </div>
                </>
              )}
              <button type="button" onClick={()=>d.serviceType&&d.service&&d.serviceDesc&&setStep(2)} className="btn-p" style={{ width:"100%",justifyContent:"center",padding:"12px",opacity:d.serviceType&&d.service&&d.serviceDesc?1:.4 }}>Continuer →</button>
            </div>
          )}
          {step===2 && (
            <div>
              <h3 style={{ fontSize:18,fontWeight:700,color:C.navy,margin:"0 0 20px" }}>Quand vous convient-il ?</h3>
              <div style={{ marginBottom:16 }}><label>Date souhaitée *</label><input type="date" value={d.date} onChange={e=>up("date",e.target.value)} min={new Date().toISOString().split("T")[0]} className={d.date?"ok":""}/></div>
              <div style={{ marginBottom:24 }}>
                <label>Créneau *</label>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8 }}>
                  {(d.serviceType==="Particulier"?P_TIMES:O_TIMES).map(t=>(
                    <button key={t} type="button" onClick={()=>up("time",t)} style={{ padding:"9px",borderRadius:10,border:`2px solid ${d.time===t?C.green:C.line}`,background:d.time===t?"#f0fdf4":"#fafafa",color:d.time===t?C.green:C.mid,fontWeight:d.time===t?700:500,fontSize:13,cursor:"pointer",fontFamily:"inherit",transition:"all .18s" }}>{t}</button>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex",gap:11 }}>
                <button type="button" onClick={()=>setStep(1)} className="btn-n" style={{ flex:1,justifyContent:"center" }}>← Retour</button>
                <button type="button" onClick={()=>d.date&&d.time&&setStep(3)} className="btn-p" style={{ flex:2,justifyContent:"center",opacity:d.date&&d.time?1:.4 }}>Continuer →</button>
              </div>
            </div>
          )}
          {step===3 && (
            <div>
              <h3 style={{ fontSize:18,fontWeight:700,color:C.navy,margin:"0 0 20px" }}>Vos coordonnées</h3>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
                <SF label="Prénom *" k="prenom" d={d} setD={setD} ph="Marie" required/>
                <SF label="Nom *" k="nom" d={d} setD={setD} ph="Dupont" required/>
              </div>
              <div style={{ marginBottom:12 }}><SF label="Email *" k="email" d={d} setD={setD} type="email" ph="votre@email.fr" validator={isEmail} required/></div>
              <div style={{ marginBottom:16 }}><PhoneField value={d.phone} onChange={v=>up("phone",v)} prefix={d.prefix} onPrefix={v=>up("prefix",v)} onVerified={()=>{}}/></div>
              <div style={{ marginBottom:18 }}><label>Précisions</label><textarea placeholder="Informations complémentaires..." value={d.message||""} onChange={e=>up("message",e.target.value)} rows={2} style={{ resize:"vertical" }}/></div>
              <div style={{ display:"flex",gap:11 }}>
                <button type="button" onClick={()=>setStep(2)} className="btn-n" style={{ flex:1,justifyContent:"center" }}>← Retour</button>
                <button type="button" onClick={()=>d.prenom&&d.nom&&isEmail(d.email)&&d.phone&&setStep(4)} className="btn-p" style={{ flex:2,justifyContent:"center",opacity:d.prenom&&d.nom&&isEmail(d.email)&&d.phone?1:.4 }}>Valider →</button>
              </div>
            </div>
          )}
          {step===4 && (
            <div>
              <h3 style={{ fontSize:18,fontWeight:700,color:C.navy,margin:"0 0 18px" }}>Récapitulatif</h3>
              <div style={{ background:C.cream,borderRadius:13,padding:18,marginBottom:14,border:`1px solid ${C.line}` }}>
                {[["Profil",d.serviceType],["Service",d.service],["Besoin",d.serviceDesc?.slice(0,60)],["Date",d.date],["Heure",d.time],["Nom",`${d.prenom} ${d.nom}`],["Tél",`${d.prefix} ${d.phone}`],["Email",d.email]].filter(([,v])=>v).map(([k,v])=>(
                  <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.line}`,fontSize:13 }}>
                    <span style={{ color:C.muted,fontWeight:600 }}>{k}</span>
                    <span style={{ color:C.navy,fontWeight:700,textAlign:"right",maxWidth:"60%" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:"#f0fdf4",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:C.green,fontWeight:600,border:"1px solid #bbf7d0" }}>✅ 100% gratuit · Sans engagement · Réponse sous 24h.</div>
              <div style={{ display:"flex",gap:11 }}>
                <button type="button" onClick={()=>setStep(3)} className="btn-n" style={{ flex:1,justifyContent:"center" }}>← Modifier</button>
                <button type="button" onClick={async()=>{await submitBooking({...d,service:`${d.service} — ${d.serviceDesc?.slice(0,50)}`});setDone(true);}} className="btn-p" style={{ flex:2,justifyContent:"center",fontSize:14,padding:"13px" }}>🚀 Confirmer</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   SHOP PAGE
════════════════════════════════════════ */
function ShopPage() {
  const { sd, orders, user, nav, setModal } = useApp();
  const [shopTab, setShopTab] = useState("digital");
  const ownedIds = orders.filter(o=>user&&o.clientEmail===user.email).map(o=>o.productId);
  const digProds = (sd.digProducts||DIG_PRODS).filter(p=>p.active);
  const dropProds = (sd.dropProducts||DROP_PRODS).filter(p=>p.active);
  const r1=useReveal(), r2=useReveal();

  return (
    <div>
      <section style={{ background:C.navy,padding:"64px 28px",textAlign:"center",position:"relative",overflow:"hidden" }}>
        <Blobs/>
        <div style={{ position:"absolute",bottom:0,left:0,width:"100%",height:4,background:`linear-gradient(90deg,${C.orange},${C.cyan})` }}/>
        <div style={{ position:"relative",zIndex:1 }}>
          <div style={{ fontSize:44,marginBottom:12 }}>🛍️</div>
          <h1 style={{ fontSize:40,fontWeight:900,color:"#fff",letterSpacing:-1,margin:"0 0 9px",fontFamily:"'Fraunces',serif" }}>La Boutique ORD'IMPACT</h1>
          <p style={{ color:"rgba(255,255,255,.55)",fontSize:15 }}>Produits digitaux & physiques pour vous organiser</p>
          <div style={{ display:"flex",gap:10,justifyContent:"center",marginTop:14,flexWrap:"wrap" }}>
            <span className="stripe">🔒 Stripe sécurisé</span>
            <span className="tag" style={{ background:"rgba(255,255,255,.1)",color:"#fff" }}>⚡ Accès instantané (digital)</span>
            <span className="tag" style={{ background:"rgba(255,255,255,.1)",color:"#fff" }}>🚚 Livraison à domicile (physique)</span>
          </div>
        </div>
      </section>

      <div style={{ background:C.cream,borderBottom:`1px solid ${C.line}`,padding:"14px 28px",display:"flex",justifyContent:"center" }}>
        <div style={{ display:"flex",background:"#fff",borderRadius:13,padding:4,border:`1px solid ${C.line}`,gap:4 }}>
          {[["digital","📱 Produits digitaux","Guides, modèles — téléchargement immédiat"],["drop","📦 Produits physiques","Papeterie — livraison à domicile"]].map(([k,l,sub])=>(
            <button key={k} onClick={()=>setShopTab(k)} style={{ padding:"11px 22px",borderRadius:11,fontFamily:"inherit",fontWeight:700,fontSize:13.5,cursor:"pointer",background:shopTab===k?C.navy:"transparent",color:shopTab===k?"#fff":C.muted,border:"none",transition:"all .22s" }}>
              <div>{l}</div><div style={{ fontSize:11,fontWeight:400,opacity:.65,marginTop:2 }}>{sub}</div>
            </button>
          ))}
        </div>
      </div>

      {!user && <div style={{ background:"#FFFBEB",borderBottom:"1px solid #FDE68A",padding:"11px 28px",textAlign:"center",fontSize:13,color:"#92400E" }}>
        💡 <button type="button" onClick={()=>nav("client")} style={{ background:"none",border:"none",color:C.orange,fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:13,textDecoration:"underline" }}>Connectez-vous</button> pour accéder à vos produits.
      </div>}

      <div style={{ maxWidth:1080,margin:"0 auto",padding:"46px 28px" }}>
        {shopTab==="digital" && (
          <div>
            <div ref={r1} className="rv" style={{ background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:13,padding:"14px 18px",marginBottom:28,display:"flex",gap:11,alignItems:"center" }}>
              <span style={{ fontSize:22 }}>⚡</span>
              <div><div style={{ fontWeight:700,color:C.green,marginBottom:2 }}>Accès immédiat après paiement</div><div style={{ fontSize:13,color:C.mid }}>Paiement → compte créé automatiquement → identifiants + lien de téléchargement envoyés par email.</div></div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(268px,1fr))",gap:20 }}>
              {digProds.map((p,i)=>{
                const isOwned=ownedIds.includes(p.id);
                const r=useReveal();
                return(
                  <div key={p.id} ref={r} className="card cardh rv" style={{ transitionDelay:`${i*.07}s`,display:"flex",flexDirection:"column",position:"relative",border:isOwned?`2px solid ${C.green}`:"1.5px solid #E4EBF5",cursor:"default" }}>
                    {isOwned&&<div style={{ position:"absolute",top:11,right:11,background:C.green,color:"#fff",fontSize:10,fontWeight:700,padding:"2px 11px",borderRadius:99 }}>✓ ACHETÉ</div>}
                    <div style={{ padding:"22px 20px 14px" }}>
                      <div style={{ fontSize:34,marginBottom:10 }}>{p.emoji}</div>
                      <div style={{ fontSize:10,fontWeight:700,color:C.blue,textTransform:"uppercase",letterSpacing:.6,marginBottom:6 }}>{p.cat}</div>
                      <h3 style={{ fontSize:14,fontWeight:700,color:C.navy,margin:"0 0 7px",lineHeight:1.35 }}>{p.name}</h3>
                      <p style={{ fontSize:12.5,color:C.muted,lineHeight:1.6,margin:0 }}>{p.desc}</p>
                    </div>
                    <div style={{ padding:"12px 20px",borderTop:`1px solid ${C.line}`,marginTop:"auto",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                      <span style={{ fontSize:21,fontWeight:800,color:C.orange }}>{p.price} €</span>
                      {isOwned
                        ?<a href={`/downloads/${p.file}`} style={{ background:C.blue,color:"#fff",border:"none",padding:"7px 13px",borderRadius:9,cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:12,textDecoration:"none" }}>↓ Télécharger</a>
                        :<button type="button" onClick={()=>setModal({type:"shoppay",data:p})} className="btn-p" style={{ padding:"8px 14px",fontSize:12.5 }}>Acheter →</button>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {shopTab==="drop" && (
          <div>
            <div ref={r2} className="rv" style={{ background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:13,padding:"14px 18px",marginBottom:28,display:"flex",gap:11,alignItems:"center" }}>
              <span style={{ fontSize:22 }}>🚚</span>
              <div><div style={{ fontWeight:700,color:C.blue,marginBottom:2 }}>Livraison à domicile</div><div style={{ fontSize:13,color:C.mid }}>Produits expédiés directement depuis notre partenaire. Commandez en un clic, recevez chez vous.</div></div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(268px,1fr))",gap:20 }}>
              {dropProds.map((p,i)=>{
                const r=useReveal();
                return(
                  <div key={p.id} ref={r} className="card cardh rv" style={{ transitionDelay:`${i*.07}s`,display:"flex",flexDirection:"column",cursor:"default" }}>
                    <div style={{ padding:"22px 20px 14px" }}>
                      <div style={{ fontSize:34,marginBottom:10 }}>{p.emoji}</div>
                      <div className="tag" style={{ background:"#EFF6FF",color:C.blue,marginBottom:8 }}>{p.cat}</div>
                      <h3 style={{ fontSize:14,fontWeight:700,color:C.navy,margin:"0 0 7px",lineHeight:1.35 }}>{p.name}</h3>
                      <p style={{ fontSize:12.5,color:C.muted,lineHeight:1.6,margin:0 }}>{p.desc}</p>
                    </div>
                    <div style={{ padding:"12px 20px",borderTop:`1px solid ${C.line}`,marginTop:"auto",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                      <span style={{ fontSize:19,fontWeight:800,color:C.orange }}>{p.price} €</span>
                      <button type="button" onClick={()=>setModal({type:"droporder",data:p})} className="btn-p" style={{ padding:"8px 14px",fontSize:12.5 }}>Commander →</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   CLIENT PAGE (Espace client)
════════════════════════════════════════ */
function ClientPage() {
  const { user, setUser, isAdmin, setAdm, orders, clients, setClients, sd, clientDocs, nav, notify } = useApp();
  const [view, setView] = useState(user?"dash":"login");
  const [tab, setTab] = useState("dashboard");
  const [form, setForm] = useState({ name:"",email:"",password:"" });
  const [fp, setFp] = useState(false);
  const [loading, setLoading] = useState(false);
  const up = (k,v) => setForm(f=>({...f,[k]:v}));

  async function login() {
    setLoading(true);
    await new Promise(r=>setTimeout(r,500));
    if (form.email==="admin@ordimpact.com"&&form.password==="Admin2024!") {
      const admin={id:0,name:"Chawanda — Admin",email:"admin@ordimpact.com",createdAt:"—"};
      setAdm(true);setUser(admin);await db.set("oi:sess","admin@ordimpact.com");
      notify("Bienvenue, Administratrice !");setView("dash");setLoading(false);return;
    }
    const f=clients.find(c=>c.email===form.email&&c.password===form.password);
    if(f){setUser(f);await db.set("oi:sess",f.email);notify(`Bienvenue, ${f.name.split(" ")[0]} !`);setView("dash");}
    else notify("Email ou mot de passe incorrect.","err");
    setLoading(false);
  }

  async function register() {
    if(!form.name||!form.email||!form.password){notify("Remplissez tous les champs.","err");return;}
    if(!isEmail(form.email)){notify("Email invalide.","err");return;}
    if(form.password.length<6){notify("Mot de passe trop court.","err");return;}
    if(clients.find(c=>c.email===form.email)){notify("Email déjà utilisé.","err");return;}
    setLoading(true);await new Promise(r=>setTimeout(r,500));
    const nc={id:Date.now(),name:form.name,email:form.email,password:form.password,createdAt:new Date().toLocaleDateString("fr-FR")};
    const u=[...clients,nc];setClients(u);await db.set("oi:c",u);
    setUser(nc);await db.set("oi:sess",nc.email);notify(`Bienvenue ${nc.name.split(" ")[0]} ! 🎉`);setView("dash");setLoading(false);
  }

  const myOrders=orders.filter(o=>user&&o.clientEmail===user.email);
  const myDocs=(clientDocs[user?.email]||[]);

  if (!user||view!=="dash") return (
    <div style={{ minHeight:"92vh",background:`linear-gradient(145deg,${C.navy},#0A2B6E)`,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden" }}>
      <Blobs op={0.08}/>
      <div style={{ width:"100%",maxWidth:420,position:"relative",zIndex:1 }}>
        <div style={{ textAlign:"center",marginBottom:26 }}>
          <Logo size={56}/>
          <h2 style={{ fontSize:24,fontWeight:800,color:"#fff",margin:"14px 0 4px",fontFamily:"'Fraunces',serif" }}>Espace Client</h2>
          <p style={{ color:"rgba(255,255,255,.45)",fontSize:13,fontStyle:"italic" }}>Mets de l'ordre. Multiplie ton impact.</p>
        </div>
        {!fp?(
          <div style={{ background:"#fff",borderRadius:22,overflow:"hidden" }}>
            <div style={{ display:"flex",background:C.cream,borderBottom:`1px solid ${C.line}` }}>
              {[["login","Connexion"],["register","Créer un compte"]].map(([v,l])=>(
                <button key={v} type="button" onClick={()=>setView(v)} style={{ flex:1,padding:"13px",fontFamily:"inherit",fontWeight:700,fontSize:13.5,cursor:"pointer",background:view===v?"#fff":"transparent",color:view===v?C.navy:C.muted,border:"none",borderBottom:view===v?`3px solid ${C.orange}`:"3px solid transparent",transition:"all .2s" }}>{l}</button>
              ))}
            </div>
            <div style={{ padding:26 }}>
              {view==="login"&&(
                <div>
                  {[{k:"email",l:"Email",t:"email",ph:"votre@email.fr"},{k:"password",l:"Mot de passe",t:"password",ph:"••••••••"}].map(({k,l,t,ph})=>(
                    <div key={k} style={{ marginBottom:14 }}><label>{l}</label><input type={t} placeholder={ph} value={form[k]||""} onChange={e=>up(k,e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/></div>
                  ))}
                  <button type="button" onClick={login} className="btn-p" style={{ width:"100%",justifyContent:"center",padding:"12px",fontSize:14 }}>{loading?<Spinner light/>:"Se connecter →"}</button>
                  <button type="button" onClick={()=>setFp(true)} style={{ background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",marginTop:11,display:"block",width:"100%",textAlign:"center",fontFamily:"inherit" }}>Mot de passe oublié ?</button>
                  <div style={{ marginTop:11,padding:"9px 13px",background:"#EFF6FF",borderRadius:9,fontSize:11.5,color:"#1E40AF" }}><strong>Démo admin :</strong> admin@ordimpact.com / Admin2024!</div>
                </div>
              )}
              {view==="register"&&(
                <div>
                  {[{k:"name",l:"Nom et prénom",t:"text",ph:"Marie Dupont"},{k:"email",l:"Email",t:"email",ph:"votre@email.fr"},{k:"password",l:"Mot de passe (6 min.)",t:"password",ph:"••••••••"}].map(({k,l,t,ph})=>(
                    <div key={k} style={{ marginBottom:14 }}><label>{l}</label><input type={t} placeholder={ph} value={form[k]||""} onChange={e=>up(k,e.target.value)}/></div>
                  ))}
                  <button type="button" onClick={register} className="btn-p" style={{ width:"100%",justifyContent:"center",padding:"12px",fontSize:14 }}>{loading?<Spinner light/>:"Créer mon compte →"}</button>
                </div>
              )}
            </div>
          </div>
        ):(
          <div style={{ background:"#fff",borderRadius:22,padding:28,textAlign:"center" }}>
            <div style={{ fontSize:40,marginBottom:12 }}>🔑</div>
            <h3 style={{ fontSize:17,fontWeight:700,color:C.navy,margin:"0 0 9px" }}>Mot de passe oublié</h3>
            <p style={{ fontSize:13,color:C.mid,margin:"0 0 16px" }}>Contactez-moi pour réinitialiser votre accès :</p>
            <div style={{ background:C.warm,borderRadius:11,padding:14,marginBottom:16 }}>
              <div style={{ fontSize:15,fontWeight:800,color:C.orange }}>📞 {sd.phone}</div>
              <div style={{ fontSize:12,color:C.mid,marginTop:4 }}>{sd.email}</div>
            </div>
            <button type="button" onClick={()=>setFp(false)} className="btn-n" style={{ width:"100%",justifyContent:"center" }}>← Retour</button>
          </div>
        )}
      </div>
    </div>
  );

  // Dashboard client
  const CLIENT_TABS=[{id:"dashboard",icon:"🏠",label:"Accueil"},{id:"products",icon:"🛍️",label:"Mes produits"},{id:"docs",icon:"📁",label:"Documents",count:myDocs.length},{id:"profile",icon:"👤",label:"Mon profil"}];

  return (
    <div style={{ maxWidth:980,margin:"0 auto",padding:"36px 24px" }}>
      <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:24 }}>
        <Avatar name={user.name} size={50}/>
        <div>
          <h1 style={{ fontSize:22,fontWeight:800,color:C.navy,margin:"0 0 2px",fontFamily:"'Fraunces',serif" }}>Bonjour, {user.name.split(" ")[0]} ! 👋</h1>
          <p style={{ color:C.muted,margin:0,fontSize:13 }}>{user.email}</p>
        </div>
        {isAdmin&&<button onClick={()=>nav("dashboard")} className="btn-p" style={{ marginLeft:"auto",fontSize:12,padding:"8px 15px" }}>⚙️ Dashboard admin</button>}
      </div>

      <div style={{ display:"flex",gap:4,marginBottom:22,background:"#fff",borderRadius:13,padding:4,border:`1px solid ${C.line}`,width:"fit-content" }}>
        {CLIENT_TABS.map(({id,icon,label,count})=>(
          <button key={id} onClick={()=>setTab(id)} style={{ padding:"9px 16px",borderRadius:10,fontFamily:"inherit",fontWeight:700,fontSize:13,cursor:"pointer",background:tab===id?C.navy:"transparent",color:tab===id?"#fff":C.muted,border:"none",transition:"all .2s",display:"flex",alignItems:"center",gap:6 }}>
            {icon} {label}
            {count>0&&<span style={{ background:C.orange,color:"#fff",fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:99 }}>{count}</span>}
          </button>
        ))}
      </div>

      {tab==="dashboard"&&(
        <div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:13,marginBottom:20 }}>
            {[{l:"Produits achetés",v:myOrders.length,e:"🛍️",c:C.orange},{l:"Total dépensé",v:`${myOrders.reduce((s,o)=>s+o.price,0)} €`,e:"💶",c:C.green},{l:"Documents reçus",v:myDocs.length,e:"📁",c:C.blue}].map(({l,v,e,c},i)=>(
              <div key={i} className="card" style={{ padding:"16px",textAlign:"center",borderTop:`3px solid ${c}`,cursor:"default" }}>
                <div style={{ fontSize:22,marginBottom:6 }}>{e}</div>
                <div style={{ fontSize:22,fontWeight:800,color:c }}>{v}</div>
                <div style={{ fontSize:11,color:C.muted,marginTop:3 }}>{l}</div>
              </div>
            ))}
          </div>
          {myDocs.length>0&&(
            <div className="card" style={{ marginBottom:14,cursor:"default" }}>
              <div style={{ fontWeight:700,color:C.navy,marginBottom:13,fontSize:14 }}>📁 Documents récents</div>
              {myDocs.slice(0,3).map((doc,i)=>(
                <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.line}` }}>
                  <div style={{ display:"flex",gap:10,alignItems:"center" }}><span style={{ fontSize:20 }}>📄</span><div><div style={{ fontWeight:700,color:C.navy,fontSize:13 }}>{doc.name}</div><div style={{ fontSize:11,color:C.muted }}>{doc.date}</div></div></div>
                  {doc.url&&<a href={doc.url} target="_blank" rel="noreferrer" style={{ background:C.blue,color:"#fff",padding:"5px 12px",borderRadius:8,fontSize:12,fontWeight:700,textDecoration:"none" }}>↓ Voir</a>}
                </div>
              ))}
            </div>
          )}
          {myOrders.length>0&&(
            <div className="card" style={{ cursor:"default" }}>
              <div style={{ fontWeight:700,color:C.navy,marginBottom:13,fontSize:14 }}>🛍️ Dernières commandes</div>
              {myOrders.slice(-3).reverse().map(o=>(
                <div key={o.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.line}` }}>
                  <div><div style={{ fontWeight:700,color:C.navy,fontSize:13 }}>{o.productName}</div><div style={{ fontSize:11,color:C.muted }}>{o.date}</div></div>
                  <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                    <StatusBadge status={o.status}/>
                    <span style={{ fontWeight:800,color:C.orange }}>{o.price} €</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab==="products"&&(
        <div>
          {myOrders.length===0
            ?<div className="card" style={{ cursor:"default" }}><div className="empty"><div style={{ fontSize:44,opacity:.35 }}>🛍️</div><div style={{ fontWeight:700,color:C.mid }}>Aucun produit acheté</div><button onClick={()=>nav("shop")} className="btn-p" style={{ marginTop:12 }}>Découvrir la boutique →</button></div></div>
            :myOrders.map(o=>(
              <div key={o.id} className="card" style={{ marginBottom:11,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,cursor:"default" }}>
                <div><div style={{ fontWeight:700,color:C.navy,fontSize:14 }}>{o.productName}</div><div style={{ fontSize:12,color:C.muted }}>{o.date} · {o.price} €</div></div>
                <div style={{ display:"flex",gap:9,alignItems:"center" }}>
                  <StatusBadge status={o.status}/>
                  {o.file&&!o.isDrop&&<a href={`/downloads/${o.file}`} style={{ background:C.blue,color:"#fff",padding:"6px 13px",borderRadius:9,fontSize:12,fontWeight:700,textDecoration:"none" }}>↓ Télécharger</a>}
                  {o.isDrop&&<span className="badge" style={{ background:"#EFF6FF",color:C.blue }}>🚚 Livraison</span>}
                </div>
              </div>
            ))
          }
        </div>
      )}

      {tab==="docs"&&(
        <div>
          {myDocs.length===0
            ?<div className="card" style={{ cursor:"default" }}><div className="empty"><div style={{ fontSize:44,opacity:.35 }}>📭</div><div style={{ fontWeight:700,color:C.mid }}>Aucun document partagé</div><div style={{ fontSize:13,color:C.muted }}>Les documents partagés par ORD'IMPACT apparaîtront ici.</div></div></div>
            :myDocs.map((doc,i)=>(
              <div key={i} className="card" style={{ marginBottom:11,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,cursor:"default" }}>
                <div style={{ display:"flex",gap:11,alignItems:"center" }}><span style={{ fontSize:26 }}>📄</span><div><div style={{ fontWeight:700,color:C.navy,fontSize:14 }}>{doc.name}</div><div style={{ fontSize:12,color:C.muted }}>Partagé le {doc.date}{doc.note&&` · ${doc.note}`}</div></div></div>
                {doc.url&&<a href={doc.url} target="_blank" rel="noreferrer" style={{ background:C.blue,color:"#fff",padding:"7px 14px",borderRadius:9,fontSize:12.5,fontWeight:700,textDecoration:"none" }}>↓ Télécharger</a>}
              </div>
            ))
          }
        </div>
      )}

      {tab==="profile"&&(
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          <div className="card" style={{ cursor:"default" }}>
            <div style={{ fontWeight:700,color:C.navy,marginBottom:14,fontSize:14 }}>📝 Informations</div>
            {[["Nom",user.name],["Email",user.email],["Inscrit le",user.createdAt]].map(([k,v])=>(
              <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.line}`,fontSize:13 }}>
                <span style={{ color:C.muted,fontWeight:600 }}>{k}</span>
                <span style={{ color:C.navy,fontWeight:700 }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{ cursor:"default" }}>
            <div style={{ fontWeight:700,color:C.navy,marginBottom:14,fontSize:14 }}>📞 Nous contacter</div>
            <a href={`https://wa.me/${sd.waNumber}`} target="_blank" rel="noreferrer" className="btn-wa" style={{ textDecoration:"none",justifyContent:"center",width:"100%",marginBottom:10 }}>💬 WhatsApp</a>
            <a href={`mailto:${sd.email}`} style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:C.blue,color:"#fff",padding:"10px",borderRadius:11,textDecoration:"none",fontFamily:"inherit",fontWeight:700,fontSize:13 }}>📧 Email</a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   CONTACT PAGE
════════════════════════════════════════ */
function ContactPage() {
  const { sd, submitBooking } = useApp();
  const [d, setD] = useState({ prenom:"",nom:"",email:"",phone:"",prefix:"+594",sujet:"",message:"" });
  const [done, setDone] = useState(false);
  const up=(k,v)=>setD(x=>({...x,[k]:v}));

  if (done) return (
    <div style={{ minHeight:"70vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
      <div style={{ maxWidth:440,width:"100%",background:"#fff",borderRadius:22,padding:44,textAlign:"center",boxShadow:"0 14px 44px rgba(0,30,80,.1)" }}>
        <Confirmed prenom={d.prenom} nom={d.nom} service="votre message" ig={sd.instagram} onClose={()=>setDone(false)}/>
      </div>
    </div>
  );

  return (
    <div>
      <section style={{ background:C.navy,padding:"60px 28px",textAlign:"center",position:"relative",overflow:"hidden" }}>
        <Blobs/>
        <div style={{ position:"absolute",bottom:0,left:0,width:"100%",height:4,background:`linear-gradient(90deg,${C.orange},${C.cyan})` }}/>
        <div style={{ position:"relative",zIndex:1 }}>
          <h1 style={{ fontSize:40,fontWeight:900,color:"#fff",letterSpacing:-1,margin:"0 0 9px",fontFamily:"'Fraunces',serif" }}>Contact</h1>
          <p style={{ color:"rgba(255,255,255,.55)",fontSize:15 }}>Je réponds dans les 24h — toujours.</p>
        </div>
      </section>
      <div style={{ maxWidth:980,margin:"0 auto",padding:"60px 28px",display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:56,alignItems:"start" }}>
        <div>
          <div className="divline" style={{ marginBottom:14 }}/>
          <h2 style={{ fontSize:26,fontWeight:800,color:C.navy,marginBottom:22,fontFamily:"'Fraunces',serif" }}>Parlons de votre projet</h2>
          {[{e:"📞",t:"Téléphone",v:sd.phone,href:`tel:${sd.phone.replace(/\s/g,"")}`},{e:"📧",t:"Email",v:sd.email,href:`mailto:${sd.email}`},{e:"📍",t:"Zone",v:"Cayenne · Matoury · Rémire"},{e:"🕐",t:"Horaires",v:"Particuliers 8h–12h · Pros 9h–17h"}].map(({e,t,v,href},i)=>(
            <div key={i} style={{ display:"flex",gap:13,alignItems:"flex-start",marginBottom:18 }}>
              <div style={{ width:42,height:42,borderRadius:11,background:C.warm,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0 }}>{e}</div>
              <div>
                <div style={{ fontWeight:700,color:C.navy,fontSize:12,marginBottom:2 }}>{t}</div>
                {href?<a href={href} style={{ fontSize:13.5,color:C.orange,fontWeight:600,textDecoration:"none" }}>{v}</a>:<div style={{ fontSize:13.5,color:C.mid }}>{v}</div>}
              </div>
            </div>
          ))}
          <div style={{ marginTop:20 }}>
            <a href={`https://wa.me/${sd.waNumber}`} target="_blank" rel="noreferrer" className="btn-wa" style={{ textDecoration:"none",justifyContent:"center",width:"100%",marginBottom:9 }}>💬 WhatsApp</a>
            <a href={sd.instagram} target="_blank" rel="noreferrer" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"linear-gradient(135deg,#f09433,#dc2743,#bc1888)",borderRadius:11,padding:"11px 18px",textDecoration:"none",color:"#fff",fontWeight:700,fontSize:13 }}>📸 Instagram</a>
          </div>
        </div>
        <div className="card" style={{ padding:28,cursor:"default" }}>
          <h3 style={{ fontSize:17,fontWeight:700,color:C.navy,margin:"0 0 20px" }}>Envoyez-moi un message</h3>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:13 }}>
            <SF label="Prénom *" k="prenom" d={d} setD={setD} ph="Marie" required/>
            <SF label="Nom *" k="nom" d={d} setD={setD} ph="Dupont" required/>
          </div>
          <div style={{ marginBottom:13 }}><SF label="Email *" k="email" d={d} setD={setD} type="email" ph="votre@email.fr" validator={isEmail} required/></div>
          <div style={{ marginBottom:13 }}><PhoneField value={d.phone} onChange={v=>up("phone",v)} prefix={d.prefix} onPrefix={v=>up("prefix",v)} onVerified={()=>{}}/></div>
          <div style={{ marginBottom:13 }}>
            <label>Sujet</label>
            <select value={d.sujet} onChange={e=>up("sujet",e.target.value)}>
              <option value="">Choisir...</option>
              {["Question sur un service","Demande de devis","Partenariat","Autre"].map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:18 }}><label>Message *</label><textarea placeholder="Décrivez votre demande..." rows={4} value={d.message||""} onChange={e=>up("message",e.target.value)} style={{ resize:"vertical" }}/></div>
          <button type="button" onClick={async()=>{ if(!d.prenom||!d.nom||!isEmail(d.email)||!d.phone||!d.message)return; await submitBooking({service:"Message de contact",...d}); setDone(true); }} className="btn-p" style={{ width:"100%",justifyContent:"center",padding:"12px",fontSize:14,opacity:d.prenom&&d.nom&&isEmail(d.email)&&d.phone&&d.message?1:.4 }}>
            Envoyer mon message →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   DASHBOARD ADMIN
════════════════════════════════════════ */
function DashPage() {
  const { isAdmin, sd, setSd, bookings, setBookings, orders, clients, setClients, clientDocs, shareDoc, visitors, notify } = useApp();
  const [tab, setTab] = useState("overview");
  const [saving, setSaving] = useState(false);

  if (!isAdmin) return (
    <div style={{ minHeight:"70vh",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center" }}>
      <div><div style={{ fontSize:54,marginBottom:12 }}>🔒</div><h2 style={{ color:C.navy }}>Accès réservé</h2><p style={{ color:C.muted,marginTop:8 }}>Connectez-vous avec le compte administrateur.</p></div>
    </div>
  );

  async function saveSd(data) {
    setSaving(true); setSd(data); await db.set("oi:sd",data);
    await new Promise(r=>setTimeout(r,400)); setSaving(false); notify("✅ Sauvegardé !");
  }

  const revenue=orders.reduce((s,o)=>s+(o.price||0),0);
  const pending=bookings.filter(b=>b.status==="En attente").length;

  const TABS=[
    {id:"overview",  label:"📊 Vue d'ensemble"},
    {id:"content",   label:"✏️ Modifier le site"},
    {id:"bookings",  label:`📅 Demandes (${bookings.length})`,badge:pending},
    {id:"orders",    label:`🧾 Commandes (${orders.length})`},
    {id:"clients",   label:`👥 Clients (${clients.length})`},
    {id:"docs",      label:"📁 Partage docs"},
  ];

  return (
    <div style={{ minHeight:"100vh",background:C.cream }}>
      <div style={{ background:C.navy,padding:"20px 28px",display:"flex",alignItems:"center",gap:14 }}>
        <Logo size={34}/>
        <div><div style={{ fontSize:17,fontWeight:800,color:"#fff" }}>Dashboard ORD'IMPACT</div><div style={{ fontSize:11,color:C.orange,fontStyle:"italic" }}>Tableau de bord administrateur</div></div>
        <span className="tag" style={{ marginLeft:"auto",background:"rgba(244,120,32,.2)",color:"#FFB347" }}>ADMIN</span>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"230px 1fr" }}>
        <div style={{ background:"#fff",borderRight:`1px solid ${C.line}`,minHeight:"calc(100vh - 74px)",padding:"16px 10px",position:"sticky",top:0,alignSelf:"start" }}>
          {TABS.map(({id,label,badge})=>(
            <button key={id} onClick={()=>setTab(id)} className={`dash-nav${tab===id?" on":""}`}>
              {label}
              {badge>0&&<span style={{ background:C.orange,color:"#fff",fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:99,marginLeft:"auto" }}>{badge}</span>}
            </button>
          ))}
        </div>
        <div style={{ padding:"26px 28px" }}>
          <div key={tab} style={{ animation:"fadeIn .25s ease" }}>

            {tab==="overview"&&(
              <div>
                <h2 style={{ fontSize:20,fontWeight:800,color:C.navy,margin:"0 0 22px" }}>📊 Vue d'ensemble</h2>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:13,marginBottom:22 }}>
                  {[{l:"Visiteurs",v:visitors||0,c:C.blue,e:"👁️"},{l:"Commandes",v:orders.length,c:C.orange,e:"🧾"},{l:"CA Total",v:`${revenue.toFixed(0)} €`,c:C.green,e:"💶"},{l:"Clients",v:clients.length,c:C.navy,e:"👥"},{l:"Demandes",v:bookings.length,c:C.purple,e:"📅"}].map(({l,v,c,e},i)=>(
                    <div key={i} className="card" style={{ padding:"16px 14px",cursor:"default",borderLeft:`4px solid ${c}` }}>
                      <div style={{ fontSize:20,marginBottom:6 }}>{e}</div>
                      <div style={{ fontSize:24,fontWeight:900,color:c }}>{v}</div>
                      <div style={{ fontSize:11,color:C.muted,marginTop:2 }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div className="card" style={{ cursor:"default" }}>
                  <div style={{ fontWeight:700,color:C.navy,marginBottom:13,fontSize:14 }}>Activité récente</div>
                  {[...bookings.slice(-4).reverse().map(b=>({icon:"📅",label:`${b.prenom||""} ${b.nom||""}`.trim()||"Client",sub:b.service,date:b.createdAt,status:b.status})),...orders.slice(-4).reverse().map(o=>({icon:"🛍️",label:o.clientName,sub:o.productName,date:o.date,status:o.status}))].slice(0,8).map((a,i)=>(
                    <div key={i} style={{ display:"flex",gap:10,alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.line}` }}>
                      <span style={{ fontSize:18 }}>{a.icon}</span>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontWeight:700,color:C.navy,fontSize:13 }}>{a.label}</div>
                        <div style={{ fontSize:11,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{a.sub}</div>
                      </div>
                      <StatusBadge status={a.status}/>
                      <span style={{ fontSize:11,color:C.muted,flexShrink:0 }}>{a.date}</span>
                    </div>
                  ))}
                  {bookings.length===0&&orders.length===0&&<p style={{ color:C.muted,fontSize:13,textAlign:"center",padding:"16px 0" }}>Aucune activité.</p>}
                </div>
              </div>
            )}

            {tab==="content"&&(
              <DashContent sd={sd} saveSd={saveSd} saving={saving}/>
            )}

            {tab==="bookings"&&(
              <div>
                <h2 style={{ fontSize:20,fontWeight:800,color:C.navy,margin:"0 0 20px" }}>📅 Demandes ({bookings.length})</h2>
                {bookings.length===0?<div className="empty"><div style={{ fontSize:36,opacity:.35 }}>📭</div><div style={{ fontWeight:700,color:C.mid }}>Aucune demande</div></div>
                :bookings.map(b=>(
                  <div key={b.id} className="card" style={{ marginBottom:11,padding:"16px 20px",cursor:"default" }}>
                    <div style={{ display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10 }}>
                      <div>
                        <div style={{ fontWeight:800,color:C.navy,fontSize:14,marginBottom:2 }}>{b.prenom||""} {b.nom||""} {b.email&&`— ${b.email}`}</div>
                        <div style={{ fontSize:13,fontWeight:600,color:C.orange,marginBottom:3 }}>{b.service||"Diagnostic"}</div>
                        <div style={{ fontSize:12,color:C.muted }}>{b.date&&`📅 ${b.date}`}{b.time&&` à ${b.time}`} · Reçu le {b.createdAt}</div>
                        {b.serviceDesc&&<div style={{ fontSize:12,color:C.mid,marginTop:4,fontStyle:"italic" }}>"{b.serviceDesc?.slice(0,80)}"</div>}
                      </div>
                      <div style={{ display:"flex",gap:6,flexDirection:"column",alignItems:"flex-end" }}>
                        <StatusBadge status={b.status}/>
                        <div style={{ display:"flex",gap:5,marginTop:4 }}>
                          {["En attente","Confirmé","Annulé"].filter(s=>s!==b.status).map(s=>(
                            <button key={s} onClick={async()=>{const u=bookings.map(x=>x.id===b.id?{...x,status:s}:x);setBookings(u);await db.set("oi:b",u);notify(`→ ${s}`);}} style={{ padding:"4px 9px",fontSize:11,borderRadius:7,border:`1px solid ${C.line}`,background:"#fafafa",cursor:"pointer",fontFamily:"inherit",fontWeight:600 }}>→ {s}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab==="orders"&&(
              <div>
                <h2 style={{ fontSize:20,fontWeight:800,color:C.navy,margin:"0 0 20px" }}>🧾 Commandes ({orders.length})</h2>
                {orders.length===0?<div className="empty"><div style={{ fontSize:36,opacity:.35 }}>📭</div><div style={{ fontWeight:700,color:C.mid }}>Aucune commande</div></div>
                :<div className="card" style={{ padding:0,overflow:"hidden",cursor:"default" }}>
                  <table className="table">
                    <thead><tr>{["Client","Produit","Prix","Date","Type","Statut"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                    <tbody>{orders.map(o=>(
                      <tr key={o.id}>
                        <td><div style={{ fontWeight:700,color:C.navy }}>{o.clientName}</div><div style={{ fontSize:11,color:C.muted }}>{o.clientEmail}</div></td>
                        <td style={{ color:C.mid,fontSize:12 }}>{o.productName}</td>
                        <td style={{ fontWeight:700,color:C.orange }}>{o.price} €</td>
                        <td style={{ color:C.muted,fontSize:12 }}>{o.date}</td>
                        <td><span className="badge" style={{ background:o.isDrop?"#EFF6FF":"#F5F3FF",color:o.isDrop?C.blue:C.purple }}>{o.isDrop?"🚚 Physique":"📱 Digital"}</span></td>
                        <td><StatusBadge status={o.status}/></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>}
              </div>
            )}

            {tab==="clients"&&(
              <div>
                <h2 style={{ fontSize:20,fontWeight:800,color:C.navy,margin:"0 0 20px" }}>👥 Clients ({clients.length})</h2>
                <DashResetPwd clients={clients} setClients={setClients} notify={notify}/>
                {clients.length===0?<div className="empty"><div style={{ fontSize:36,opacity:.35 }}>👥</div><div style={{ fontWeight:700,color:C.mid }}>Aucun client</div></div>
                :<div className="card" style={{ padding:0,overflow:"hidden",cursor:"default",marginTop:14 }}>
                  <table className="table">
                    <thead><tr>{["Client","Email","Inscrit le","Commandes","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                    <tbody>{clients.map(c=>{
                      const co=orders.filter(o=>o.clientEmail===c.email);
                      return(<tr key={c.id}>
                        <td><div style={{ fontWeight:700,color:C.navy }}>{c.name}</div></td>
                        <td style={{ fontSize:12,color:C.mid }}>{c.email}</td>
                        <td style={{ fontSize:12,color:C.muted }}>{c.createdAt}</td>
                        <td><span style={{ fontWeight:700,color:C.orange }}>{co.length}</span> <span style={{ fontSize:11,color:C.muted }}>({co.reduce((s,o)=>s+o.price,0).toFixed(2)} €)</span></td>
                        <td></td>
                      </tr>);
                    })}</tbody>
                  </table>
                </div>}
              </div>
            )}

            {tab==="docs"&&(
              <DashDocs clients={clients} clientDocs={clientDocs} shareDoc={shareDoc} notify={notify}/>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function DashContent({ sd, saveSd, saving }) {
  const [local, setLocal] = useState({ ...sd });
  const upL = (k,v) => setLocal(s=>({...s,[k]:v}));
  const FIELDS=[
    {section:"🏠 Page Accueil",fields:[{k:"heroTitle",l:"Titre principal",ml:false},{k:"heroSub",l:"Sous-titre",ml:true}]},
    {section:"👩 À propos",fields:[{k:"aboutTitle",l:"Titre",ml:false},{k:"aboutText",l:"Texte",ml:true},{k:"aboutMission",l:"Mission",ml:true}]},
    {section:"📞 Coordonnées",fields:[{k:"phone",l:"Téléphone"},{k:"email",l:"Email"},{k:"waNumber",l:"WhatsApp (sans +)"},{k:"instagram",l:"Instagram URL"}]},
  ];
  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
        <h2 style={{ fontSize:20,fontWeight:800,color:C.navy,margin:0 }}>✏️ Modifier le site</h2>
        <button onClick={()=>saveSd(local)} className="btn-p" style={{ fontSize:13 }}>{saving?<Spinner light/>:"💾 Sauvegarder"}</button>
      </div>
      {FIELDS.map(({section,fields})=>(
        <div key={section} className="card" style={{ marginBottom:14,cursor:"default" }}>
          <div style={{ fontWeight:700,color:C.navy,marginBottom:14,fontSize:13,paddingBottom:11,borderBottom:`1px solid ${C.line}` }}>{section}</div>
          {fields.map(({k,l,ml})=>(
            <div key={k} style={{ marginBottom:14 }}><label>{l}</label>{ml?<textarea value={local[k]||""} onChange={e=>upL(k,e.target.value)} rows={3} style={{ resize:"vertical" }}/>:<input value={local[k]||""} onChange={e=>upL(k,e.target.value)}/>}</div>
          ))}
        </div>
      ))}
      <button onClick={()=>saveSd(local)} className="btn-p" style={{ width:"100%",justifyContent:"center",padding:"12px",fontSize:14 }}>{saving?<Spinner light/>:"💾 Sauvegarder tout"}</button>
    </div>
  );
}

function DashResetPwd({ clients, setClients, notify }) {
  const [rE,setRE]=useState(""); const [rP,setRP]=useState("");
  async function reset() {
    if(!rE||!rP){notify("Remplissez les deux champs.","err");return;}
    const i=clients.findIndex(c=>c.email===rE);if(i===-1){notify("Introuvable.","err");return;}
    const u=[...clients];u[i]={...u[i],password:rP};setClients(u);await db.set("oi:c",u);
    notify("✅ MDP réinitialisé !"); setRE(""); setRP("");
  }
  return (
    <div className="card" style={{ padding:"16px 20px",borderLeft:`4px solid ${C.orange}`,cursor:"default" }}>
      <div style={{ fontWeight:700,color:C.navy,marginBottom:10,fontSize:13 }}>🔑 Réinitialiser un mot de passe</div>
      <div style={{ display:"flex",gap:9,flexWrap:"wrap" }}>
        <input placeholder="Email du client" value={rE} onChange={e=>setRE(e.target.value)} style={{ flex:"1 1 180px" }}/>
        <input type="password" placeholder="Nouveau mot de passe" value={rP} onChange={e=>setRP(e.target.value)} style={{ flex:"1 1 180px" }}/>
        <button onClick={reset} className="btn-p" style={{ padding:"10px 18px",fontSize:13 }}>OK</button>
      </div>
    </div>
  );
}

function DashDocs({ clients, clientDocs, shareDoc, notify }) {
  const [sel,setSel]=useState(""); const [name,setName]=useState(""); const [url,setUrl]=useState(""); const [note,setNote]=useState(""); const [sending,setSending]=useState(false);
  async function share(){
    if(!sel||!name){notify("Sélectionnez un client et nommez le document.","err");return;}
    setSending(true); await new Promise(r=>setTimeout(r,400));
    await shareDoc(sel,{name,url,note}); setName("");setUrl("");setNote(""); setSending(false);
  }
  return (
    <div>
      <h2 style={{ fontSize:20,fontWeight:800,color:C.navy,margin:"0 0 20px" }}>📁 Partage de documents</h2>
      <div className="card" style={{ marginBottom:16,cursor:"default" }}>
        <div style={{ fontWeight:700,color:C.navy,marginBottom:14,fontSize:14 }}>📤 Envoyer un document à un client</div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
          <div><label>Client *</label><select value={sel} onChange={e=>setSel(e.target.value)}><option value="">Choisir...</option>{clients.map(c=><option key={c.email} value={c.email}>{c.name}</option>)}</select></div>
          <div><label>Nom du document *</label><input placeholder="Ex: Devis archivage 2026" value={name} onChange={e=>setName(e.target.value)}/></div>
        </div>
        <div style={{ marginBottom:12 }}><label>Lien (Google Drive, Dropbox...)</label><input placeholder="https://drive.google.com/..." value={url} onChange={e=>setUrl(e.target.value)}/></div>
        <div style={{ marginBottom:16 }}><label>Note (facultatif)</label><textarea placeholder="Ex: Voici votre devis..." rows={2} value={note} onChange={e=>setNote(e.target.value)} style={{ resize:"vertical" }}/></div>
        <button onClick={share} className="btn-p" style={{ fontSize:13 }}>{sending?<Spinner light/>:"📤 Partager le document"}</button>
      </div>
      {Object.keys(clientDocs).length>0&&(
        <div className="card" style={{ cursor:"default" }}>
          <div style={{ fontWeight:700,color:C.navy,marginBottom:14,fontSize:14 }}>📚 Historique</div>
          {Object.entries(clientDocs).map(([email,docs])=>{
            const cli=clients.find(c=>c.email===email);
            return docs.length?(
              <div key={email} style={{ marginBottom:16 }}>
                <div style={{ fontWeight:700,color:C.navy,fontSize:13,marginBottom:8 }}>👤 {cli?.name||email} ({docs.length} doc{docs.length>1?"s":""})</div>
                {docs.map((doc,i)=>(
                  <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:C.cream,borderRadius:9,marginBottom:5 }}>
                    <div><div style={{ fontWeight:600,fontSize:13,color:C.dark }}>📄 {doc.name}</div><div style={{ fontSize:11,color:C.muted }}>Partagé le {doc.date}</div></div>
                    {doc.url&&<a href={doc.url} target="_blank" rel="noreferrer" style={{ background:C.blue,color:"#fff",padding:"4px 11px",borderRadius:7,fontSize:12,fontWeight:700,textDecoration:"none" }}>↗ Voir</a>}
                  </div>
                ))}
              </div>
            ):null;
          })}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   FOOTER
════════════════════════════════════════ */
function SiteFooter() {
  const { nav, sd } = useApp();
  return (
    <footer style={{ background:C.dark,padding:"50px 28px 22px" }}>
      <div style={{ maxWidth:1100,margin:"0 auto" }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:30,marginBottom:36 }}>
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:11 }}><Logo size={34}/></div>
            <div style={{ fontSize:10,color:C.orange,fontStyle:"italic",fontWeight:600,marginBottom:10 }}>Mets de l'ordre. Multiplie ton impact.</div>
            <p style={{ color:"rgba(255,255,255,.28)",fontSize:12,lineHeight:1.8,margin:"0 0 11px" }}>Service administratif & accompagnement — Guyane française.</p>
            <div style={{ fontSize:13,fontWeight:600,color:C.orange }}>📞 {sd.phone}</div>
          </div>
          <div>
            <div style={{ color:"rgba(255,255,255,.22)",fontSize:9,fontWeight:700,letterSpacing:1.6,marginBottom:11,textTransform:"uppercase" }}>Navigation</div>
            {[["home","🏠 Accueil"],["about","👩 Qui suis-je"],["services","📋 Mes tarifs"],["booking","✨ Diagnostic"],["shop","🛍️ Boutique"],["client","🔒 Espace client"],["contact","📞 Contact"]].map(([p,l])=>(
              <button key={p} type="button" onClick={()=>nav(p)} style={{ display:"block",background:"none",border:"none",color:"rgba(255,255,255,.4)",fontSize:12.5,cursor:"pointer",marginBottom:7,fontFamily:"inherit",padding:0,textAlign:"left" }}>{l}</button>
            ))}
          </div>
          <div>
            <div style={{ color:"rgba(255,255,255,.22)",fontSize:9,fontWeight:700,letterSpacing:1.6,marginBottom:11,textTransform:"uppercase" }}>Contact</div>
            <div style={{ color:"rgba(255,255,255,.44)",fontSize:13,lineHeight:2.2 }}>
              <div>📧 {sd.email}</div>
              <div>📍 Cayenne · Matoury · Rémire</div>
              <div>🕐 8h–12h / 9h–17h</div>
              <div style={{ marginTop:4,fontSize:10,color:"rgba(255,255,255,.18)" }}>SIRET 103 314 258 00015</div>
            </div>
            <a href={sd.instagram} target="_blank" rel="noreferrer" style={{ display:"inline-flex",alignItems:"center",gap:7,marginTop:11,background:"linear-gradient(135deg,#f09433,#dc2743)",borderRadius:9,padding:"8px 14px",textDecoration:"none",color:"#fff",fontSize:12.5,fontWeight:700 }}>📸 Instagram</a>
          </div>
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,.06)",paddingTop:16,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:7,fontSize:11.5,color:"rgba(255,255,255,.16)" }}>
          <span>© {new Date().getFullYear()} ORD'IMPACT · Tous droits réservés</span>
          <span>Micro-entreprise · TVA non applicable Art. 293B CGI</span>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════
   TOUS LES FORMULAIRES DE SERVICE
════════════════════════════════════════ */
function FGeneric({ icon, title, onClose }) {
  const { submitBooking, sd } = useApp();
  const [d, setD] = useState({ prenom:"",nom:"",email:"",phone:"",prefix:"+594",message:"" });
  const [done, setDone] = useState(false);
  if (done) return <Confirmed prenom={d.prenom} nom={d.nom} service={title} ig={sd.instagram} onClose={onClose}/>;
  return (
    <FB icon={icon} title={title} subtitle="Réponse sous 24h · Devis personnalisé" bg={`${C.orange}12`}>
      <div style={{ marginBottom:14 }}><label>Décrivez votre besoin</label><textarea placeholder="Expliquez votre situation en quelques mots..." rows={3} value={d.message} onChange={e=>setD(x=>({...x,message:e.target.value}))} style={{ resize:"vertical" }}/></div>
      <div style={{ marginBottom:18 }}><CB d={d} setD={setD}/></div>
      <button type="button" onClick={async()=>{ if(!d.prenom||!d.nom||!isEmail(d.email)||!d.phone)return; await submitBooking({service:title,...d}); setDone(true); }} className="btn-p" style={{ width:"100%",justifyContent:"center",padding:"12px",opacity:d.prenom&&d.nom&&isEmail(d.email)&&d.phone?1:.4 }}>Envoyer ma demande →</button>
    </FB>
  );
}

function FAutrePart({ onClose }) {
  const { submitBooking, sd } = useApp();
  const [d, setD] = useState({ prenom:"",nom:"",email:"",phone:"",prefix:"+594",demande:"" });
  const [done, setDone] = useState(false);
  if (done) return <Confirmed prenom={d.prenom} nom={d.nom} service="Autre démarche" ig={sd.instagram} onClose={onClose}/>;
  return (
    <FB icon="❓" title="Autre démarche particulier" subtitle="Décrivez votre besoin — réponse sous 24h" bg="#EFF6FF">
      <div style={{ marginBottom:14 }}><label>Quelle démarche ? *</label><textarea placeholder="Ex: Je veux récupérer mon acte de naissance, faire une procuration..." rows={4} value={d.demande} onChange={e=>setD(x=>({...x,demande:e.target.value}))} style={{ resize:"vertical" }}/></div>
      <div style={{ marginBottom:18 }}><CB d={d} setD={setD}/></div>
      <button type="button" onClick={async()=>{ if(!d.prenom||!d.nom||!isEmail(d.email)||!d.phone||!d.demande)return; await submitBooking({service:"Autre démarche: "+d.demande.slice(0,50),...d}); setDone(true); }} className="btn-p" style={{ width:"100%",justifyContent:"center",padding:"12px",opacity:d.prenom&&d.nom&&isEmail(d.email)&&d.phone&&d.demande?1:.4 }}>Envoyer →</button>
    </FB>
  );
}

function FAutroPro({ onClose }) {
  const { submitBooking, sd } = useApp();
  const [d, setD] = useState({ prenom:"",nom:"",email:"",phone:"",prefix:"+594",demande:"",budget:"" });
  const [done, setDone] = useState(false);
  if (done) return <Confirmed prenom={d.prenom} nom={d.nom} service="Autre service professionnel" ig={sd.instagram} onClose={onClose}/>;
  return (
    <FB icon="💼" title="Autre service professionnel" subtitle="Décrivez votre besoin — devis sous 24h" bg={`${C.orange}10`}>
      <div style={{ marginBottom:14 }}><label>Décrivez votre besoin *</label><textarea placeholder="Ex: Je souhaite de l'aide pour ma facturation, mes emails clients..." rows={4} value={d.demande} onChange={e=>setD(x=>({...x,demande:e.target.value}))} style={{ resize:"vertical" }}/></div>
      <div style={{ marginBottom:14 }}><label>Budget approximatif</label><select value={d.budget||""} onChange={e=>setD(x=>({...x,budget:e.target.value}))}><option value="">À définir</option>{["Moins de 100 €/mois","100–300 €/mois","300–600 €/mois","Plus de 600 €/mois","Ponctuel"].map(o=><option key={o}>{o}</option>)}</select></div>
      <div style={{ marginBottom:18 }}><CB d={d} setD={setD} showSociete/></div>
      <button type="button" onClick={async()=>{ if(!d.prenom||!d.nom||!isEmail(d.email)||!d.phone||!d.demande)return; await submitBooking({service:"Autre service pro: "+d.demande.slice(0,50),...d}); setDone(true); }} className="btn-p" style={{ width:"100%",justifyContent:"center",padding:"12px",opacity:d.prenom&&d.nom&&isEmail(d.email)&&d.phone&&d.demande?1:.4 }}>Envoyer →</button>
    </FB>
  );
}

function FArchivage({ onClose }) {
  const { submitBooking, sd } = useApp();
  const [d, setD] = useState({ prenom:"",nom:"",email:"",phone:"",prefix:"+594",adresse:"",superficie:"",dateVisite:"" });
  const [step, setStep] = useState("info");
  const [done, setDone] = useState(false);
  if (done) return <Confirmed prenom={d.prenom} nom={d.nom} service="Archivage — Visite préalable 25 €" ig={sd.instagram} onClose={onClose}/>;
  if (step==="pay") return (
    <FB icon="💳" title="Paiement visite — 25 €" subtitle="Déduit intégralement de votre devis final" bg="#f0fdf4">
      <div style={{ background:"#fff",borderRadius:12,padding:16,marginBottom:14,border:`1px solid ${C.line}` }}>
        {[["Service","Visite préalable archivage"],["Adresse",d.adresse],["Date",d.dateVisite],["Client",`${d.prenom} ${d.nom}`],["Total","25 €"]].map(([k,v])=>(
          <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.line}`,fontSize:13 }}><span style={{ color:C.muted }}>{k}</span><span style={{ fontWeight:700,color:C.navy }}>{v}</span></div>
        ))}
      </div>
      <div style={{ display:"flex",gap:8,marginBottom:12 }}><span className="stripe">🔒 Stripe</span></div>
      <div style={{ background:"#f0fdf4",borderRadius:9,padding:"10px 14px",marginBottom:13,fontSize:12.5,color:C.green,fontWeight:600,border:"1px solid #bbf7d0" }}>✅ Ces 25 € sont déduits de votre devis final.</div>
      <button className="btn-pay" onClick={async()=>{ await submitBooking({service:"Archivage — Visite 25 €",...d}); setDone(true); }}>💳 Payer 25 € et confirmer</button>
      <button type="button" onClick={()=>setStep("info")} style={{ background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",marginTop:9,display:"block",width:"100%",textAlign:"center",fontFamily:"inherit" }}>← Modifier</button>
    </FB>
  );
  return (
    <FB icon="🗂️" title="Archivage & Organisation" subtitle="Visite obligatoire pour évaluer l'étendue de la mission — 25 € déduits du devis" bg="#f0fff4">
      <div style={{ background:"#fff8f0",border:"1px solid #FED7AA",borderRadius:11,padding:12,marginBottom:14,fontSize:13,color:C.mid }}>
        📍 <strong style={{ color:C.navy }}>Visite obligatoire.</strong> Je dois me déplacer pour évaluer le volume d'archives avant de pouvoir établir un devis précis.
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:11 }}>
        <div><label>Superficie approx.</label><select value={d.superficie||""} onChange={e=>setD(x=>({...x,superficie:e.target.value}))}><option value="">Choisir</option>{["< 5 m²","5–15 m²","15–30 m²","> 30 m²"].map(o=><option key={o}>{o}</option>)}</select></div>
        <div><label>Date souhaitée *</label><input type="date" value={d.dateVisite||""} onChange={e=>setD(x=>({...x,dateVisite:e.target.value}))} min={new Date().toISOString().split("T")[0]}/></div>
      </div>
      <div style={{ marginBottom:11 }}><label>Adresse complète *</label><input placeholder="12 Rue des Palmistes, 97300 Cayenne" value={d.adresse||""} onChange={e=>setD(x=>({...x,adresse:e.target.value}))}/></div>
      <div style={{ marginBottom:18 }}><CB d={d} setD={setD} showSociete/></div>
      <button type="button" onClick={()=>d.adresse&&d.dateVisite&&d.prenom&&d.nom&&isEmail(d.email)&&d.phone&&setStep("pay")} className="btn-p" style={{ width:"100%",justifyContent:"center",padding:"12px",opacity:d.adresse&&d.dateVisite&&d.prenom&&d.nom?1:.4 }}>Continuer vers le paiement — 25 € →</button>
    </FB>
  );
}

function FDpae({ onClose }) {
  const { submitBooking, sd } = useApp();
  const [d, setD] = useState({ prenom:"",nom:"",email:"",phone:"",prefix:"+594",siret:"",nomEmploye:"",dateEmbauche:"",typeContrat:"",dateFin:"",nbJours:"",nb:1 });
  const [done, setDone] = useState(false);
  const valid=d.siret?.length===14&&d.nomEmploye&&d.dateEmbauche&&d.typeContrat&&d.prenom&&d.nom&&isEmail(d.email)&&d.phone&&(d.typeContrat!=="CDD"||d.dateFin)&&(d.typeContrat!=="CTT"||d.nbJours);
  if (done) return <Confirmed prenom={d.prenom} nom={d.nom} service={`DPAE × ${d.nb}`} ig={sd.instagram} onClose={onClose}/>;
  return (
    <FB icon="📋" title="DPAE — Déclaration Préalable à l'Embauche" subtitle="20 € / déclaration · CDI / CDD / CTT" bg="#fefce8">
      <div style={{ display:"grid",gridTemplateColumns:"1fr auto",gap:12,marginBottom:12 }}>
        <div>
          <label>SIRET employeur * <span style={{ fontWeight:400,color:C.muted,fontSize:11 }}>(14 chiffres)</span></label>
          <div style={{ position:"relative" }}>
            <input placeholder="12345678901234" value={d.siret||""} onChange={e=>setD(x=>({...x,siret:e.target.value.replace(/\D/g,"").slice(0,14)}))} maxLength={14} className={d.siret?(d.siret.length===14?"ok":"err"):""} style={{ paddingRight:38 }}/>
            {d.siret&&<span style={{ position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",fontSize:14,color:d.siret.length===14?C.green:C.red }}>{d.siret.length===14?"✓":"✕"}</span>}
          </div>
        </div>
        <div>
          <label>Nb. DPAE</label>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:8 }}>
            <button type="button" onClick={()=>setD(x=>({...x,nb:Math.max(1,x.nb-1)}))} style={{ width:32,height:42,borderRadius:8,border:`1.5px solid ${C.line}`,background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:16 }}>−</button>
            <span style={{ fontSize:18,fontWeight:800,color:C.navy,minWidth:24,textAlign:"center" }}>{d.nb}</span>
            <button type="button" onClick={()=>setD(x=>({...x,nb:x.nb+1}))} style={{ width:32,height:42,borderRadius:8,border:`1.5px solid ${C.orange}`,background:C.warm,cursor:"pointer",fontFamily:"inherit",fontSize:16,color:C.orange }}>+</button>
          </div>
          <div style={{ fontSize:11,color:C.orange,fontWeight:700,marginTop:2 }}>{d.nb*20} €</div>
        </div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:11 }}>
        <div><label>Nom & Prénom employé *</label><input placeholder="Jean Dupont" value={d.nomEmploye||""} onChange={e=>setD(x=>({...x,nomEmploye:e.target.value}))}/></div>
        <div><label>Date d'embauche *</label><input type="date" value={d.dateEmbauche||""} onChange={e=>setD(x=>({...x,dateEmbauche:e.target.value}))}/></div>
      </div>
      <div style={{ marginBottom:11 }}>
        <label>Type de contrat *</label>
        <div style={{ display:"flex",gap:10 }}>{["CDI","CDD","CTT"].map(t=><button key={t} type="button" onClick={()=>setD(x=>({...x,typeContrat:t}))} className={`chip${d.typeContrat===t?" on":""}`} style={{ flex:1,justifyContent:"center",padding:"11px",fontSize:14,fontWeight:700 }}>{t}</button>)}</div>
      </div>
      {d.typeContrat==="CDD"&&<div style={{ marginBottom:11,padding:11,background:"#EFF6FF",borderRadius:10,border:"1px solid #BFDBFE" }}><label>Date de fin * (obligatoire CDD)</label><input type="date" value={d.dateFin||""} onChange={e=>setD(x=>({...x,dateFin:e.target.value}))} min={d.dateEmbauche}/></div>}
      {d.typeContrat==="CTT"&&<div style={{ marginBottom:11,padding:11,background:"#fefce8",borderRadius:10,border:"1px solid #fde68a" }}><label>Nombre de jours * (CTT)</label><input type="number" placeholder="30" min="1" value={d.nbJours||""} onChange={e=>setD(x=>({...x,nbJours:e.target.value}))}/></div>}
      <div style={{ marginBottom:18 }}><CB d={d} setD={setD} showSociete/></div>
      <button type="button" onClick={async()=>{ if(!valid)return; await submitBooking({service:`DPAE × ${d.nb} — ${d.nb*20} €`,...d}); setDone(true); }} className="btn-p" style={{ width:"100%",justifyContent:"center",padding:"12px",opacity:valid?1:.4 }}>Soumettre {d.nb} DPAE — {d.nb*20} € →</button>
    </FB>
  );
}

function FShopPay({ product, onClose }) {
  const { purchase, notify } = useApp();
  const [d, setD] = useState({ prenom:"",nom:"",email:"",phone:"",prefix:"+594" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);
  if (!product) return null;
  async function pay() {
    if(!d.prenom||!d.nom||!isEmail(d.email)||!d.phone)return;
    setLoading(true);
    const r=await purchase(product,d);
    setDone(r); setLoading(false);
    notify(`✅ "${product.name}" — accès envoyé à ${d.email} !`);
  }
  if (done) return (
    <div style={{ textAlign:"center",padding:"8px 0" }}>
      <div style={{ width:76,height:76,borderRadius:"50%",background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 16px",animation:"popIn .5s" }}>✅</div>
      <h3 style={{ fontSize:18,fontWeight:800,color:C.green,margin:"0 0 3px" }}>Merci pour votre confiance,</h3>
      <h2 style={{ fontSize:21,fontWeight:900,color:C.navy,margin:"0 0 12px",fontFamily:"'Fraunces',serif" }}>{d.prenom} {d.nom}</h2>
      <p style={{ color:C.mid,fontSize:13,margin:"0 0 8px" }}>Accès envoyé à <strong>{d.email}</strong></p>
      {done.isNew&&<div style={{ background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:11,padding:13,marginBottom:14,fontSize:12.5 }}>
        <div style={{ fontWeight:700,color:C.navy,marginBottom:3 }}>🎉 Compte créé automatiquement !</div>
        <div>Email : <strong>{d.email}</strong></div>
        <div>Mot de passe temporaire : <strong style={{ color:C.orange }}>{done.pwd}</strong></div>
      </div>}
      <button type="button" onClick={onClose} className="btn-p" style={{ width:"100%",justifyContent:"center" }}>Fermer</button>
    </div>
  );
  return (
    <FB icon={product.emoji} title={product.name} subtitle={`${product.price} € · Accès immédiat · Stripe sécurisé`} bg={C.warm}>
      <div style={{ background:"#f0fdf4",borderRadius:10,padding:"11px 14px",marginBottom:14,fontSize:13,color:C.green,fontWeight:600,border:"1px solid #bbf7d0" }}>🔒 Paiement → compte créé → lien + identifiants envoyés par email.</div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:11 }}>
        <SF label="Prénom *" k="prenom" d={d} setD={setD} ph="Marie" required/>
        <SF label="Nom *" k="nom" d={d} setD={setD} ph="Dupont" required/>
      </div>
      <div style={{ marginBottom:11 }}><SF label="Email * (réception du lien)" k="email" d={d} setD={setD} type="email" ph="votre@email.fr" validator={isEmail} required/></div>
      <div style={{ marginBottom:14 }}><PhoneField value={d.phone} onChange={v=>setD(x=>({...x,phone:v}))} prefix={d.prefix} onPrefix={v=>setD(x=>({...x,prefix:v}))} onVerified={()=>{}}/></div>
      <div style={{ background:C.cream,borderRadius:11,padding:14,marginBottom:13,border:`1px solid ${C.line}` }}>
        <div style={{ display:"flex",justifyContent:"space-between",fontSize:15,fontWeight:800 }}><span>Total</span><span style={{ color:C.orange }}>{product.price} €</span></div>
      </div>
      <div style={{ display:"flex",gap:8,marginBottom:13 }}><span className="stripe">🔒 Stripe sécurisé</span><span className="tag" style={{ background:"#f0fdf4",color:C.green }}>⚡ Accès instantané</span></div>
      <button type="button" onClick={pay} className="btn-pay" style={{ opacity:d.prenom&&d.nom&&isEmail(d.email)&&d.phone?1:.45 }}>
        {loading?<Spinner light/>:`💳 Payer ${product.price} € et accéder au produit`}
      </button>
    </FB>
  );
}

function FDropOrder({ product, onClose }) {
  const { submitBooking } = useApp();
  const [d, setD] = useState({ prenom:"",nom:"",email:"",phone:"",prefix:"+594",adresse:"",codePostal:"",ville:"" });
  const [done, setDone] = useState(false);
  if (!product) return null;
  if (done) return <Confirmed prenom={d.prenom} nom={d.nom} service={product.name} ig="" onClose={onClose}/>;
  return (
    <FB icon={product.emoji} title={product.name} subtitle={`${product.price} € · Livraison à domicile · Dropshipping`} bg="#EFF6FF">
      <div style={{ background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:10,padding:12,marginBottom:13,fontSize:13,color:C.mid }}>🚚 Commande transmise au fournisseur, livrée directement chez vous.</div>
      <div style={{ marginBottom:11 }}><label>Adresse de livraison *</label><input placeholder="12 Rue des Palmistes" value={d.adresse||""} onChange={e=>setD(x=>({...x,adresse:e.target.value}))}/></div>
      <div style={{ display:"grid",gridTemplateColumns:"110px 1fr",gap:11,marginBottom:13 }}>
        <div><label>Code postal *</label><input placeholder="97300" value={d.codePostal||""} onChange={e=>setD(x=>({...x,codePostal:e.target.value}))}/></div>
        <div><label>Ville *</label><input placeholder="Cayenne" value={d.ville||""} onChange={e=>setD(x=>({...x,ville:e.target.value}))}/></div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:11 }}>
        <SF label="Prénom *" k="prenom" d={d} setD={setD} ph="Marie" required/>
        <SF label="Nom *" k="nom" d={d} setD={setD} ph="Dupont" required/>
      </div>
      <div style={{ marginBottom:11 }}><SF label="Email *" k="email" d={d} setD={setD} type="email" ph="votre@email.fr" validator={isEmail} required/></div>
      <div style={{ marginBottom:14 }}><PhoneField value={d.phone} onChange={v=>setD(x=>({...x,phone:v}))} prefix={d.prefix} onPrefix={v=>setD(x=>({...x,prefix:v}))} onVerified={()=>{}}/></div>
      <div style={{ background:C.cream,borderRadius:11,padding:13,marginBottom:13,border:`1px solid ${C.line}` }}>
        <div style={{ display:"flex",justifyContent:"space-between",fontSize:14,fontWeight:800 }}><span>Total</span><span style={{ color:C.orange }}>{product.price} €</span></div>
        <div style={{ fontSize:11,color:C.muted,marginTop:3 }}>+ frais de livraison selon zone</div>
      </div>
      <button type="button" onClick={async()=>{ if(!d.prenom||!d.nom||!isEmail(d.email)||!d.phone||!d.adresse||!d.ville)return; await submitBooking({service:"Commande: "+product.name,...d}); setDone(true); }} className="btn-pay" style={{ opacity:d.prenom&&d.nom&&isEmail(d.email)&&d.phone&&d.adresse&&d.ville?1:.45 }}>
        🛒 Commander — {product.price} €
      </button>
    </FB>
  );
}
