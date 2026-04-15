import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────
   STORAGE
───────────────────────────────────────────────────────── */
const db = {
  get: async k => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } },
  set: async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch {} },
};

/* ─────────────────────────────────────────────────────────
   TOKENS
───────────────────────────────────────────────────────── */
const T = {
  navy:"#001E50", navy2:"#0A1B45", orange:"#F47820", orange2:"#F05A1E",
  blue:"#1E78B4", cyan:"#1E96D2", pale:"#B4D2F0",
  cream:"#F7F9FC", warm:"#FFF7ED", line:"#E4EBF5",
  mid:"#64748B", muted:"#94A3B8",
  green:"#16A34A", red:"#DC2626", amber:"#D97706", purple:"#7C3AED",
};

/* ─────────────────────────────────────────────────────────
   SEED DATA — partagé avec le dashboard
───────────────────────────────────────────────────────── */
const DEMO_CLIENTS = [
  { id:1, name:"Sophie Lemaire", email:"sophie@email.fr", password:"demo123", phone:"0694001122", createdAt:"10/04/2026" },
  { id:2, name:"Marc Leroy",     email:"marc@email.fr",   password:"demo123", phone:"0694223344", createdAt:"11/04/2026" },
];
const DEMO_ORDERS = [
  { id:1, clientEmail:"sophie@email.fr", productName:"Kit Organisation Documents", price:15, file:"kit-organisation.pdf", isDrop:false, date:"12/04/2026", status:"confirmé" },
  { id:2, clientEmail:"sophie@email.fr", productName:"Guide CAF / APL",            price:12, file:"guide-caf.pdf",        isDrop:false, date:"14/04/2026", status:"confirmé" },
  { id:3, clientEmail:"marc@email.fr",   productName:"Classeur à anneaux A4",      price:7.99, isDrop:true,               date:"13/04/2026", status:"en livraison" },
];
const DEMO_DOCS = {
  "sophie@email.fr": [
    { id:1, name:"Devis Archivage — Avril 2026",  url:"#", note:"Voici votre devis, valable 30 jours.", date:"13/04/2026" },
    { id:2, name:"Contrat de prestation",          url:"#", note:"Merci de le signer et de me le retourner.", date:"14/04/2026" },
  ],
  "marc@email.fr": [
    { id:1, name:"Facture Commande #002", url:"#", note:"Voici votre facture.", date:"14/04/2026" },
  ],
};
const DEMO_BOOKINGS = [
  { id:1, clientEmail:"sophie@email.fr", service:"Carte grise minute", date:"2026-04-18", time:"09:00", status:"Confirmé",   createdAt:"13/04/2026" },
  { id:2, clientEmail:"sophie@email.fr", service:"Assistance administrative", date:"2026-04-25", time:"10:00", status:"En attente", createdAt:"14/04/2026" },
];

/* ─────────────────────────────────────────────────────────
   VALIDATORS
───────────────────────────────────────────────────────── */
const isEmail = v => /\S+@\S+\.\S+/.test(v||"");
const isName  = v => (v||"").trim().length >= 2;
const isPhone = v => (v||"").replace(/\D/g,"").length >= 6;
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

/* ─────────────────────────────────────────────────────────
   CSS
───────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{min-height:100%;font-family:'Sora',system-ui,sans-serif;background:#F0F4FA;color:#0A1B45}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#C4D0E8;border-radius:99px}
::-webkit-scrollbar-thumb:hover{background:#F47820}

@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes pulse3{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes slideR{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}
@keyframes toast{from{opacity:0;transform:translateY(-10px) scale(.96)}to{opacity:1;transform:none}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(244,120,32,.4)}70%{box-shadow:0 0 0 10px rgba(244,120,32,0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}

.afu{animation:fadeUp .4s cubic-bezier(.16,1,.3,1) both}
.afi{animation:fadeIn .3s ease both}
.asr{animation:slideR .35s cubic-bezier(.16,1,.3,1) both}
.del1{animation-delay:.06s}.del2{animation-delay:.12s}.del3{animation-delay:.18s}.del4{animation-delay:.24s}.del5{animation-delay:.3s}.del6{animation-delay:.36s}

.card{background:#fff;border-radius:18px;border:1px solid #E4EBF5;padding:22px 24px}
.card-flat{background:#F7F9FC;border-radius:14px;padding:16px 18px;border:1px solid #E4EBF5}
.card-hover{transition:transform .22s,box-shadow .22s,border-color .22s;cursor:pointer}
.card-hover:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,30,80,.1);border-color:#C4D0E8}
.card-orange{border-top:3px solid #F47820}
.card-blue{border-top:3px solid #1E78B4}
.card-green{border-top:3px solid #16A34A}

.btn{cursor:pointer;font-family:inherit;font-weight:700;border:none;padding:10px 20px;border-radius:11px;font-size:13.5px;display:inline-flex;align-items:center;gap:8px;transition:all .2s;white-space:nowrap}
.btn-p{background:#F47820;color:#fff}
.btn-p:hover{background:#E06810;transform:translateY(-1px);box-shadow:0 6px 20px rgba(244,120,32,.35)}
.btn-n{background:#001E50;color:#fff}
.btn-n:hover{background:#0A1B45;transform:translateY(-1px)}
.btn-g{background:#fff;color:#64748B;border:1.5px solid #E4EBF5}
.btn-g:hover{background:#F7F9FC;border-color:#C4D0E8;color:#001E50}
.btn-sm{padding:7px 14px;font-size:12px;border-radius:9px}
.btn-full{width:100%;justify-content:center;padding:13px}

.field-wrap{position:relative}
.field-ico{position:absolute;right:13px;top:50%;transform:translateY(-50%);font-size:15px;pointer-events:none}
input[type=text],input[type=email],input[type=password],input[type=tel],select,textarea{
  font-family:'Sora',system-ui,sans-serif;font-size:13.5px;padding:12px 15px;
  border-radius:11px;border:1.5px solid #E4EBF5;background:#F7F9FC;color:#0A1B45;
  outline:none;width:100%;transition:all .2s
}
input:focus,select:focus,textarea:focus{border-color:#1E78B4;background:#fff;box-shadow:0 0 0 3px rgba(30,120,180,.1)}
input.ok{border-color:#16A34A!important;background:#F0FDF4!important}
input.err{border-color:#DC2626!important;background:#FEF2F2!important}
label{font-size:12px;font-weight:700;color:#001E50;display:block;margin-bottom:6px;letter-spacing:.15px}

.nav-tab{cursor:pointer;display:flex;align-items:center;gap:9px;padding:10px 14px;border-radius:11px;font-size:13.5px;font-weight:600;color:#64748B;border:none;background:none;font-family:inherit;transition:all .18s;text-align:left;width:100%}
.nav-tab:hover{background:#F0F4FA;color:#001E50}
.nav-tab.on{background:#FFF7ED;color:#F47820;font-weight:700}
.nav-tab .count{margin-left:auto;background:#F47820;color:#fff;font-size:10px;font-weight:700;padding:1px 7px;border-radius:99px}

.badge{display:inline-flex;align-items:center;font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px;gap:4px}
.bg-green{background:#F0FDF4;color:#16A34A}
.bg-orange{background:#FFF7ED;color:#EA580C}
.bg-blue{background:#EFF6FF;color:#1D4ED8}
.bg-red{background:#FEF2F2;color:#DC2626}
.bg-purple{background:#F5F3FF;color:#7C3AED}
.bg-gray{background:#F8FAFC;color:#64748B;border:1px solid #E4EBF5}

.toast-wrap{position:fixed;top:16px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px}
.toast{padding:12px 18px;border-radius:12px;font-weight:700;font-size:13px;display:flex;align-items:center;gap:9px;box-shadow:0 8px 28px rgba(0,0,0,.16);animation:toast .3s ease;min-width:240px}
.toast-ok{background:#001E50;color:#fff}
.toast-err{background:#DC2626;color:#fff}

.stat{background:#fff;border-radius:16px;border:1px solid #E4EBF5;padding:18px 20px;transition:transform .22s}
.stat:hover{transform:translateY(-2px)}

.doc-row{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:#F7F9FC;border-radius:12px;border:1px solid #E4EBF5;transition:all .2s}
.doc-row:hover{background:#fff;border-color:#C4D0E8;box-shadow:0 4px 16px rgba(0,30,80,.07)}

.prod-card{background:#fff;border-radius:16px;border:1.5px solid #E4EBF5;overflow:hidden;transition:all .22s}
.prod-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,30,80,.1);border-color:#F47820}

.timeline-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;margin-top:4px}
.timeline-line{width:1px;background:#E4EBF5;flex:1;min-height:16px;margin:4px 0 4px 4.5px}

.sms-box{background:#F0F4FA;border-radius:12px;padding:16px;border:1.5px solid #E4EBF5;margin-top:10px}
.code-input{font-size:22px!important;font-weight:800!important;letter-spacing:10px!important;text-align:center!important;padding:12px 8px!important}

.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 20px;gap:10px;text-align:center}
.empty-ico{font-size:44px;opacity:.35;margin-bottom:4px;animation:float 3s ease-in-out infinite}

.pill{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:99px;font-size:11px;font-weight:700;border:1.5px solid}

.progress-bar{height:6px;border-radius:99px;background:#E4EBF5;overflow:hidden}
.progress-fill{height:100%;border-radius:99px;transition:width .8s cubic-bezier(.16,1,.3,1)}
`;

/* ─────────────────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────────────────── */
function Logo({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" fill="#001E50"/>
      <path d="M40 12 A28 28 0 0 1 68 40" stroke="#F47820" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M40 12 A28 28 0 1 0 68 40" stroke="#1E96D2" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <rect x="37" y="17" width="6" height="46" rx="3" fill="white"/>
      <path d="M57 22 L68 11" stroke="#F47820" strokeWidth="4.5" strokeLinecap="round"/>
      <circle cx="69" cy="10" r="4" fill="#F47820"/>
    </svg>
  );
}

function Spinner({ size=18, light=false }) {
  return <div style={{ width:size,height:size,border:`2.5px solid ${light?"rgba(255,255,255,.25)":"rgba(0,30,80,.15)"}`,borderTopColor:light?"#fff":"#F47820",borderRadius:"50%",animation:"spin .7s linear infinite",flexShrink:0 }}/>;
}

function Toast({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type==="ok"?"✓":"✕"} {t.msg}
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const MAP = { "Confirmé":"bg-green","confirmé":"bg-green","En attente":"bg-orange","en livraison":"bg-blue","Annulé":"bg-red","annulé":"bg-red" };
  return <span className={`badge ${MAP[status]||"bg-gray"}`}>{status}</span>;
}

function Avatar({ name, size=42 }) {
  const initials = name?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() || "?";
  return (
    <div style={{ width:size,height:size,borderRadius:size/3.5,background:"linear-gradient(135deg,#001E50,#1E78B4)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",fontSize:size*0.35,flexShrink:0 }}>
      {initials}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PHONE FIELD WITH SMS
───────────────────────────────────────────────────────── */
function PhoneField({ value, onChange, prefix, onPrefix, onVerified }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("input");
  const [code, setCode] = useState("");
  const [inp, setInp] = useState("");
  const [err, setErr] = useState("");
  const sel = PRFX.find(p => p.code === prefix) || PRFX[0];

  function send() {
    if (!isPhone(value)) { setErr("Numéro invalide"); return; }
    const c = Math.floor(1000 + Math.random()*9000).toString();
    setCode(c); setStep("sent"); setErr("");
    console.log("[SMS simulé] Code:", c, "→", prefix, value);
  }
  function verify() {
    if (inp === code) { setStep("done"); onVerified(true); }
    else { setErr("Code incorrect"); }
  }

  return (
    <div>
      <label>Téléphone *</label>
      <div style={{ display:"flex", gap:8 }}>
        <div style={{ position:"relative", flexShrink:0 }}>
          <button type="button" onClick={()=>setOpen(!open)} style={{ display:"flex",alignItems:"center",gap:6,padding:"11px 12px",borderRadius:11,border:"1.5px solid #E4EBF5",background:"#F7F9FC",cursor:"pointer",fontFamily:"inherit",fontSize:13.5,fontWeight:600,height:46,whiteSpace:"nowrap" }}>
            {sel.flag} {sel.code} ▾
          </button>
          {open && (
            <div style={{ position:"absolute",top:"110%",left:0,background:"#fff",border:"1.5px solid #E4EBF5",borderRadius:14,boxShadow:"0 12px 32px rgba(0,0,0,.14)",zIndex:200,minWidth:220,maxHeight:250,overflowY:"auto" }}>
              {PRFX.map(p => (
                <button key={p.code} type="button" onClick={()=>{ onPrefix(p.code); setOpen(false); }} style={{ display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 14px",background:"none",border:"none",borderBottom:"1px solid #F0F4FA",cursor:"pointer",fontFamily:"inherit",fontSize:13 }}>
                  {p.flag} <strong>{p.code}</strong> <span style={{ color:T.muted,fontSize:12 }}>{p.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex:1,position:"relative" }}>
          <input placeholder="694 12 34 56" value={value} onChange={e=>onChange(e.target.value.replace(/\D/g,""))} disabled={step==="done"} className={step==="done"?"ok":""} style={{ paddingRight:40 }}/>
          {step === "done" && <span style={{ position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",fontSize:16,color:T.green }}>✓</span>}
        </div>
      </div>
      {step === "input" && isPhone(value) && (
        <button type="button" onClick={send} style={{ marginTop:9,background:T.blue,color:"#fff",border:"none",padding:"9px 18px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:12.5 }}>
          📱 Recevoir le code SMS
        </button>
      )}
      {step === "sent" && (
        <div className="sms-box">
          <p style={{ fontSize:13,color:T.mid,margin:"0 0 10px" }}>Code envoyé au <strong>{prefix}{value}</strong></p>
          <div style={{ display:"flex",gap:9 }}>
            <input className="code-input" value={inp} onChange={e=>setInp(e.target.value.slice(0,4))} maxLength={4} placeholder="1234" style={{ width:100 }}/>
            <button type="button" onClick={verify} style={{ background:T.green,color:"#fff",border:"none",padding:"11px 18px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13 }}>✓ Valider</button>
          </div>
          {err && <p style={{ color:T.red,fontSize:12,marginTop:7,fontWeight:600 }}>{err}</p>}
          <button type="button" onClick={()=>{setStep("input");setCode("");setInp("");}} style={{ background:"none",border:"none",color:T.muted,fontSize:12,cursor:"pointer",marginTop:7,fontFamily:"inherit" }}>← Changer le numéro</button>
        </div>
      )}
      {step === "done" && (
        <div style={{ marginTop:8,display:"flex",alignItems:"center",gap:7,fontSize:12.5,color:T.green,fontWeight:700 }}>
          <span style={{ width:20,height:20,borderRadius:"50%",background:T.green,color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11 }}>✓</span>
          Numéro vérifié
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LOGIN / REGISTER
───────────────────────────────────────────────────────── */
function AuthPage({ onAuth, notify }) {
  const [tab, setTab] = useState("login");
  const [d, setD] = useState({ name:"",email:"",password:"",phone:"",prefix:"+594",confpwd:"" });
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const up = (k,v) => setD(x=>({...x,[k]:v}));

  async function login() {
    if (!d.email || !d.password) { notify("Remplissez tous les champs.","err"); return; }
    setLoading(true);
    await new Promise(r=>setTimeout(r,600));
    const clients = await db.get("oi:c") || DEMO_CLIENTS;
    const found = clients.find(c => c.email===d.email && c.password===d.password);
    if (found) {
      await db.set("oi:session", found.email);
      onAuth(found);
      notify(`Bienvenue, ${found.name.split(" ")[0]} ! 👋`);
    } else {
      notify("Email ou mot de passe incorrect.", "err");
    }
    setLoading(false);
  }

  async function register() {
    if (!d.name||!d.email||!d.password||!d.phone) { notify("Tous les champs sont requis.","err"); return; }
    if (!isName(d.name)) { notify("Entrez un nom valide.","err"); return; }
    if (!isEmail(d.email)) { notify("Email invalide.","err"); return; }
    if (d.password.length < 6) { notify("Mot de passe trop court (6 min).","err"); return; }
    if (d.password !== d.confpwd) { notify("Les mots de passe ne correspondent pas.","err"); return; }
    setLoading(true);
    await new Promise(r=>setTimeout(r,700));
    const clients = await db.get("oi:c") || [];
    if (clients.find(c=>c.email===d.email)) { notify("Cet email est déjà utilisé.","err"); setLoading(false); return; }
    const nc = { id:Date.now(), name:d.name, email:d.email, password:d.password, phone:d.phone, prefix:d.prefix, createdAt:new Date().toLocaleDateString("fr-FR") };
    await db.set("oi:c", [...clients, nc]);
    await db.set("oi:session", nc.email);
    onAuth(nc);
    notify(`Compte créé ! Bienvenue, ${nc.name.split(" ")[0]} 🎉`);
    setLoading(false);
  }

  const fSt = (v, fn) => !v ? "" : fn(v) ? "ok" : "err";

  if (showForgot) return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",inset:0,background:`linear-gradient(145deg,#001E50 0%,#0A2B6E 50%,#001E50 100%)` }}/>
      <div style={{ position:"absolute",top:"-100px",right:"-100px",width:400,height:400,background:"rgba(244,120,32,.08)",borderRadius:"50%",filter:"blur(60px)" }}/>
      <div className="card afu" style={{ maxWidth:400,width:"100%",position:"relative",zIndex:1,borderRadius:24,padding:36 }}>
        <div style={{ textAlign:"center",marginBottom:24 }}>
          <div style={{ fontSize:44,marginBottom:10 }}>🔑</div>
          <h2 style={{ fontSize:22,fontWeight:800,color:T.navy2,marginBottom:6 }}>Mot de passe oublié ?</h2>
          <p style={{ fontSize:13.5,color:T.mid,lineHeight:1.7 }}>Je réinitialise votre accès sous 24h. Contactez-moi :</p>
        </div>
        <div style={{ background:T.warm,borderRadius:14,padding:"18px 20px",marginBottom:20,border:"1px solid #FDE68A" }}>
          <div style={{ fontSize:15,fontWeight:800,color:T.orange,marginBottom:4 }}>📞 06 94 47 33 22</div>
          <div style={{ fontSize:13,color:T.mid }}>ordimpact@gmail.com</div>
          <div style={{ fontSize:12,color:T.muted,marginTop:6,fontStyle:"italic" }}>Mentionnez votre email de compte</div>
        </div>
        <a href="https://wa.me/33694473322" target="_blank" rel="noreferrer" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"#25D366",color:"#fff",padding:"12px 20px",borderRadius:12,fontFamily:"inherit",fontWeight:700,fontSize:14,textDecoration:"none",marginBottom:14 }}>
          💬 Écrire sur WhatsApp
        </a>
        <button className="btn btn-g btn-full" onClick={()=>setShowForgot(false)}>← Retour à la connexion</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh",display:"flex",position:"relative",overflow:"hidden" }}>
      {/* Fond gauche décoratif */}
      <div style={{ position:"absolute",inset:0,background:`linear-gradient(145deg,#001E50 0%,#0A2B6E 55%,#001E50 100%)` }}/>
      <div style={{ position:"absolute",top:"-80px",left:"-80px",width:380,height:380,background:"rgba(30,150,210,.1)",borderRadius:"50%",filter:"blur(60px)" }}/>
      <div style={{ position:"absolute",bottom:"-100px",right:"-60px",width:420,height:420,background:"rgba(244,120,32,.08)",borderRadius:"50%",filter:"blur(70px)" }}/>

      <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",zIndex:1 }}>
        <div style={{ maxWidth:440,width:"100%" }}>

          {/* Header */}
          <div className="afu" style={{ textAlign:"center",marginBottom:32 }}>
            <Logo size={58}/>
            <h1 style={{ fontSize:28,fontWeight:900,color:"#fff",margin:"16px 0 5px",fontFamily:"'Fraunces',serif",letterSpacing:-.5 }}>Espace Client</h1>
            <p style={{ color:"rgba(255,255,255,.5)",fontSize:14,fontStyle:"italic" }}>Mets de l'ordre. Multiplie ton impact.</p>
          </div>

          {/* Card */}
          <div className="card afu del1" style={{ borderRadius:24,padding:0,overflow:"hidden" }}>
            {/* Tabs */}
            <div style={{ display:"flex",background:"#F7F9FC",borderBottom:"1px solid #E4EBF5" }}>
              {[["login","Connexion"],["register","Créer un compte"]].map(([v,l])=>(
                <button key={v} onClick={()=>setTab(v)} style={{ flex:1,padding:"14px",fontFamily:"inherit",fontWeight:700,fontSize:14,cursor:"pointer",background:tab===v?"#fff":"transparent",color:tab===v?T.navy2:T.muted,border:"none",borderBottom:tab===v?`3px solid ${T.orange}`:"3px solid transparent",transition:"all .2s" }}>
                  {l}
                </button>
              ))}
            </div>

            <div style={{ padding:28 }}>
              {tab === "login" && (
                <div>
                  <div style={{ marginBottom:16 }}>
                    <label>Adresse email</label>
                    <div className="field-wrap">
                      <input type="email" placeholder="votre@email.fr" value={d.email} onChange={e=>up("email",e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} className={fSt(d.email,isEmail)} style={{ paddingRight:40 }}/>
                      {d.email && <span className="field-ico" style={{ color:isEmail(d.email)?T.green:T.red }}>{isEmail(d.email)?"✓":"✕"}</span>}
                    </div>
                  </div>
                  <div style={{ marginBottom:22 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
                      <label style={{ margin:0 }}>Mot de passe</label>
                      <button onClick={()=>setShowForgot(true)} style={{ background:"none",border:"none",color:T.blue,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600 }}>Oublié ?</button>
                    </div>
                    <input type="password" placeholder="••••••••" value={d.password} onChange={e=>up("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/>
                  </div>
                  <button className="btn btn-p btn-full" onClick={login} style={{ fontSize:15 }}>
                    {loading?<Spinner light/>:"Se connecter →"}
                  </button>
                  <div style={{ marginTop:16,padding:"12px 16px",background:"#EFF6FF",borderRadius:11,fontSize:12,color:"#1E40AF" }}>
                    <strong>Comptes démo :</strong> sophie@email.fr / demo123 · marc@email.fr / demo123
                  </div>
                </div>
              )}

              {tab === "register" && (
                <div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14 }}>
                    <div>
                      <label>Prénom *</label>
                      <input placeholder="Marie" value={d.name.split(" ")[0]||""} onChange={e=>up("name",e.target.value+" "+(d.name.split(" ")[1]||""))} className={fSt(d.name.split(" ")[0],isName)}/>
                    </div>
                    <div>
                      <label>Nom *</label>
                      <input placeholder="Dupont" value={d.name.split(" ")[1]||""} onChange={e=>up("name",(d.name.split(" ")[0]||"")+" "+e.target.value)} className={fSt(d.name.split(" ")[1],isName)}/>
                    </div>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <label>Email *</label>
                    <div className="field-wrap">
                      <input type="email" placeholder="votre@email.fr" value={d.email} onChange={e=>up("email",e.target.value)} className={fSt(d.email,isEmail)} style={{ paddingRight:40 }}/>
                      {d.email && <span className="field-ico" style={{ color:isEmail(d.email)?T.green:T.red }}>{isEmail(d.email)?"✓":"✕"}</span>}
                    </div>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <PhoneField value={d.phone} onChange={v=>up("phone",v)} prefix={d.prefix} onPrefix={v=>up("prefix",v)} onVerified={v=>setPhoneVerified(v)}/>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <label>Mot de passe * <span style={{ fontWeight:400,color:T.muted,fontSize:11 }}>(6 caractères min.)</span></label>
                    <input type="password" placeholder="••••••••" value={d.password} onChange={e=>up("password",e.target.value)} className={d.password?(d.password.length>=6?"ok":"err"):""}/>
                  </div>
                  <div style={{ marginBottom:22 }}>
                    <label>Confirmer le mot de passe *</label>
                    <input type="password" placeholder="••••••••" value={d.confpwd} onChange={e=>up("confpwd",e.target.value)} className={d.confpwd?(d.confpwd===d.password?"ok":"err"):""}/>
                    {d.confpwd && d.confpwd!==d.password && <p style={{ fontSize:11,color:T.red,marginTop:5,fontWeight:600 }}>Les mots de passe ne correspondent pas</p>}
                  </div>
                  <button className="btn btn-p btn-full" onClick={register} style={{ fontSize:15 }}>
                    {loading?<Spinner light/>:"Créer mon compte →"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <p className="afu del3" style={{ textAlign:"center",marginTop:20,fontSize:12,color:"rgba(255,255,255,.35)" }}>
            Sécurisé · Confidentiel · ORD'IMPACT · SIRET 103 314 258 00015
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   DASHBOARD CLIENT — VUE D'ENSEMBLE
───────────────────────────────────────────────────────── */
function ClientDashboard({ user, myOrders, myDocs, myBookings }) {
  const spent = myOrders.reduce((s,o)=>s+(o.price||0),0);
  const pending = myBookings.filter(b=>b.status==="En attente").length;
  const newDocs = myDocs.filter(d=>!d.seen).length;

  const STATS = [
    { icon:"🛍️", label:"Produits achetés",   value:myOrders.length,    color:T.orange, bg:"#FFF7ED" },
    { icon:"📁", label:"Documents reçus",     value:myDocs.length,     color:T.blue,   bg:"#EFF6FF", badge:newDocs>0?`${newDocs} nouveau${newDocs>1?"x":""}`:null },
    { icon:"📅", label:"Rendez-vous",          value:myBookings.length, color:T.purple, bg:"#F5F3FF", badge:pending>0?`${pending} en attente`:null },
    { icon:"💶", label:"Total dépensé",        value:`${spent.toFixed(2)} €`, color:T.green, bg:"#F0FDF4" },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="afu" style={{ background:`linear-gradient(135deg,${T.navy},#0A2B6E)`,borderRadius:20,padding:"28px 32px",marginBottom:22,position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:"-50px",right:"-50px",width:200,height:200,background:"rgba(244,120,32,.08)",borderRadius:"50%",filter:"blur(30px)" }}/>
        <div style={{ position:"absolute",bottom:"-40px",left:"40%",width:160,height:160,background:"rgba(30,150,210,.08)",borderRadius:"50%",filter:"blur(30px)" }}/>
        <div style={{ position:"relative",zIndex:1 }}>
          <div style={{ fontSize:13,color:"rgba(255,255,255,.45)",fontWeight:600,marginBottom:4 }}>
            {new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}
          </div>
          <h1 style={{ fontSize:24,fontWeight:900,color:"#fff",letterSpacing:-.5,fontFamily:"'Fraunces',serif",margin:"0 0 5px" }}>
            Bonjour, {user.name.split(" ")[0]} ! 👋
          </h1>
          <p style={{ color:"rgba(255,255,255,.5)",fontSize:13,margin:0 }}>
            Bienvenue dans votre espace personnel ORD'IMPACT
          </p>
          {pending > 0 && (
            <div style={{ marginTop:14,display:"inline-flex",alignItems:"center",gap:8,background:"rgba(244,120,32,.2)",borderRadius:10,padding:"7px 14px" }}>
              <span style={{ width:7,height:7,borderRadius:"50%",background:T.orange,animation:"glow 2s infinite",flexShrink:0 }}/>
              <span style={{ fontSize:12,fontWeight:700,color:"#FFB347" }}>{pending} rendez-vous en attente de confirmation</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22 }}>
        {STATS.map(({icon,label,value,color,bg,badge},i)=>(
          <div key={i} className={`stat afu del${i+1}`} style={{ borderLeft:`3px solid ${color}` }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:10,fontWeight:700,color:T.muted,letterSpacing:.4,textTransform:"uppercase",marginBottom:8 }}>{label}</div>
                <div style={{ fontSize:26,fontWeight:900,color:T.navy2,lineHeight:1,letterSpacing:-.8 }}>{value}</div>
                {badge&&<span style={{ display:"inline-flex",marginTop:5,fontSize:10,fontWeight:700,padding:"2px 9px",borderRadius:99,background:color+"15",color }}>{badge}</span>}
              </div>
              <div style={{ width:40,height:40,borderRadius:11,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>{icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Derniers docs & rdv */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
        {/* Documents récents */}
        <div className="card afu del3">
          <div style={{ fontSize:14,fontWeight:800,color:T.navy2,marginBottom:16,display:"flex",alignItems:"center",gap:8 }}>
            📁 Documents récents
            {myDocs.length>0&&<span style={{ fontSize:11,fontWeight:700,background:T.blue+"15",color:T.blue,padding:"2px 9px",borderRadius:99 }}>{myDocs.length}</span>}
          </div>
          {myDocs.length===0
            ?<div className="empty" style={{ padding:"24px 12px" }}><div className="empty-ico">📭</div><div style={{ fontSize:13,color:T.muted }}>Aucun document partagé</div></div>
            :myDocs.slice(0,3).map((doc,i)=>(
              <div key={i} className="doc-row" style={{ marginBottom:8 }}>
                <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                  <div style={{ width:34,height:34,borderRadius:9,background:"#EFF6FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>📄</div>
                  <div>
                    <div style={{ fontWeight:700,color:T.navy2,fontSize:13 }}>{doc.name}</div>
                    <div style={{ fontSize:11,color:T.muted }}>{doc.date}</div>
                  </div>
                </div>
                {doc.url&&doc.url!=="#"&&<a href={doc.url} target="_blank" rel="noreferrer" className="btn btn-g btn-sm" style={{ textDecoration:"none",flexShrink:0 }}>↗</a>}
              </div>
            ))
          }
        </div>

        {/* Rendez-vous */}
        <div className="card afu del4">
          <div style={{ fontSize:14,fontWeight:800,color:T.navy2,marginBottom:16,display:"flex",alignItems:"center",gap:8 }}>
            📅 Mes rendez-vous
            {myBookings.length>0&&<span style={{ fontSize:11,fontWeight:700,background:T.purple+"15",color:T.purple,padding:"2px 9px",borderRadius:99 }}>{myBookings.length}</span>}
          </div>
          {myBookings.length===0
            ?<div className="empty" style={{ padding:"24px 12px" }}><div className="empty-ico">📅</div><div style={{ fontSize:13,color:T.muted }}>Aucun rendez-vous</div></div>
            :myBookings.map((b,i)=>(
              <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:i<myBookings.length-1?"1px solid #F0F4FA":"none" }}>
                <div>
                  <div style={{ fontWeight:700,color:T.navy2,fontSize:13 }}>{b.service}</div>
                  <div style={{ fontSize:11,color:T.muted }}>{b.date} {b.time&&`à ${b.time}`}</div>
                </div>
                <StatusBadge status={b.status}/>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MES PRODUITS
───────────────────────────────────────────────────────── */
function MyProducts({ myOrders }) {
  const digital = myOrders.filter(o => !o.isDrop);
  const physical = myOrders.filter(o => o.isDrop);

  const EMOJI_MAP = { "Kit Organisation Documents":"📂","Pack Lettres Administratives":"✉️","Guide CAF / APL Pas à Pas":"🏠","Tableau Budget Familial":"💰","Guide Impôts en Guyane":"📋","Classeur à anneaux A4":"📚","Chemise à soufflet A4":"📁","Pochettes plastiques x100":"🗃️" };

  return (
    <div>
      <h2 className="afu" style={{ fontSize:18,fontWeight:800,color:T.navy2,marginBottom:20 }}>🛍️ Mes produits</h2>

      {myOrders.length === 0 && (
        <div className="card afu">
          <div className="empty">
            <div className="empty-ico" style={{ fontSize:52 }}>🛍️</div>
            <div style={{ fontSize:15,fontWeight:700,color:T.mid }}>Votre panier est vide</div>
            <div style={{ fontSize:13,color:T.muted }}>Découvrez la boutique ORD'IMPACT</div>
            <a href="#" className="btn btn-p" style={{ marginTop:10,textDecoration:"none" }}>Découvrir la boutique →</a>
          </div>
        </div>
      )}

      {digital.length > 0 && (
        <div style={{ marginBottom:24 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
            <div style={{ width:32,height:32,borderRadius:9,background:"#F5F3FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>📱</div>
            <h3 style={{ fontSize:14,fontWeight:800,color:T.navy2 }}>Produits digitaux — Téléchargement immédiat</h3>
            <span style={{ fontSize:11,fontWeight:700,background:T.purple+"15",color:T.purple,padding:"2px 9px",borderRadius:99 }}>{digital.length}</span>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:14 }}>
            {digital.map((o,i)=>(
              <div key={i} className={`prod-card afu del${(i%4)+1}`}>
                <div style={{ background:`linear-gradient(135deg,${T.navy},#0A2B6E)`,padding:"20px 18px",position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",top:"-20px",right:"-20px",width:100,height:100,background:"rgba(244,120,32,.1)",borderRadius:"50%",filter:"blur(20px)" }}/>
                  <div style={{ fontSize:34,marginBottom:6 }}>{EMOJI_MAP[o.productName]||"📄"}</div>
                  <div style={{ fontSize:10,fontWeight:700,color:"rgba(255,255,255,.4)",letterSpacing:.6,textTransform:"uppercase",marginBottom:4 }}>Produit digital</div>
                  <div style={{ fontSize:14,fontWeight:700,color:"#fff",lineHeight:1.3 }}>{o.productName}</div>
                </div>
                <div style={{ padding:"14px 18px" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
                    <StatusBadge status={o.status}/>
                    <span style={{ fontWeight:800,color:T.orange,fontSize:15 }}>{o.price} €</span>
                  </div>
                  <div style={{ fontSize:11,color:T.muted,marginBottom:12 }}>Acheté le {o.date}</div>
                  {o.file
                    ?<a href={`/downloads/${o.file}`} className="btn btn-p" style={{ width:"100%",justifyContent:"center",fontSize:13,textDecoration:"none" }}>
                        ↓ Télécharger le fichier
                      </a>
                    :<div style={{ fontSize:12,color:T.muted,textAlign:"center",padding:"8px",background:T.cream,borderRadius:9 }}>Lien de téléchargement envoyé par email</div>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {physical.length > 0 && (
        <div>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
            <div style={{ width:32,height:32,borderRadius:9,background:"#EFF6FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>📦</div>
            <h3 style={{ fontSize:14,fontWeight:800,color:T.navy2 }}>Produits physiques — En livraison</h3>
            <span style={{ fontSize:11,fontWeight:700,background:T.blue+"15",color:T.blue,padding:"2px 9px",borderRadius:99 }}>{physical.length}</span>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {physical.map((o,i)=>(
              <div key={i} className="card afu" style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
                <div style={{ display:"flex",gap:12,alignItems:"center" }}>
                  <div style={{ width:46,height:46,borderRadius:12,background:"#EFF6FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>
                    {EMOJI_MAP[o.productName]||"📦"}
                  </div>
                  <div>
                    <div style={{ fontWeight:700,color:T.navy2,fontSize:14 }}>{o.productName}</div>
                    <div style={{ fontSize:12,color:T.muted }}>Commandé le {o.date} · {o.price} €</div>
                  </div>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <StatusBadge status={o.status}/>
                  <div className="progress-bar" style={{ width:80 }}>
                    <div className="progress-fill" style={{ width:o.status==="en livraison"?"60%":"100%",background:T.blue }}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MES DOCUMENTS
───────────────────────────────────────────────────────── */
function MyDocuments({ myDocs }) {
  return (
    <div>
      <h2 className="afu" style={{ fontSize:18,fontWeight:800,color:T.navy2,marginBottom:6 }}>📁 Documents partagés</h2>
      <p className="afu del1" style={{ fontSize:13,color:T.muted,marginBottom:20 }}>Documents envoyés par ORD'IMPACT directement dans votre espace</p>

      {myDocs.length === 0 ? (
        <div className="card afu">
          <div className="empty">
            <div className="empty-ico">📭</div>
            <div style={{ fontSize:15,fontWeight:700,color:T.mid }}>Aucun document partagé</div>
            <div style={{ fontSize:13,color:T.muted }}>Lorsque ORD'IMPACT partagera un document avec vous, il apparaîtra ici</div>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {myDocs.map((doc,i)=>(
            <div key={doc.id||i} className={`card afu del${(i%5)+1}`} style={{ padding:"18px 22px" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",gap:16 }}>
                <div style={{ display:"flex",gap:14,alignItems:"flex-start" }}>
                  <div style={{ width:48,height:48,borderRadius:13,background:`linear-gradient(135deg,${T.blue},${T.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>📄</div>
                  <div>
                    <div style={{ fontWeight:800,color:T.navy2,fontSize:14,marginBottom:4 }}>{doc.name}</div>
                    {doc.note && <div style={{ fontSize:12.5,color:T.mid,fontStyle:"italic",marginBottom:5,lineHeight:1.5 }}>"{doc.note}"</div>}
                    <div style={{ display:"flex",gap:10,alignItems:"center",flexWrap:"wrap" }}>
                      <div style={{ fontSize:11,color:T.muted }}>📅 Partagé le {doc.date}</div>
                      <span className="badge bg-blue" style={{ fontSize:10 }}>ORD'IMPACT</span>
                    </div>
                  </div>
                </div>
                <div style={{ flexShrink:0 }}>
                  {doc.url && doc.url !== "#" ? (
                    <a href={doc.url} target="_blank" rel="noreferrer" className="btn btn-p btn-sm" style={{ textDecoration:"none" }}>
                      ↓ Télécharger
                    </a>
                  ) : (
                    <span className="badge bg-orange">Lien à venir</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MES RENDEZ-VOUS
───────────────────────────────────────────────────────── */
function MyBookings({ myBookings }) {
  const COLOR_MAP = { "Confirmé":T.green,"En attente":T.amber,"Annulé":T.red };

  return (
    <div>
      <h2 className="afu" style={{ fontSize:18,fontWeight:800,color:T.navy2,marginBottom:6 }}>📅 Mes rendez-vous</h2>
      <p className="afu del1" style={{ fontSize:13,color:T.muted,marginBottom:20 }}>Historique et statut de vos demandes de rendez-vous</p>

      {myBookings.length === 0 ? (
        <div className="card afu">
          <div className="empty">
            <div className="empty-ico">📅</div>
            <div style={{ fontSize:15,fontWeight:700,color:T.mid }}>Aucun rendez-vous</div>
            <div style={{ fontSize:13,color:T.muted }}>Réservez votre diagnostic gratuit pour commencer</div>
            <a href="#" className="btn btn-p" style={{ marginTop:10,textDecoration:"none" }}>✨ Réserver un diagnostic gratuit</a>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {myBookings.map((b,i)=>(
            <div key={b.id||i} className={`card afu del${(i%5)+1}`} style={{ borderLeft:`4px solid ${COLOR_MAP[b.status]||T.muted}` }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12 }}>
                <div style={{ display:"flex",gap:13,alignItems:"flex-start" }}>
                  <div style={{ width:46,height:46,borderRadius:13,background:(COLOR_MAP[b.status]||T.muted)+"14",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>📅</div>
                  <div>
                    <div style={{ fontWeight:800,color:T.navy2,fontSize:14,marginBottom:3 }}>{b.service}</div>
                    <div style={{ display:"flex",gap:14,flexWrap:"wrap",fontSize:12,color:T.muted }}>
                      {b.date && <span>📅 {b.date}{b.time&&` à ${b.time}`}</span>}
                      <span>Demande du {b.createdAt}</span>
                    </div>
                    {b.status === "Confirmé" && (
                      <div style={{ marginTop:8,display:"flex",alignItems:"center",gap:6,fontSize:12,color:T.green,fontWeight:700 }}>
                        <span style={{ width:8,height:8,borderRadius:"50%",background:T.green,animation:"glow 2s infinite" }}/>
                        Rendez-vous confirmé — préparez vos documents
                      </div>
                    )}
                    {b.status === "En attente" && (
                      <div style={{ marginTop:8,fontSize:12,color:T.amber,fontWeight:600 }}>
                        ⏳ En attente de confirmation — réponse sous 24h
                      </div>
                    )}
                  </div>
                </div>
                <StatusBadge status={b.status}/>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card afu" style={{ marginTop:14,background:T.warm,border:"1px solid #FDE68A",borderRadius:14,padding:"16px 20px" }}>
        <div style={{ display:"flex",gap:11,alignItems:"center",flexWrap:"wrap" }}>
          <span style={{ fontSize:22 }}>💡</span>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700,color:T.navy2,marginBottom:3,fontSize:13 }}>Besoin d'un nouveau rendez-vous ?</div>
            <div style={{ fontSize:12,color:T.mid }}>Utilisez le diagnostic gratuit — je vous recontacte sous 24h.</div>
          </div>
          <a href="#" className="btn btn-p btn-sm" style={{ textDecoration:"none",flexShrink:0 }}>✨ Nouveau rendez-vous</a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MON PROFIL
───────────────────────────────────────────────────────── */
function MyProfile({ user, onUpdate, notify }) {
  const [d, setD] = useState({ name:user.name, email:user.email, phone:user.phone||"", prefix:user.prefix||"+594", currentPwd:"", newPwd:"", confPwd:"" });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("info");
  const up = (k,v) => setD(x=>({...x,[k]:v}));

  async function saveInfo() {
    if (!isName(d.name)) { notify("Nom invalide.","err"); return; }
    if (!isEmail(d.email)) { notify("Email invalide.","err"); return; }
    setSaving(true);
    await new Promise(r=>setTimeout(r,500));
    const clients = await db.get("oi:c") || [];
    const u = clients.map(c => c.email===user.email ? {...c, name:d.name, email:d.email, phone:d.phone} : c);
    await db.set("oi:c", u);
    const updated = {...user, name:d.name, email:d.email, phone:d.phone};
    await db.set("oi:session", updated.email);
    onUpdate(updated);
    setSaving(false);
    notify("Profil mis à jour !");
  }

  async function changePwd() {
    if (!d.currentPwd) { notify("Entrez votre mot de passe actuel.","err"); return; }
    if (d.currentPwd !== user.password) { notify("Mot de passe actuel incorrect.","err"); return; }
    if (d.newPwd.length < 6) { notify("Nouveau mot de passe trop court.","err"); return; }
    if (d.newPwd !== d.confPwd) { notify("Les mots de passe ne correspondent pas.","err"); return; }
    setSaving(true);
    await new Promise(r=>setTimeout(r,500));
    const clients = await db.get("oi:c") || [];
    const u = clients.map(c => c.email===user.email ? {...c, password:d.newPwd} : c);
    await db.set("oi:c", u);
    up("currentPwd",""); up("newPwd",""); up("confPwd","");
    setSaving(false);
    notify("Mot de passe changé !");
  }

  return (
    <div>
      <h2 className="afu" style={{ fontSize:18,fontWeight:800,color:T.navy2,marginBottom:20 }}>👤 Mon profil</h2>

      {/* Header profil */}
      <div className="card afu" style={{ marginBottom:16,background:`linear-gradient(135deg,${T.navy},#0A2B6E)`,border:"none" }}>
        <div style={{ display:"flex",alignItems:"center",gap:16,flexWrap:"wrap" }}>
          <Avatar name={user.name} size={62}/>
          <div>
            <div style={{ fontSize:20,fontWeight:900,color:"#fff",letterSpacing:-.4,fontFamily:"'Fraunces',serif" }}>{user.name}</div>
            <div style={{ fontSize:13,color:"rgba(255,255,255,.5)",marginTop:3 }}>{user.email}</div>
            <div style={{ marginTop:8,display:"flex",gap:8,flexWrap:"wrap" }}>
              <span style={{ fontSize:11,fontWeight:700,background:"rgba(244,120,32,.2)",color:"#FFB347",padding:"3px 11px",borderRadius:99 }}>Client ORD'IMPACT</span>
              <span style={{ fontSize:11,fontWeight:700,background:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.6)",padding:"3px 11px",borderRadius:99 }}>Inscrit le {user.createdAt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex",gap:4,marginBottom:18,background:"#fff",borderRadius:13,padding:5,border:"1px solid #E4EBF5" }}>
        {[["info","📝 Mes informations"],["security","🔒 Sécurité"]].map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)} style={{ flex:1,padding:"9px",borderRadius:10,fontFamily:"inherit",fontWeight:700,fontSize:13,cursor:"pointer",background:tab===v?T.navy:"transparent",color:tab===v?"#fff":T.muted,border:"none",transition:"all .2s" }}>
            {l}
          </button>
        ))}
      </div>

      {tab === "info" && (
        <div className="card afu">
          <div style={{ fontSize:14,fontWeight:800,color:T.navy2,marginBottom:20 }}>📝 Informations personnelles</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14 }}>
            <div>
              <label>Nom complet *</label>
              <input value={d.name} onChange={e=>up("name",e.target.value)} placeholder="Marie Dupont" className={d.name?(isName(d.name)?"ok":"err"):""}/>
            </div>
            <div>
              <label>Email *</label>
              <div className="field-wrap">
                <input type="email" value={d.email} onChange={e=>up("email",e.target.value)} className={d.email?(isEmail(d.email)?"ok":"err"):""} style={{ paddingRight:38 }}/>
                {d.email&&<span className="field-ico" style={{ color:isEmail(d.email)?T.green:T.red }}>{isEmail(d.email)?"✓":"✕"}</span>}
              </div>
            </div>
          </div>
          <div style={{ marginBottom:22 }}>
            <label>Téléphone</label>
            <input placeholder="694 12 34 56" value={d.phone} onChange={e=>up("phone",e.target.value.replace(/\D/g,""))}/>
          </div>
          <div style={{ display:"flex",justifyContent:"flex-end" }}>
            <button className="btn btn-p" onClick={saveInfo} style={{ padding:"11px 28px" }}>
              {saving?<Spinner light/>:"💾 Enregistrer"}
            </button>
          </div>
        </div>
      )}

      {tab === "security" && (
        <div className="card afu">
          <div style={{ fontSize:14,fontWeight:800,color:T.navy2,marginBottom:20 }}>🔒 Changer mon mot de passe</div>
          <div style={{ marginBottom:14 }}>
            <label>Mot de passe actuel *</label>
            <input type="password" placeholder="••••••••" value={d.currentPwd} onChange={e=>up("currentPwd",e.target.value)}/>
          </div>
          <div style={{ marginBottom:14 }}>
            <label>Nouveau mot de passe * <span style={{ fontWeight:400,color:T.muted,fontSize:11 }}>(6 caractères min.)</span></label>
            <input type="password" placeholder="••••••••" value={d.newPwd} onChange={e=>up("newPwd",e.target.value)} className={d.newPwd?(d.newPwd.length>=6?"ok":"err"):""}/>
          </div>
          <div style={{ marginBottom:22 }}>
            <label>Confirmer le nouveau mot de passe *</label>
            <input type="password" placeholder="••••••••" value={d.confPwd} onChange={e=>up("confPwd",e.target.value)} className={d.confPwd?(d.confPwd===d.newPwd&&d.newPwd.length>=6?"ok":"err"):""}/>
          </div>
          <div style={{ background:"#FFF7ED",borderRadius:12,padding:"12px 16px",marginBottom:20,fontSize:12,color:"#92400E",border:"1px solid #FDE68A" }}>
            💡 Utilisez un mot de passe fort : mélange de lettres, chiffres et symboles.
          </div>
          <div style={{ display:"flex",justifyContent:"flex-end" }}>
            <button className="btn btn-n" onClick={changePwd} style={{ padding:"11px 28px" }}>
              {saving?<Spinner light/>:"🔒 Changer le mot de passe"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   AIDE / CONTACT
───────────────────────────────────────────────────────── */
function Help() {
  const FAQS = [
    { q:"Comment télécharger mes produits digitaux ?", a:"Allez dans l'onglet 'Mes produits'. Pour chaque produit digital acheté, un bouton de téléchargement est disponible. Vous recevez aussi un lien par email lors de l'achat." },
    { q:"Comment voir les documents partagés par ORD'IMPACT ?", a:"Les documents partagés par Chawanda apparaissent dans l'onglet 'Documents'. Vous êtes notifié dès qu'un nouveau document est disponible." },
    { q:"Comment modifier mon rendez-vous ?", a:"Pour modifier ou annuler un rendez-vous, contactez directement Chawanda par WhatsApp ou par email. Elle s'occupe de tout !" },
    { q:"Mon mot de passe ne fonctionne pas.", a:"Utilisez le lien 'Mot de passe oublié' sur la page de connexion, ou contactez directement Chawanda par WhatsApp pour une réinitialisation rapide." },
    { q:"Comment acheter un produit de la boutique ?", a:"Rendez-vous dans la boutique depuis le menu principal. Choisissez votre produit, saisissez vos informations et procédez au paiement sécurisé via Stripe." },
  ];
  const [open, setOpen] = useState(null);

  return (
    <div>
      <h2 className="afu" style={{ fontSize:18,fontWeight:800,color:T.navy2,marginBottom:20 }}>💬 Aide & Contact</h2>

      {/* Contact direct */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:22 }}>
        {[
          {icon:"📞",label:"Téléphone",value:"06 94 47 33 22",href:"tel:0694473322",color:T.orange,btn:"Appeler"},
          {icon:"💬",label:"WhatsApp",value:"+33 6 94 47 33 22",href:"https://wa.me/33694473322",color:T.green,btn:"Écrire"},
          {icon:"📧",label:"Email",value:"ordimpact@gmail.com",href:"mailto:ordimpact@gmail.com",color:T.blue,btn:"Envoyer"},
        ].map(({icon,label,value,href,color,btn},i)=>(
          <div key={i} className={`card afu del${i+1}`} style={{ textAlign:"center" }}>
            <div style={{ width:48,height:48,borderRadius:14,background:color+"14",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,margin:"0 auto 10px" }}>{icon}</div>
            <div style={{ fontSize:12,fontWeight:700,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:.4 }}>{label}</div>
            <div style={{ fontSize:13,fontWeight:700,color:T.navy2,marginBottom:12 }}>{value}</div>
            <a href={href} target="_blank" rel="noreferrer" className="btn btn-g btn-sm" style={{ textDecoration:"none",width:"100%",justifyContent:"center" }}>{btn}</a>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="card afu">
        <div style={{ fontSize:14,fontWeight:800,color:T.navy2,marginBottom:18 }}>🔍 Questions fréquentes</div>
        {FAQS.map((f,i)=>(
          <div key={i} style={{ borderBottom:i<FAQS.length-1?`1px solid ${T.line}`:"none",marginBottom:i<FAQS.length-1?4:0 }}>
            <button onClick={()=>setOpen(open===i?null:i)} style={{ width:"100%",padding:"14px 0",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",textAlign:"left",gap:12 }}>
              <span style={{ fontSize:13.5,fontWeight:700,color:T.navy2,lineHeight:1.35 }}>{f.q}</span>
              <span style={{ fontSize:18,color:T.muted,flexShrink:0,transition:"transform .2s",transform:open===i?"rotate(45deg)":"none" }}>+</span>
            </button>
            {open===i&&(
              <div className="afi" style={{ paddingBottom:14,fontSize:13,color:T.mid,lineHeight:1.7 }}>{f.a}</div>
            )}
          </div>
        ))}
      </div>

      {/* Zone géo */}
      <div className="card afu" style={{ marginTop:14,background:T.warm,border:"1px solid #FDE68A" }}>
        <div style={{ display:"flex",gap:12,alignItems:"center",flexWrap:"wrap" }}>
          <span style={{ fontSize:22 }}>📍</span>
          <div>
            <div style={{ fontWeight:700,color:T.navy2,fontSize:13 }}>Zone d'intervention présentielle</div>
            <div style={{ fontSize:12,color:T.mid,marginTop:2 }}>Cayenne · Matoury · Rémire-Montjoly · Guyane française</div>
          </div>
          <div style={{ marginLeft:"auto",fontSize:12,color:T.muted }}>Lun–Ven · 8h–12h</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────────────── */
export default function ClientSpace() {
  const [user, setUser]     = useState(null);
  const [tab, setTab]       = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Data
  const [allOrders,   setAllOrders]   = useState(DEMO_ORDERS);
  const [allDocs,     setAllDocs]     = useState(DEMO_DOCS);
  const [allBookings, setAllBookings] = useState(DEMO_BOOKINGS);

  useEffect(() => {
    (async () => {
      const [sessionEmail, clients, orders, docs, bookings] = await Promise.all([
        db.get("oi:session"), db.get("oi:c"), db.get("oi:o"), db.get("oi:cd"), db.get("oi:b"),
      ]);
      if (orders)   setAllOrders(orders);
      if (docs)     setAllDocs(docs);
      if (bookings) setAllBookings(bookings);
      if (sessionEmail) {
        const cl = (clients || DEMO_CLIENTS).find(c => c.email === sessionEmail);
        if (cl) setUser(cl);
      }
      setLoading(false);
    })();
  }, []);

  function notify(msg, type="ok") {
    const id = Date.now();
    setToasts(t => [...t, {id,msg,type}]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }

  async function logout() {
    await db.set("oi:session", null);
    setUser(null);
    setTab("dashboard");
    notify("Déconnecté avec succès.");
  }

  function onAuth(u) {
    setUser(u);
    setTab("dashboard");
  }

  function onUpdateUser(u) {
    setUser(u);
  }

  if (loading) return (
    <div style={{ height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:T.cream,gap:16 }}>
      <Logo size={54}/>
      <Spinner size={28}/>
      <div style={{ fontSize:13,color:T.muted }}>Chargement…</div>
    </div>
  );

  if (!user) return (
    <>
      <style>{CSS}</style>
      <Toast toasts={toasts}/>
      <AuthPage onAuth={onAuth} notify={notify}/>
    </>
  );

  // Filtres par utilisateur
  const myOrders   = allOrders.filter(o => o.clientEmail === user.email);
  const myDocs     = allDocs[user.email] || [];
  const myBookings = allBookings.filter(b => b.clientEmail === user.email);
  const newDocs    = myDocs.length;
  const pendingRdv = myBookings.filter(b => b.status==="En attente").length;

  const NAV = [
    { id:"dashboard",  icon:"🏠", label:"Accueil" },
    { id:"products",   icon:"🛍️", label:"Mes produits",    count:myOrders.length },
    { id:"docs",       icon:"📁", label:"Documents",        count:newDocs },
    { id:"bookings",   icon:"📅", label:"Rendez-vous",      count:pendingRdv },
    { id:"profile",    icon:"👤", label:"Mon profil" },
    { id:"help",       icon:"💬", label:"Aide & Contact" },
  ];

  return (
    <div style={{ fontFamily:"'Sora',system-ui,sans-serif",minHeight:"100vh" }}>
      <style>{CSS}</style>
      <Toast toasts={toasts}/>

      {/* TOPBAR */}
      <header style={{ background:T.navy,borderBottom:`3px solid ${T.orange}`,position:"sticky",top:0,zIndex:100 }}>
        <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 24px",height:62,display:"flex",alignItems:"center",gap:10 }}>
          {/* Logo */}
          <div style={{ display:"flex",alignItems:"center",gap:10,marginRight:16,flexShrink:0 }}>
            <Logo size={36}/>
            <div>
              <div style={{ fontWeight:900,fontSize:16,color:"#fff",letterSpacing:-.3,lineHeight:1 }}>ORD'IMPACT</div>
              <div style={{ fontSize:8.5,color:T.orange,fontWeight:600,fontStyle:"italic",letterSpacing:.3 }}>Espace client</div>
            </div>
          </div>

          {/* Nav desktop */}
          <nav style={{ display:"flex",alignItems:"center",gap:2,flex:1,flexWrap:"wrap" }}>
            {NAV.map(({id,icon,label,count})=>(
              <button key={id} onClick={()=>setTab(id)} style={{ background:tab===id?"rgba(244,120,32,.18)":"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600,color:tab===id?T.orange:"rgba(255,255,255,.65)",padding:"8px 12px",borderRadius:9,transition:"all .18s",display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap" }}>
                {icon} {label}
                {count>0&&<span style={{ background:T.orange,color:"#fff",fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:99,minWidth:18,textAlign:"center" }}>{count}</span>}
              </button>
            ))}
          </nav>

          {/* User + logout */}
          <div style={{ display:"flex",alignItems:"center",gap:10,flexShrink:0 }}>
            <Avatar name={user.name} size={32}/>
            <span style={{ fontSize:12.5,fontWeight:700,color:"rgba(255,255,255,.8)" }}>{user.name.split(" ")[0]}</span>
            <button onClick={logout} style={{ background:"rgba(255,255,255,.08)",border:"none",color:"rgba(255,255,255,.5)",padding:"6px 11px",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:600,transition:"all .18s" }}
              onMouseEnter={e=>{e.target.style.background="rgba(255,255,255,.15)";e.target.style.color="#fff"}}
              onMouseLeave={e=>{e.target.style.background="rgba(255,255,255,.08)";e.target.style.color="rgba(255,255,255,.5)"}}>
              ↩ Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* TICKER */}
      <div style={{ background:"#0A2B6E",overflow:"hidden",padding:"7px 0",borderBottom:`1px solid rgba(255,255,255,.05)` }}>
        <div style={{ display:"flex",gap:36,animation:"marquee 28s linear infinite",width:"max-content" }}>
          {[...Array(2)].flatMap(()=>
            ["📋 Assistance administrative","🚗 Carte grise minute","🇫🇷 Naturalisation","📱 Réseaux sociaux","⌨️ Frappe de documents","💼 Carte de visite virtuelle","🍽️ Menu interactif","📄 Flyers","🌍 Immigration"].map((it,i)=>(
              <span key={i} style={{ fontSize:12,fontWeight:600,color:"rgba(255,255,255,.35)",whiteSpace:"nowrap" }}>
                {it}<span style={{ color:T.orange,margin:"0 10px" }}>·</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* CONTENT */}
      <main style={{ maxWidth:1100,margin:"0 auto",padding:"28px 24px" }}>
        <div key={tab} className="afu">
          {tab==="dashboard" && <ClientDashboard user={user} myOrders={myOrders} myDocs={myDocs} myBookings={myBookings}/>}
          {tab==="products"  && <MyProducts myOrders={myOrders}/>}
          {tab==="docs"      && <MyDocuments myDocs={myDocs}/>}
          {tab==="bookings"  && <MyBookings myBookings={myBookings}/>}
          {tab==="profile"   && <MyProfile user={user} onUpdate={onUpdateUser} notify={notify}/>}
          {tab==="help"      && <Help/>}
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{ background:T.navy,marginTop:40,padding:"24px",textAlign:"center" }}>
        <div style={{ fontSize:12,color:"rgba(255,255,255,.25)" }}>
          © {new Date().getFullYear()} ORD'IMPACT · SIRET 103 314 258 00015 · Micro-entreprise · Guyane française
        </div>
      </footer>
    </div>
  );
}
