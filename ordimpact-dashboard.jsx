import { useState, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────────────────
   STORAGE
───────────────────────────────────────────────────────── */
const db = {
  get: async k => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } },
  set: async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch {} },
};

/* ─────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────── */
const T = {
  navy:   "#001E50",
  navy2:  "#0A1B45",
  orange: "#F47820",
  orange2:"#F05A1E",
  blue:   "#1E78B4",
  cyan:   "#1E96D2",
  pale:   "#B4D2F0",
  white:  "#FFFFFF",
  cream:  "#F7F9FC",
  line:   "#E4EBF5",
  mid:    "#64748B",
  muted:  "#94A3B8",
  green:  "#16A34A",
  red:    "#DC2626",
  amber:  "#D97706",
  purple: "#7C3AED",
};

/* ─────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%;font-family:'Sora',system-ui,sans-serif;font-size:14px;background:#F0F4FA;color:#0A1B45}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#C4D0E8;border-radius:99px}
::-webkit-scrollbar-thumb:hover{background:#F47820}

@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:none}}
@keyframes pulse2{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes toastIn{from{opacity:0;transform:translateY(-8px) scale(.96)}to{opacity:1;transform:none}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}

.afu{animation:fadeUp .35s cubic-bezier(.16,1,.3,1) both}
.afi{animation:fadeIn .25s ease both}
.asi{animation:slideIn .3s cubic-bezier(.16,1,.3,1) both}
.afu-1{animation-delay:.05s}.afu-2{animation-delay:.1s}.afu-3{animation-delay:.15s}.afu-4{animation-delay:.2s}.afu-5{animation-delay:.25s}

/* Layout */
.layout{display:grid;grid-template-columns:240px 1fr;min-height:100vh}
.sidebar{background:#001E50;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto}
.main{display:flex;flex-direction:column;min-height:100vh;overflow:hidden}
.topbar{background:#fff;border-bottom:1px solid #E4EBF5;padding:0 28px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
.content{padding:28px;flex:1}

/* Sidebar nav */
.nav-section{padding:8px 12px 4px;font-size:10px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:rgba(255,255,255,.28);margin-top:8px}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 14px;margin:1px 8px;border-radius:10px;cursor:pointer;transition:all .18s;font-size:13px;font-weight:600;color:rgba(255,255,255,.62);border:none;background:none;font-family:inherit;width:calc(100% - 16px);text-align:left}
.nav-item:hover{background:rgba(255,255,255,.08);color:#fff}
.nav-item.active{background:rgba(244,120,32,.18);color:#F47820}
.nav-item .badge{margin-left:auto;background:#F47820;color:#fff;font-size:10px;font-weight:700;padding:1px 7px;border-radius:99px;min-width:20px;text-align:center}
.nav-item.active .badge{background:rgba(255,255,255,.2);color:#fff}

/* Cards */
.card{background:#fff;border-radius:16px;border:1px solid #E4EBF5;padding:20px 22px}
.card-sm{background:#fff;border-radius:12px;border:1px solid #E4EBF5;padding:14px 16px}
.stat-card{background:#fff;border-radius:16px;border:1px solid #E4EBF5;padding:20px 22px;position:relative;overflow:hidden;transition:transform .22s,box-shadow .22s}
.stat-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,30,80,.1)}

/* Buttons */
.btn{cursor:pointer;font-family:inherit;font-weight:700;border:none;padding:9px 18px;border-radius:10px;font-size:13px;display:inline-flex;align-items:center;gap:7px;transition:all .2s;white-space:nowrap}
.btn-primary{background:#F47820;color:#fff}.btn-primary:hover{background:#E06810;transform:translateY(-1px);box-shadow:0 6px 20px rgba(244,120,32,.35)}
.btn-navy{background:#001E50;color:#fff}.btn-navy:hover{background:#0A1B45;transform:translateY(-1px)}
.btn-ghost{background:transparent;color:#64748B;border:1px solid #E4EBF5}.btn-ghost:hover{background:#F7F9FC;color:#001E50;border-color:#C4D0E8}
.btn-danger{background:#FEF2F2;color:#DC2626;border:1px solid #FECACA}.btn-danger:hover{background:#DC2626;color:#fff}
.btn-success{background:#F0FDF4;color:#16A34A;border:1px solid #BBF7D0}.btn-success:hover{background:#16A34A;color:#fff}
.btn-sm{padding:6px 12px;font-size:12px;border-radius:8px}
.btn-icon{width:34px;height:34px;padding:0;justify-content:center;border-radius:8px}

/* Form */
input,textarea,select{font-family:'Sora',system-ui,sans-serif;font-size:13px;padding:10px 13px;border-radius:10px;border:1.5px solid #E4EBF5;background:#F7F9FC;color:#0A1B45;outline:none;width:100%;transition:all .2s}
input:focus,textarea:focus,select:focus{border-color:#1E78B4;background:#fff;box-shadow:0 0 0 3px rgba(30,120,180,.1)}
label{font-size:12px;font-weight:700;color:#001E50;display:block;margin-bottom:6px;letter-spacing:.1px}

/* Table */
.table{width:100%;border-collapse:collapse;font-size:13px}
.table th{text-align:left;padding:10px 14px;color:#94A3B8;font-weight:700;font-size:11px;letter-spacing:.5px;text-transform:uppercase;border-bottom:1px solid #E4EBF5;background:#FAFBFD}
.table td{padding:12px 14px;border-bottom:1px solid #F3F6FB;vertical-align:middle}
.table tr:last-child td{border-bottom:none}
.table tr:hover td{background:#FAFBFD}

/* Badges */
.badge{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px}
.badge-green{background:#F0FDF4;color:#16A34A}
.badge-orange{background:#FFF7ED;color:#EA580C}
.badge-blue{background:#EFF6FF;color:#2563EB}
.badge-red{background:#FEF2F2;color:#DC2626}
.badge-purple{background:#F5F3FF;color:#7C3AED}
.badge-gray{background:#F8FAFC;color:#64748B;border:1px solid #E4EBF5}
.badge-navy{background:#001E50;color:#fff}

/* Toast */
.toast{position:fixed;top:16px;right:20px;z-index:9999;padding:12px 20px;border-radius:12px;font-weight:700;font-size:13px;display:flex;align-items:center;gap:9px;box-shadow:0 8px 28px rgba(0,0,0,.18);animation:toastIn .3s ease;min-width:260px}
.toast-ok{background:#001E50;color:#fff}
.toast-err{background:#DC2626;color:#fff}

/* Mini chart */
.mini-bar{display:flex;align-items:flex-end;gap:3px;height:36px}
.mini-bar span{border-radius:3px 3px 0 0;min-width:6px;transition:height .4s ease}

/* Empty state */
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;gap:10px;color:#94A3B8;text-align:center}
.empty .ico{font-size:40px;margin-bottom:4px;opacity:.5}

/* Switch */
.switch{width:36px;height:20px;border-radius:99px;position:relative;cursor:pointer;transition:background .2s;border:none;padding:0;flex-shrink:0}
.switch::after{content:'';position:absolute;width:14px;height:14px;border-radius:50%;background:#fff;top:3px;left:3px;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.switch.on{background:#16A34A}
.switch.on::after{transform:translateX(16px)}
.switch.off{background:#D1D5DB}

/* Modal */
.modal-bg{position:fixed;inset:0;background:rgba(0,20,60,.5);backdrop-filter:blur(4px);z-index:800;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s}
.modal-box{background:#fff;border-radius:20px;padding:28px;max-width:580px;width:100%;position:relative;animation:fadeUp .3s cubic-bezier(.16,1,.3,1);max-height:90vh;overflow-y:auto}

/* Chip */
.chip{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:8px;border:1.5px solid #E4EBF5;background:#fff;font-size:12px;font-weight:600;color:#64748B;cursor:pointer;transition:all .18s}
.chip:hover,.chip.on{border-color:#F47820;color:#F47820;background:#FFF7ED;font-weight:700}

/* Drag hint */
.row-del{position:relative}
.row-del:hover .del-btn{opacity:1}
.del-btn{opacity:0;transition:opacity .18s}
`;

/* ─────────────────────────────────────────────────────────
   DATA SEEDS
───────────────────────────────────────────────────────── */
const SEED_SERVICES_PRES = [
  {id:1,icon:"📋",label:"Assistance administrative générale",price:"Sur devis"},
  {id:2,icon:"🚗",label:"Cession de véhicule",price:"Sur devis"},
  {id:3,icon:"🇫🇷",label:"Dossier de naturalisation",price:"Sur devis"},
  {id:4,icon:"🪪",label:"Duplicata de permis de conduire",price:"À partir de 25 €"},
  {id:5,icon:"🚘",label:"Carte grise minute",price:"À partir de 35 €"},
  {id:6,icon:"🌍",label:"Procédure d'immigration",price:"Sur devis"},
  {id:7,icon:"🗂️",label:"Secrétariat administratif",price:"À partir de 20 €/h"},
];
const SEED_SERVICES_ONLINE = [
  {id:10,icon:"📱",label:"Création de visuels & réseaux sociaux",price:"À partir de 30 €"},
  {id:11,icon:"⌨️",label:"Frappe de documents",price:"À partir de 15 €"},
  {id:12,icon:"📲",label:"Gestion de vos réseaux sociaux",price:"À partir de 80 €/mois"},
  {id:13,icon:"✉️",label:"Signature email professionnelle",price:"À partir de 20 €"},
  {id:14,icon:"🖼️",label:"Bannière",price:"À partir de 25 €"},
  {id:15,icon:"📄",label:"Flyers",price:"À partir de 30 €"},
  {id:16,icon:"💼",label:"Carte de visite virtuelle & interactive",price:"À partir de 35 €"},
  {id:17,icon:"🍽️",label:"Menu interactif",price:"À partir de 120 €"},
  {id:18,icon:"📦",label:"Fiche produit",price:"À partir de 20 €/fiche"},
];
const SEED_DIGITAL = [
  {id:1,name:"Kit Organisation Documents",price:15,desc:"Checklist + modèles numériques",cat:"Organisation",emoji:"📂",active:true},
  {id:2,name:"Pack Lettres Administratives",price:9,desc:"5 modèles prêts à l'emploi",cat:"Courrier",emoji:"✉️",active:true},
  {id:3,name:"Guide CAF / APL Pas à Pas",price:12,desc:"Guide illustré étape par étape",cat:"Guides",emoji:"🏠",active:true},
  {id:4,name:"Tableau Budget Familial",price:8,desc:"Fichier Excel pré-formaté",cat:"Organisation",emoji:"💰",active:true},
  {id:5,name:"Guide Impôts en Guyane",price:14,desc:"Déclaration de revenus expliquée",cat:"Guides",emoji:"📋",active:true},
];
const SEED_DROP = [
  {id:101,name:"Chemise à soufflet A4",price:4.99,desc:"Coloris assortis, classement",cat:"Papeterie",emoji:"📁",active:true,supplier:"https://amzn.to/exemple1"},
  {id:102,name:"Classeur à anneaux A4",price:7.99,desc:"Rigide 8 cm, archivage",cat:"Classement",emoji:"📚",active:true,supplier:"https://amzn.to/exemple2"},
  {id:103,name:"Pochettes plastiques x100",price:9.99,desc:"Transparentes A4 perforées",cat:"Classement",emoji:"🗃️",active:true,supplier:"https://amzn.to/exemple3"},
];
const SEED_BOOKINGS = [
  {id:1,prenom:"Marie",nom:"Dupont",email:"marie@email.fr",phone:"0694001122",service:"Carte grise minute",date:"2026-04-10",time:"09:00",status:"Confirmé",createdAt:"08/04/2026"},
  {id:2,prenom:"Jean",nom:"Martin",email:"jean@email.fr",phone:"0694223344",service:"Dossier de naturalisation",date:"2026-04-16",time:"10:30",status:"En attente",createdAt:"13/04/2026"},
  {id:3,prenom:"Aline",nom:"Bernard",email:"aline@email.fr",phone:"0694556677",service:"Assistance administrative",date:"2026-04-18",time:"08:30",status:"En attente",createdAt:"14/04/2026"},
];
const SEED_ORDERS = [
  {id:1,clientName:"Sophie Lemaire",clientEmail:"sophie@email.fr",productName:"Kit Organisation Documents",price:15,date:"12/04/2026",status:"confirmé",isDrop:false},
  {id:2,clientName:"Marc Leroy",clientEmail:"marc@email.fr",productName:"Classeur à anneaux A4",price:7.99,date:"13/04/2026",status:"en livraison",isDrop:true},
  {id:3,clientName:"Emma Petit",clientEmail:"emma@email.fr",productName:"Guide CAF / APL",price:12,date:"14/04/2026",status:"confirmé",isDrop:false},
];
const SEED_CLIENTS = [
  {id:1,name:"Sophie Lemaire",email:"sophie@email.fr",phone:"0694001122",createdAt:"10/04/2026",orders:1,spent:15},
  {id:2,name:"Marc Leroy",email:"marc@email.fr",phone:"0694223344",createdAt:"11/04/2026",orders:1,spent:7.99},
  {id:3,name:"Emma Petit",email:"emma@email.fr",phone:"0694334455",createdAt:"12/04/2026",orders:1,spent:12},
];

/* ─────────────────────────────────────────────────────────
   MICRO COMPONENTS
───────────────────────────────────────────────────────── */
function Toast({t}){
  if(!t)return null;
  return <div className={`toast ${t.type==="ok"?"toast-ok":"toast-err"}`}>{t.type==="ok"?"✓":"✕"} {t.msg}</div>;
}

function Spinner(){
  return <div style={{width:18,height:18,border:"2.5px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>;
}

function StatusBadge({status}){
  const map={
    "Confirmé":"badge-green","confirmé":"badge-green",
    "En attente":"badge-orange",
    "Annulé":"badge-red","annulé":"badge-red",
    "en livraison":"badge-blue",
    "À traiter":"badge-purple",
  };
  return <span className={`badge ${map[status]||"badge-gray"}`}>{status}</span>;
}

function MiniBar({data,color=T.orange}){
  const max=Math.max(...data,1);
  return(
    <div className="mini-bar">
      {data.map((v,i)=>(
        <span key={i} style={{height:`${(v/max)*100}%`,background:i===data.length-1?color:color+"55",flex:1}}/>
      ))}
    </div>
  );
}

function StatCard({icon,label,value,sub,color,bar,delay="",onClick}){
  return(
    <div className={`stat-card afu ${delay}`} onClick={onClick} style={{cursor:onClick?"pointer":"default"}}>
      <div style={{position:"absolute",top:0,left:0,width:4,height:"100%",background:color,borderRadius:"16px 0 0 16px"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",paddingLeft:4}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:.4,textTransform:"uppercase",marginBottom:8}}>{label}</div>
          <div style={{fontSize:28,fontWeight:900,color:T.navy2,lineHeight:1,letterSpacing:-1}}>{value}</div>
          {sub&&<div style={{fontSize:12,color:T.mid,marginTop:6,fontWeight:500}}>{sub}</div>}
        </div>
        <div style={{width:44,height:44,borderRadius:12,background:color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
          {icon}
        </div>
      </div>
      {bar&&<div style={{marginTop:14,paddingLeft:4}}><MiniBar data={bar} color={color}/></div>}
    </div>
  );
}

function SectionHeader({title,sub,action}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
      <div>
        <h2 style={{fontSize:18,fontWeight:800,color:T.navy2,margin:0}}>{title}</h2>
        {sub&&<p style={{fontSize:13,color:T.muted,margin:"3px 0 0"}}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function EmptyState({icon,msg,sub}){
  return(
    <div className="empty">
      <div className="ico">{icon}</div>
      <div style={{fontSize:14,fontWeight:700,color:T.mid}}>{msg}</div>
      {sub&&<div style={{fontSize:12,color:T.muted}}>{sub}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MODAL CONFIRM
───────────────────────────────────────────────────────── */
function ConfirmModal({msg,onOk,onCancel}){
  return(
    <div className="modal-bg">
      <div className="modal-box" style={{maxWidth:380,textAlign:"center"}}>
        <div style={{fontSize:42,marginBottom:12}}>⚠️</div>
        <h3 style={{fontSize:16,fontWeight:800,color:T.navy2,marginBottom:8}}>Confirmer la suppression</h3>
        <p style={{fontSize:13,color:T.mid,marginBottom:22}}>{msg}</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button className="btn btn-ghost" onClick={onCancel}>Annuler</button>
          <button className="btn btn-danger" style={{background:T.red,color:"#fff",border:"none"}} onClick={onOk}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   DASHBOARD OVERVIEW
───────────────────────────────────────────────────────── */
function Overview({data,setTab}){
  const {bookings,orders,clients,visitors} = data;
  const revenue = orders.reduce((s,o)=>s+(o.price||0),0);
  const pending = bookings.filter(b=>b.status==="En attente").length;
  const STATS=[
    {icon:"👁️",label:"Visiteurs",value:visitors||0,sub:"Ce mois",color:T.blue,bar:[12,18,9,24,16,28,visitors||0]},
    {icon:"💶",label:"Chiffre d'affaires",value:`${revenue.toFixed(0)} €`,sub:`${orders.length} commande(s)`,color:T.orange,bar:[80,120,65,200,150,180,revenue]},
    {icon:"👥",label:"Clients",value:clients.length,sub:"Inscrits",color:"#16A34A",bar:[1,1,2,3,2,3,clients.length]},
    {icon:"📅",label:"Demandes",value:bookings.length,sub:`${pending} en attente`,color:T.purple,bar:[1,2,1,3,2,3,bookings.length]},
  ];

  const recent=[
    ...bookings.slice(-4).reverse().map(b=>({type:"rdv",label:`${b.prenom} ${b.nom}`,sub:b.service,date:b.createdAt,status:b.status,color:T.purple})),
    ...orders.slice(-4).reverse().map(o=>({type:"order",label:o.clientName,sub:o.productName,date:o.date,status:o.status,color:T.orange})),
  ].slice(0,8);

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
        {STATS.map((s,i)=>(<StatCard key={i} {...s} delay={`afu-${i+1}`} onClick={s.label==="Demandes"?()=>setTab("bookings"):s.label==="Clients"?()=>setTab("clients"):undefined}/>))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {/* Activité récente */}
        <div className="card afu afu-3">
          <SectionHeader title="Activité récente" sub="Demandes & commandes"/>
          {recent.length===0
            ?<EmptyState icon="📭" msg="Aucune activité" sub="Les nouvelles demandes apparaîtront ici"/>
            :recent.map((r,i)=>(
              <div key={i} style={{display:"flex",gap:11,alignItems:"center",padding:"9px 0",borderBottom:i<recent.length-1?`1px solid ${T.line}`:"none"}}>
                <div style={{width:34,height:34,borderRadius:10,background:r.color+"14",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>
                  {r.type==="rdv"?"📅":"🛍️"}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,color:T.navy2,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.label}</div>
                  <div style={{fontSize:11,color:T.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.sub}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <StatusBadge status={r.status}/>
                  <div style={{fontSize:10,color:T.muted,marginTop:3}}>{r.date}</div>
                </div>
              </div>
            ))
          }
        </div>

        {/* Actions rapides */}
        <div className="card afu afu-4">
          <SectionHeader title="Actions rapides"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[
              {icon:"✏️",label:"Modifier le site",color:T.blue,tab:"content"},
              {icon:"🛍️",label:"Gérer la boutique",color:T.orange,tab:"shop"},
              {icon:"📅",label:"Voir les demandes",color:T.purple,tab:"bookings"},
              {icon:"📁",label:"Partager un doc",color:T.green,tab:"docs"},
              {icon:"🔧",label:"Mes services",color:"#0891B2",tab:"services"},
              {icon:"👥",label:"Clients",color:T.navy,tab:"clients"},
            ].map(({icon,label,color,tab})=>(
              <button key={tab} onClick={()=>setTab(tab)} className="btn btn-ghost" style={{justifyContent:"flex-start",gap:9,padding:"11px 14px",height:"auto",fontWeight:600,fontSize:13,borderRadius:12}}>
                <span style={{width:32,height:32,borderRadius:9,background:color+"14",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CONTENT EDITOR
───────────────────────────────────────────────────────── */
function ContentEditor({siteData,setSiteData,notify}){
  const[local,setLocal]=useState({...siteData});
  const[saving,setSaving]=useState(false);
  const upL=(k,v)=>setLocal(s=>({...s,[k]:v}));

  async function save(){
    setSaving(true);
    await new Promise(r=>setTimeout(r,400));
    setSiteData(local);
    await db.set("oi:sd",local);
    setSaving(false);
    notify("Modifications sauvegardées !");
  }

  const SECTIONS=[
    {key:"hero",  title:"🏠 Page d'accueil", fields:[
      {k:"heroTitle",l:"Titre principal",ml:false,ph:"L'administration simplifiée."},
      {k:"heroSub",  l:"Sous-titre",ml:true, ph:"Parce que la paperasse ne devrait pas vous bloquer..."},
    ]},
    {key:"about", title:"👩 À propos", fields:[
      {k:"aboutTitle",l:"Titre de présentation",ml:false},
      {k:"aboutText", l:"Texte principal",ml:true},
      {k:"aboutMission",l:"Phrase mission",ml:true},
    ]},
    {key:"contact",title:"📞 Coordonnées", fields:[
      {k:"phone",l:"Téléphone"},
      {k:"email",l:"Email"},
      {k:"waNumber",l:"Numéro WhatsApp (sans +, ex: 33694473322)"},
      {k:"instagram",l:"Lien Instagram complet"},
    ]},
  ];

  return(
    <div>
      <SectionHeader title="✏️ Modifier le contenu du site" sub="Les changements s'appliquent immédiatement après sauvegarde"
        action={<button className="btn btn-primary" onClick={save}>{saving?<Spinner/>:"💾 Sauvegarder"}</button>}
      />
      <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:12,padding:"12px 16px",marginBottom:24,fontSize:13,color:"#1E40AF",display:"flex",gap:10,alignItems:"center"}}>
        <span style={{fontSize:16}}>ℹ️</span>
        <span>Modifiez les textes ci-dessous et cliquez <strong>Sauvegarder</strong>. Le site se met à jour automatiquement.</span>
      </div>

      {SECTIONS.map(({key,title,fields})=>(
        <div key={key} className="card afu" style={{marginBottom:16}}>
          <div style={{fontSize:14,fontWeight:800,color:T.navy2,marginBottom:18,paddingBottom:12,borderBottom:`1px solid ${T.line}`}}>{title}</div>
          {fields.map(({k,l,ml,ph})=>(
            <div key={k} style={{marginBottom:16}}>
              <label>{l}</label>
              {ml
                ?<textarea value={local[k]||""} onChange={e=>upL(k,e.target.value)} rows={3} placeholder={ph||""} style={{resize:"vertical"}}/>
                :<input value={local[k]||""} onChange={e=>upL(k,e.target.value)} placeholder={ph||""}/>
              }
            </div>
          ))}
        </div>
      ))}

      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button className="btn btn-primary" onClick={save} style={{padding:"11px 28px",fontSize:14}}>
          {saving?<Spinner/>:"💾 Sauvegarder toutes les modifications"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SERVICES MANAGER
───────────────────────────────────────────────────────── */
function ServicesManager({notify}){
  const[presSvcs,setPresSvcs]=useState(SEED_SERVICES_PRES);
  const[onlineSvcs,setOnlineSvcs]=useState(SEED_SERVICES_ONLINE);
  const[editingId,setEditingId]=useState(null);
  const[editVal,setEditVal]=useState({});
  const[newItem,setNewItem]=useState({icon:"📄",label:"",price:""});
  const[activeList,setActiveList]=useState("pres");
  const[confirm,setConfirm]=useState(null);

  useEffect(()=>{
    db.get("oi:svcs_pres").then(d=>d&&setPresSvcs(d));
    db.get("oi:svcs_online").then(d=>d&&setOnlineSvcs(d));
  },[]);

  const list=activeList==="pres"?presSvcs:onlineSvcs;
  const setList=activeList==="pres"?setPresSvcs:setOnlineSvcs;
  const key=activeList==="pres"?"oi:svcs_pres":"oi:svcs_online";

  function startEdit(svc){setEditingId(svc.id);setEditVal({...svc});}
  function cancelEdit(){setEditingId(null);setEditVal({});}

  async function saveEdit(){
    const u=list.map(s=>s.id===editingId?{...s,...editVal}:s);
    setList(u);await db.set(key,u);setEditingId(null);notify("Service modifié !");
  }

  function askDelete(id){setConfirm({id,type:"service"});}

  async function doDelete(){
    const u=list.filter(s=>s.id!==confirm.id);
    setList(u);await db.set(key,u);setConfirm(null);notify("Service supprimé.");
  }

  async function addItem(){
    if(!newItem.label||!newItem.price){notify("Intitulé et tarif requis.","err");return;}
    const it={...newItem,id:Date.now()};
    const u=[...list,it];setList(u);await db.set(key,u);
    setNewItem({icon:"📄",label:"",price:""});notify("Service ajouté !");
  }

  const TabBtn=({id,label})=>(
    <button onClick={()=>setActiveList(id)} style={{padding:"9px 20px",borderRadius:10,fontFamily:"inherit",fontWeight:700,fontSize:13,cursor:"pointer",background:activeList===id?T.navy:"transparent",color:activeList===id?"#fff":T.mid,border:"none",transition:"all .2s"}}>
      {label}
    </button>
  );

  return(
    <div>
      {confirm&&<ConfirmModal msg="Supprimer ce service ?" onOk={doDelete} onCancel={()=>setConfirm(null)}/>}
      <SectionHeader title="🔧 Services & Tarifs" sub="Ajoutez, modifiez ou supprimez vos services"/>

      <div style={{display:"flex",background:"#fff",borderRadius:12,padding:4,width:"fit-content",border:`1px solid ${T.line}`,gap:4,marginBottom:20}}>
        <TabBtn id="pres" label="📍 En présentiel"/>
        <TabBtn id="online" label="💻 En ligne"/>
      </div>

      {/* Liste */}
      <div className="card" style={{marginBottom:16}}>
        {list.map((s,i)=>(
          <div key={s.id} className="row-del" style={{display:"flex",gap:12,alignItems:"center",padding:"11px 0",borderBottom:i<list.length-1?`1px solid ${T.line}`:"none"}}>
            {editingId===s.id?(
              <div style={{flex:1,display:"grid",gridTemplateColumns:"60px 1fr 140px",gap:9,alignItems:"end"}}>
                <div><label style={{fontSize:11}}>Emoji</label><input value={editVal.icon} onChange={e=>setEditVal(v=>({...v,icon:e.target.value}))} style={{textAlign:"center",fontSize:18,padding:"7px"}}/></div>
                <div><label style={{fontSize:11}}>Intitulé *</label><input value={editVal.label} onChange={e=>setEditVal(v=>({...v,label:e.target.value}))}/></div>
                <div><label style={{fontSize:11}}>Tarif *</label><input value={editVal.price} onChange={e=>setEditVal(v=>({...v,price:e.target.value}))}/></div>
              </div>
            ):(
              <div style={{display:"flex",gap:12,flex:1,alignItems:"center",minWidth:0}}>
                <span style={{fontSize:22,flexShrink:0}}>{s.icon}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:T.navy2,lineHeight:1.3}}>{s.label}</div>
                  <div style={{fontSize:12,fontWeight:800,color:T.orange,marginTop:2}}>{s.price}</div>
                </div>
              </div>
            )}
            <div style={{display:"flex",gap:7,flexShrink:0}}>
              {editingId===s.id?(
                <>
                  <button className="btn btn-success btn-sm" onClick={saveEdit}>✓ OK</button>
                  <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>Annuler</button>
                </>
              ):(
                <>
                  <button className="btn btn-ghost btn-sm del-btn" onClick={()=>startEdit(s)}>✏️</button>
                  <button className="btn btn-danger btn-sm del-btn" onClick={()=>askDelete(s.id)}>🗑️</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Ajouter */}
      <div className="card" style={{background:"#FAFBFD",border:`1.5px dashed ${T.line}`}}>
        <div style={{fontSize:12,fontWeight:700,color:T.muted,marginBottom:12,display:"flex",alignItems:"center",gap:7}}>
          <span>➕</span> Ajouter un service
        </div>
        <div style={{display:"grid",gridTemplateColumns:"60px 1fr 160px auto",gap:10,alignItems:"end"}}>
          <div><label style={{fontSize:11}}>Emoji</label><input value={newItem.icon} onChange={e=>setNewItem(v=>({...v,icon:e.target.value}))} style={{textAlign:"center",fontSize:18,padding:"7px"}}/></div>
          <div><label style={{fontSize:11}}>Intitulé *</label><input value={newItem.label} onChange={e=>setNewItem(v=>({...v,label:e.target.value}))} placeholder="Nom du service"/></div>
          <div><label style={{fontSize:11}}>Tarif *</label><input value={newItem.price} onChange={e=>setNewItem(v=>({...v,price:e.target.value}))} placeholder="Ex: À partir de 25 €"/></div>
          <button className="btn btn-primary" onClick={addItem} style={{height:40}}>Ajouter</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   BOUTIQUE MANAGER
───────────────────────────────────────────────────────── */
function ShopManager({notify}){
  const[digProds,setDigProds]=useState(SEED_DIGITAL);
  const[dropProds,setDropProds]=useState(SEED_DROP);
  const[tab,setTab]=useState("digital");
  const[confirm,setConfirm]=useState(null);
  const[newDig,setNewDig]=useState({emoji:"📄",name:"",price:"",desc:"",cat:""});
  const[newDrop,setNewDrop]=useState({emoji:"📦",name:"",price:"",desc:"",cat:"",supplier:""});

  useEffect(()=>{
    db.get("oi:dig").then(d=>d&&setDigProds(d));
    db.get("oi:drop").then(d=>d&&setDropProds(d));
  },[]);

  function upP(arr,setter,key,id,field,val){
    const u=arr.map(p=>p.id===id?{...p,[field]:field==="price"?parseFloat(val)||val:val}:p);
    setter(u);db.set(key,u);
  }
  function toggleActive(arr,setter,key,id){
    const u=arr.map(p=>p.id===id?{...p,active:!p.active}:p);
    setter(u);db.set(key,u);notify(u.find(p=>p.id===id)?.active?"Produit activé":"Produit masqué");
  }
  function askDel(id,type){setConfirm({id,type});}
  async function doDel(){
    if(confirm.type==="digital"){const u=digProds.filter(p=>p.id!==confirm.id);setDigProds(u);await db.set("oi:dig",u);}
    else{const u=dropProds.filter(p=>p.id!==confirm.id);setDropProds(u);await db.set("oi:drop",u);}
    setConfirm(null);notify("Produit supprimé.");
  }
  async function addDig(){
    if(!newDig.name||!newDig.price){notify("Nom et prix requis.","err");return;}
    const u=[...digProds,{...newDig,id:Date.now(),price:parseFloat(newDig.price),active:true}];
    setDigProds(u);await db.set("oi:dig",u);setNewDig({emoji:"📄",name:"",price:"",desc:"",cat:""});notify("Produit digital ajouté !");
  }
  async function addDrop(){
    if(!newDrop.name||!newDrop.price){notify("Nom et prix requis.","err");return;}
    const u=[...dropProds,{...newDrop,id:Date.now(),price:parseFloat(newDrop.price),active:true}];
    setDropProds(u);await db.set("oi:drop",u);setNewDrop({emoji:"📦",name:"",price:"",desc:"",cat:"",supplier:""});notify("Produit dropshipping ajouté !");
  }

  const TabBtn=({id,label,count})=>(
    <button onClick={()=>setTab(id)} style={{padding:"9px 20px",borderRadius:10,fontFamily:"inherit",fontWeight:700,fontSize:13,cursor:"pointer",background:tab===id?T.navy:"transparent",color:tab===id?"#fff":T.mid,border:"none",transition:"all .2s",display:"flex",alignItems:"center",gap:7}}>
      {label} <span style={{fontSize:11,opacity:.7}}>({count})</span>
    </button>
  );

  const ProdRow=({p,arr,setter,key:k,type})=>(
    <div style={{display:"grid",gridTemplateColumns:"28px 1fr 90px 90px 90px 42px",gap:10,alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${T.line}`}}>
      <span style={{fontSize:20,textAlign:"center"}}>{p.emoji}</span>
      <div>
        <input value={p.name} onChange={e=>upP(arr,setter,k,p.id,"name",e.target.value)} style={{marginBottom:5,fontSize:13,fontWeight:600}}/>
        <input value={p.desc||""} onChange={e=>upP(arr,setter,k,p.id,"desc",e.target.value)} style={{fontSize:12,color:T.mid}}/>
      </div>
      <div><label style={{fontSize:10}}>Prix €</label><input type="number" value={p.price} onChange={e=>upP(arr,setter,k,p.id,"price",e.target.value)}/></div>
      <div><label style={{fontSize:10}}>{type==="digital"?"Fichier":"Fournisseur"}</label><input value={p.file||p.supplier||""} onChange={e=>upP(arr,setter,k,p.id,type==="digital"?"file":"supplier",e.target.value)} placeholder={type==="digital"?"guide.pdf":"https://..."}/></div>
      <button onClick={()=>toggleActive(arr,setter,k,p.id)} className={`switch ${p.active?"on":"off"}`}/>
      <button className="btn btn-danger btn-sm btn-icon" onClick={()=>askDel(p.id,type)}>🗑️</button>
    </div>
  );

  return(
    <div>
      {confirm&&<ConfirmModal msg="Supprimer ce produit ?" onOk={doDel} onCancel={()=>setConfirm(null)}/>}
      <SectionHeader title="🛍️ Gestion boutique" sub="Produits digitaux & dropshipping"/>

      <div style={{display:"flex",background:"#fff",borderRadius:12,padding:4,width:"fit-content",border:`1px solid ${T.line}`,gap:4,marginBottom:20}}>
        <TabBtn id="digital" label="📱 Produits digitaux" count={digProds.length}/>
        <TabBtn id="drop"    label="📦 Dropshipping"      count={dropProds.length}/>
      </div>

      {tab==="digital"&&(
        <div>
          <div className="card" style={{marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:T.mid,marginBottom:14,display:"flex",alignItems:"center",gap:5}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:T.orange,display:"inline-block"}}/>
              Switch = Actif/Masqué · Modifiez les champs directement
            </div>
            {digProds.map(p=><ProdRow key={p.id} p={p} arr={digProds} setter={setDigProds} key2="oi:dig" type="digital"/>)}
          </div>
          <div className="card" style={{background:"#FAFBFD",border:`1.5px dashed ${T.line}`}}>
            <div style={{fontSize:12,fontWeight:700,color:T.muted,marginBottom:11}}>➕ Nouveau produit digital</div>
            <div style={{display:"grid",gridTemplateColumns:"45px 1fr 80px 100px 80px auto",gap:9}}>
              {[{k:"emoji",ph:"📄"},{k:"name",ph:"Nom du produit"},{k:"price",ph:"Prix €"},{k:"cat",ph:"Catégorie"},{k:"desc",ph:"Description"}].map(({k,ph})=>(
                <input key={k} placeholder={ph} value={newDig[k]} onChange={e=>setNewDig(v=>({...v,[k]:e.target.value}))}/>
              ))}
              <button className="btn btn-primary" onClick={addDig} style={{height:40,flexShrink:0}}>+</button>
            </div>
          </div>
        </div>
      )}

      {tab==="drop"&&(
        <div>
          <div className="card" style={{marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:T.mid,marginBottom:14,display:"flex",alignItems:"center",gap:5}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:T.blue,display:"inline-block"}}/>
              Lien fournisseur = URL vers la commande dropshipping
            </div>
            {dropProds.map(p=><ProdRow key={p.id} p={p} arr={dropProds} setter={setDropProds} key2="oi:drop" type="drop"/>)}
          </div>
          <div className="card" style={{background:"#FAFBFD",border:`1.5px dashed ${T.line}`}}>
            <div style={{fontSize:12,fontWeight:700,color:T.muted,marginBottom:11}}>➕ Nouveau produit dropshipping</div>
            <div style={{display:"grid",gridTemplateColumns:"45px 1fr 80px 100px 1fr auto",gap:9}}>
              {[{k:"emoji",ph:"📦"},{k:"name",ph:"Nom"},{k:"price",ph:"Prix €"},{k:"cat",ph:"Catégorie"},{k:"supplier",ph:"Lien fournisseur (https://...)"}].map(({k,ph})=>(
                <input key={k} placeholder={ph} value={newDrop[k]} onChange={e=>setNewDrop(v=>({...v,[k]:e.target.value}))}/>
              ))}
              <button className="btn btn-primary" onClick={addDrop} style={{height:40,flexShrink:0}}>+</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   BOOKINGS
───────────────────────────────────────────────────────── */
function BookingsManager({data,setData,notify}){
  const{bookings,setBookings}=data;
  const[filter,setFilter]=useState("Tous");
  const STATUSES=["Tous","En attente","Confirmé","Annulé"];

  async function updateStatus(id,s){
    const u=bookings.map(b=>b.id===id?{...b,status:s}:b);
    setBookings(u);await db.set("oi:b",u);notify(`→ ${s}`);
  }

  const filtered=filter==="Tous"?bookings:bookings.filter(b=>b.status===filter);
  const counts={tous:bookings.length,"En attente":bookings.filter(b=>b.status==="En attente").length,"Confirmé":bookings.filter(b=>b.status==="Confirmé").length,"Annulé":bookings.filter(b=>b.status==="Annulé").length};

  return(
    <div>
      <SectionHeader title="📅 Demandes de rendez-vous" sub={`${bookings.length} demande(s) · ${counts["En attente"]} en attente`}/>

      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {STATUSES.map(s=>(
          <button key={s} onClick={()=>setFilter(s)} style={{padding:"7px 16px",borderRadius:10,fontFamily:"inherit",fontWeight:700,fontSize:12,cursor:"pointer",background:filter===s?T.navy:"#fff",color:filter===s?"#fff":T.mid,border:`1px solid ${filter===s?T.navy:T.line}`,transition:"all .2s"}}>
            {s} <span style={{opacity:.65}}>({s==="Tous"?counts.tous:counts[s]||0})</span>
          </button>
        ))}
      </div>

      {filtered.length===0
        ?<EmptyState icon="📭" msg="Aucune demande" sub="Les nouvelles demandes apparaîtront ici"/>
        :<div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtered.map(b=>(
            <div key={b.id} className="card afu" style={{padding:"16px 20px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{width:42,height:42,borderRadius:12,background:T.purple+"14",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>📅</div>
                  <div>
                    <div style={{fontWeight:800,color:T.navy2,fontSize:14,marginBottom:2}}>{b.prenom} {b.nom}</div>
                    <div style={{fontSize:13,fontWeight:600,color:T.orange,marginBottom:4}}>{b.service||"Diagnostic gratuit"}</div>
                    <div style={{display:"flex",gap:12,flexWrap:"wrap",fontSize:12,color:T.muted}}>
                      {b.date&&<span>📅 {b.date}{b.time&&` à ${b.time}`}</span>}
                      {b.phone&&<span>📞 {b.phone}</span>}
                      {b.email&&<span>✉️ {b.email}</span>}
                    </div>
                    {b.serviceDesc&&<div style={{fontSize:12,color:T.mid,marginTop:5,fontStyle:"italic",maxWidth:420}}>"{b.serviceDesc?.slice(0,80)}"</div>}
                  </div>
                </div>
                <div style={{display:"flex",gap:7,flexDirection:"column",alignItems:"flex-end"}}>
                  <StatusBadge status={b.status}/>
                  <div style={{display:"flex",gap:5,marginTop:4}}>
                    {["En attente","Confirmé","Annulé"].filter(s=>s!==b.status).map(s=>(
                      <button key={s} className="btn btn-ghost btn-sm" onClick={()=>updateStatus(b.id,s)}>→ {s}</button>
                    ))}
                  </div>
                  <div style={{fontSize:10,color:T.muted,marginTop:2}}>Reçu le {b.createdAt}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ORDERS
───────────────────────────────────────────────────────── */
function OrdersManager({orders}){
  const revenue=orders.reduce((s,o)=>s+(o.price||0),0);
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24}}>
        {[
          {icon:"🧾",label:"Total commandes",value:orders.length,color:T.orange},
          {icon:"💶",label:"Revenus",value:`${revenue.toFixed(2)} €`,color:T.green},
          {icon:"🚚",label:"Dropshipping",value:orders.filter(o=>o.isDrop).length,color:T.blue},
        ].map(({icon,label,value,color},i)=>(
          <StatCard key={i} icon={icon} label={label} value={value} color={color} delay={`afu-${i+1}`}/>
        ))}
      </div>
      <div className="card">
        <SectionHeader title="🧾 Commandes"/>
        {orders.length===0
          ?<EmptyState icon="📭" msg="Aucune commande"/>
          :<div style={{overflowX:"auto"}}>
            <table className="table">
              <thead><tr>{["Client","Produit","Prix","Date","Type","Statut"].map(h=><th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {orders.map(o=>(
                  <tr key={o.id}>
                    <td><div style={{fontWeight:700,color:T.navy2}}>{o.clientName}</div><div style={{fontSize:11,color:T.muted}}>{o.clientEmail}</div></td>
                    <td style={{color:T.mid,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.productName}</td>
                    <td style={{fontWeight:800,color:T.orange}}>{o.price} €</td>
                    <td style={{color:T.muted,fontSize:12}}>{o.date}</td>
                    <td><span className={`badge ${o.isDrop?"badge-blue":"badge-purple"}`}>{o.isDrop?"🚚 Physique":"📱 Digital"}</span></td>
                    <td><StatusBadge status={o.status}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CLIENTS MANAGER
───────────────────────────────────────────────────────── */
function ClientsManager({data,notify}){
  const{clients,setClients,orders}=data;
  const[search,setSearch]=useState("");
  const[resetEmail,setResetEmail]=useState("");
  const[resetPwd,setResetPwd]=useState("");
  const[loading,setLoading]=useState(false);

  const filtered=clients.filter(c=>
    !search||(c.name.toLowerCase().includes(search.toLowerCase())||c.email.toLowerCase().includes(search.toLowerCase()))
  );

  async function doReset(){
    if(!resetEmail||!resetPwd){notify("Email et nouveau mot de passe requis.","err");return;}
    const i=clients.findIndex(c=>c.email===resetEmail);
    if(i===-1){notify("Client introuvable.","err");return;}
    setLoading(true);
    await new Promise(r=>setTimeout(r,400));
    const u=[...clients];u[i]={...u[i],password:resetPwd};
    setClients(u);await db.set("oi:c",u);
    setLoading(false);setResetEmail("");setResetPwd("");
    notify("Mot de passe réinitialisé !");
  }

  return(
    <div>
      <SectionHeader title="👥 Clients" sub={`${clients.length} client(s) inscrit(s)`}/>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
        {/* Recherche */}
        <div className="card">
          <div style={{fontSize:13,fontWeight:700,color:T.navy2,marginBottom:12}}>🔍 Rechercher un client</div>
          <input placeholder="Nom ou email..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        {/* Reset pwd */}
        <div className="card" style={{borderLeft:`4px solid ${T.orange}`}}>
          <div style={{fontSize:13,fontWeight:700,color:T.navy2,marginBottom:12}}>🔑 Réinitialiser un mot de passe</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:9,alignItems:"end"}}>
            <div><label style={{fontSize:11}}>Email client</label><input placeholder="email@..." value={resetEmail} onChange={e=>setResetEmail(e.target.value)}/></div>
            <div><label style={{fontSize:11}}>Nouveau mot de passe</label><input type="password" placeholder="••••••••" value={resetPwd} onChange={e=>setResetPwd(e.target.value)}/></div>
            <button className="btn btn-primary" onClick={doReset} style={{height:40}}>{loading?<Spinner/>:"OK"}</button>
          </div>
        </div>
      </div>

      {filtered.length===0
        ?<EmptyState icon="👥" msg="Aucun client trouvé"/>
        :<div className="card">
          <table className="table">
            <thead><tr>{["Client","Email","Téléphone","Inscrit le","Dépenses","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(c=>{
                const co=orders.filter(o=>o.clientEmail===c.email);
                const spent=co.reduce((s,o)=>s+(o.price||0),0);
                return(
                  <tr key={c.id}>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <div style={{width:34,height:34,borderRadius:10,background:T.navy+"14",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:T.navy,fontSize:13,flexShrink:0}}>
                          {c.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                        </div>
                        <div style={{fontWeight:700,color:T.navy2}}>{c.name}</div>
                      </div>
                    </td>
                    <td style={{color:T.mid,fontSize:12}}>{c.email}</td>
                    <td style={{color:T.mid,fontSize:12}}>{c.phone||"—"}</td>
                    <td style={{color:T.muted,fontSize:12}}>{c.createdAt}</td>
                    <td>
                      <div style={{fontWeight:700,color:T.orange}}>{spent.toFixed(2)} €</div>
                      <div style={{fontSize:11,color:T.muted}}>{co.length} cmd</div>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={()=>setResetEmail(c.email)}>🔑 MDP</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   DOCS SHARING
───────────────────────────────────────────────────────── */
function DocsManager({data,notify}){
  const{clients,clientDocs,setClientDocs}=data;
  const[sel,setSel]=useState("");
  const[name,setName]=useState("");
  const[url,setUrl]=useState("");
  const[note,setNote]=useState("");
  const[sending,setSending]=useState(false);

  async function share(){
    if(!sel||!name){notify("Sélectionnez un client et nommez le document.","err");return;}
    setSending(true);
    await new Promise(r=>setTimeout(r,500));
    const cur=clientDocs[sel]||[];
    const doc={id:Date.now(),name,url,note,date:new Date().toLocaleDateString("fr-FR")};
    const upd={...clientDocs,[sel]:[...cur,doc]};
    setClientDocs(upd);await db.set("oi:cd",upd);
    setSending(false);setName("");setUrl("");setNote("");
    notify(`✅ Document partagé avec ${clients.find(c=>c.email===sel)?.name||sel}`);
  }

  async function removeDoc(email,docId){
    const upd={...clientDocs,[email]:(clientDocs[email]||[]).filter(d=>d.id!==docId)};
    setClientDocs(upd);await db.set("oi:cd",upd);notify("Document supprimé.");
  }

  const totalDocs=Object.values(clientDocs).reduce((s,v)=>s+v.length,0);

  return(
    <div>
      <SectionHeader title="📁 Partage de documents" sub={`${totalDocs} document(s) partagé(s) avec vos clients`}/>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
        <div className="card" style={{borderTop:`4px solid ${T.orange}`}}>
          <div style={{fontSize:14,fontWeight:800,color:T.navy2,marginBottom:18}}>📤 Envoyer un document</div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <div>
              <label>Client *</label>
              <select value={sel} onChange={e=>setSel(e.target.value)}>
                <option value="">Choisir un client…</option>
                {clients.map(c=><option key={c.email} value={c.email}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label>Nom du document *</label>
              <input placeholder="Ex: Devis archivage 2026" value={name} onChange={e=>setName(e.target.value)}/>
            </div>
          </div>

          <div style={{marginBottom:12}}>
            <label>Lien de téléchargement (URL)</label>
            <input placeholder="https://drive.google.com/..." value={url} onChange={e=>setUrl(e.target.value)}/>
            <div style={{fontSize:11,color:T.muted,marginTop:4}}>Hébergez sur Google Drive, Dropbox ou OneDrive et collez le lien.</div>
          </div>

          <div style={{marginBottom:18}}>
            <label>Note pour le client (facultatif)</label>
            <textarea placeholder="Ex: Voici votre devis, n'hésitez pas à me contacter…" rows={2} value={note} onChange={e=>setNote(e.target.value)} style={{resize:"vertical"}}/>
          </div>

          <button className="btn btn-primary" onClick={share} style={{width:"100%",justifyContent:"center",padding:"12px"}}>
            {sending?<Spinner/>:"📤 Partager le document"}
          </button>
        </div>

        {/* Stats */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {clients.slice(0,4).map(c=>{
            const docs=clientDocs[c.email]||[];
            return(
              <div key={c.email} className="card-sm" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <div style={{width:36,height:36,borderRadius:10,background:T.navy+"12",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:T.navy,fontSize:12,flexShrink:0}}>
                    {c.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{fontWeight:700,color:T.navy2,fontSize:13}}>{c.name}</div>
                    <div style={{fontSize:11,color:T.muted}}>{docs.length} document{docs.length!==1?"s":""}</div>
                  </div>
                </div>
                {docs.length>0&&(
                  <button className="btn btn-ghost btn-sm" onClick={()=>setSel(c.email)}>Sélectionner</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Liste des docs partagés */}
      {Object.keys(clientDocs).length>0&&(
        <div className="card">
          <div style={{fontSize:14,fontWeight:800,color:T.navy2,marginBottom:18}}>📚 Historique des partages</div>
          {Object.entries(clientDocs).map(([email,docs])=>{
            if(!docs.length)return null;
            const cli=clients.find(c=>c.email===email);
            return(
              <div key={email} style={{marginBottom:20}}>
                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:10,paddingBottom:9,borderBottom:`1px solid ${T.line}`}}>
                  <div style={{width:30,height:30,borderRadius:8,background:T.blue+"14",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:T.blue,fontSize:11}}>
                    {(cli?.name||email).split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                  </div>
                  <div style={{fontWeight:700,color:T.navy2,fontSize:13}}>{cli?.name||email}</div>
                  <span className="badge badge-blue">{docs.length} doc{docs.length>1?"s":""}</span>
                </div>
                {docs.map(doc=>(
                  <div key={doc.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:T.cream,borderRadius:10,marginBottom:7}}>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <span style={{fontSize:20}}>📄</span>
                      <div>
                        <div style={{fontWeight:700,color:T.navy2,fontSize:13}}>{doc.name}</div>
                        <div style={{fontSize:11,color:T.muted}}>Partagé le {doc.date}{doc.note&&` · ${doc.note.slice(0,50)}`}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:7}}>
                      {doc.url&&<a href={doc.url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{textDecoration:"none",color:T.blue}}>↗ Voir</a>}
                      <button className="btn btn-danger btn-sm" onClick={()=>removeDoc(email,doc.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SETTINGS
───────────────────────────────────────────────────────── */
function Settings({notify}){
  const[pwd,setPwd]=useState({cur:"",next:"",confirm:""});
  const[saved,setSaved]=useState(false);

  async function changePwd(){
    if(pwd.cur!=="Admin2024!"){notify("Mot de passe actuel incorrect.","err");return;}
    if(pwd.next.length<6){notify("Le nouveau mot de passe doit faire 6 caractères min.","err");return;}
    if(pwd.next!==pwd.confirm){notify("Les mots de passe ne correspondent pas.","err");return;}
    await db.set("oi:adminpwd",pwd.next);
    setPwd({cur:"",next:"",confirm:""});setSaved(true);setTimeout(()=>setSaved(false),3000);
    notify("Mot de passe administrateur mis à jour !");
  }

  const INTEGRATIONS=[
    {name:"Stripe",desc:"Paiements sécurisés",status:"À configurer",color:T.blue,icon:"💳"},
    {name:"Brevo",desc:"Emails transactionnels",status:"À configurer",color:T.green,icon:"📧"},
    {name:"Twilio",desc:"SMS de vérification",status:"Simulé",color:T.orange,icon:"📱"},
    {name:"Google Calendar",desc:"Synchronisation créneaux",status:"À configurer",color:T.red,icon:"📅"},
    {name:"Cal.com",desc:"Réservation en ligne",status:"À configurer",color:T.purple,icon:"🗓️"},
  ];

  return(
    <div>
      <SectionHeader title="⚙️ Paramètres" sub="Configuration du site et des intégrations"/>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {/* Sécurité */}
        <div className="card">
          <div style={{fontSize:14,fontWeight:800,color:T.navy2,marginBottom:18,display:"flex",alignItems:"center",gap:8}}>
            🔒 Sécurité du compte admin
          </div>
          <div style={{marginBottom:12}}><label>Mot de passe actuel</label><input type="password" value={pwd.cur} onChange={e=>setPwd(v=>({...v,cur:e.target.value}))}/></div>
          <div style={{marginBottom:12}}><label>Nouveau mot de passe</label><input type="password" value={pwd.next} onChange={e=>setPwd(v=>({...v,next:e.target.value}))}/></div>
          <div style={{marginBottom:18}}><label>Confirmer</label><input type="password" value={pwd.confirm} onChange={e=>setPwd(v=>({...v,confirm:e.target.value}))}/></div>
          <button className="btn btn-navy" onClick={changePwd} style={{width:"100%",justifyContent:"center"}}>Changer le mot de passe</button>
          {saved&&<div style={{marginTop:10,fontSize:12,color:T.green,fontWeight:700,textAlign:"center"}}>✓ Sauvegardé</div>}
        </div>

        {/* Informations */}
        <div className="card">
          <div style={{fontSize:14,fontWeight:800,color:T.navy2,marginBottom:18}}>🏢 Informations entreprise</div>
          {[["Entreprise","ORD'IMPACT"],["SIRET","103 314 258 00015"],["Statut","Micro-entreprise"],["TVA","Non applicable — Art. 293B CGI"],["Gérante","Chawanda"],["Adresse","44 Rue Albert Darnal, 97300 Cayenne"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.line}`,fontSize:13}}>
              <span style={{color:T.muted,fontWeight:600}}>{k}</span>
              <span style={{color:T.navy2,fontWeight:700}}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Intégrations */}
      <div className="card" style={{marginTop:16}}>
        <div style={{fontSize:14,fontWeight:800,color:T.navy2,marginBottom:18}}>🔌 Intégrations & services tiers</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
          {INTEGRATIONS.map(({name,desc,status,color,icon})=>(
            <div key={name} style={{background:T.cream,borderRadius:12,padding:"14px 16px",border:`1px solid ${T.line}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:18}}>{icon}</span>
                  <span style={{fontWeight:700,color:T.navy2,fontSize:13}}>{name}</span>
                </div>
                <span className={`badge ${status==="Simulé"?"badge-orange":"badge-gray"}`}>{status}</span>
              </div>
              <div style={{fontSize:12,color:T.muted}}>{desc}</div>
              <div style={{marginTop:10,fontSize:11,color:T.muted,fontStyle:"italic"}}>Clé API à configurer dans le fichier .env</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────────────────────── */
export default function Dashboard(){
  const[tab,setTab]=useState("overview");
  const[toast,setToast]=useState(null);
  const[loading,setLoading]=useState(true);

  // Global state
  const[siteData,setSiteData]=useState({heroTitle:"L'administration simplifiée.",heroSub:"Parce que la paperasse ne devrait pas vous bloquer.",aboutTitle:"8 ans d'expertise à votre service",aboutText:"Titulaire d'un BAC PRO ARCU obtenu en 2017, j'accompagne particuliers et professionnels en Guyane depuis 8 ans.",aboutMission:"Mon objectif : vous éviter les tracas administratifs.",phone:"06 94 47 33 22",email:"ordimpact@gmail.com",waNumber:"33694473322",instagram:"https://www.instagram.com/ordimpact"});
  const[bookings,setBookings]=useState(SEED_BOOKINGS);
  const[orders,setOrders]=useState(SEED_ORDERS);
  const[clients,setClients]=useState(SEED_CLIENTS);
  const[clientDocs,setClientDocs]=useState({});
  const[visitors,setVisitors]=useState(127);

  useEffect(()=>{
    (async()=>{
      const[b,o,c,sd,cd,v]=await Promise.all([db.get("oi:b"),db.get("oi:o"),db.get("oi:c"),db.get("oi:sd"),db.get("oi:cd"),db.get("oi:v")]);
      if(b)setBookings(b);if(o)setOrders(o);if(c)setClients(c);
      if(sd)setSiteData(prev=>({...prev,...sd}));
      if(cd)setClientDocs(cd);if(v)setVisitors(v);
      setLoading(false);
    })();
  },[]);

  function notify(msg,type="ok"){
    setToast({msg,type});setTimeout(()=>setToast(null),3200);
  }

  const NAV=[
    {section:"PRINCIPAL"},
    {id:"overview",icon:"📊",label:"Vue d'ensemble"},
    {section:"CONTENU"},
    {id:"content", icon:"✏️", label:"Modifier le site"},
    {id:"services",icon:"🔧",label:"Services & Tarifs"},
    {id:"shop",    icon:"🛍️",label:"Boutique"},
    {section:"CLIENTS"},
    {id:"bookings",icon:"📅",label:"Demandes",count:bookings.filter(b=>b.status==="En attente").length},
    {id:"orders",  icon:"🧾",label:"Commandes",count:orders.length},
    {id:"clients", icon:"👥",label:"Clients",count:clients.length},
    {id:"docs",    icon:"📁",label:"Documents partagés"},
    {section:"SYSTÈME"},
    {id:"settings",icon:"⚙️",label:"Paramètres"},
  ];

  const DATA={bookings,setBookings,orders,setOrders,clients,setClients,clientDocs,setClientDocs,visitors};

  if(loading)return(
    <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F0F4FA",flexDirection:"column",gap:14}}>
      <div style={{width:48,height:48,borderRadius:14,background:"#001E50",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{width:24,height:24,border:"3px solid rgba(255,255,255,.2)",borderTopColor:"#F47820",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
      </div>
      <div style={{fontSize:13,color:T.muted,fontWeight:600}}>Chargement du dashboard…</div>
    </div>
  );

  return(
    <div style={{fontFamily:"'Sora',system-ui,sans-serif"}}>
      <style>{CSS}</style>
      <Toast t={toast}/>

      <div className="layout">
        {/* ──── SIDEBAR ──── */}
        <aside className="sidebar">
          {/* Brand */}
          <div style={{padding:"20px 18px 16px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:38,height:38,borderRadius:11,background:"rgba(244,120,32,.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg width="22" height="22" viewBox="0 0 80 80" fill="none">
                  <path d="M40 12 A28 28 0 0 1 68 40" stroke="#F47820" strokeWidth="7" strokeLinecap="round" fill="none"/>
                  <path d="M40 12 A28 28 0 1 0 68 40" stroke="#1E96D2" strokeWidth="7" strokeLinecap="round" fill="none"/>
                  <rect x="37" y="16" width="6" height="48" rx="3" fill="white"/>
                </svg>
              </div>
              <div>
                <div style={{fontWeight:900,fontSize:15,color:"#fff",letterSpacing:-.3}}>ORD'IMPACT</div>
                <div style={{fontSize:9,color:"#F47820",fontWeight:600,fontStyle:"italic",opacity:.8}}>Dashboard Admin</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav style={{flex:1,padding:"8px 0"}}>
            {NAV.map((item,i)=>{
              if(item.section)return(
                <div key={i} className="nav-section">{item.section}</div>
              );
              const active=tab===item.id;
              return(
                <button key={item.id} className={`nav-item${active?" active":""}`} onClick={()=>setTab(item.id)}>
                  <span style={{fontSize:16,flexShrink:0}}>{item.icon}</span>
                  <span style={{flex:1}}>{item.label}</span>
                  {item.count>0&&<span className="badge">{item.count}</span>}
                </button>
              );
            })}
          </nav>

          {/* Footer sidebar */}
          <div style={{padding:"14px 18px",borderTop:"1px solid rgba(255,255,255,.08)"}}>
            <div style={{display:"flex",align:"center",gap:9}}>
              <div style={{width:32,height:32,borderRadius:9,background:"rgba(244,120,32,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>👩</div>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.85)"}}>Chawanda</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.35)"}}>Administratrice</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ──── MAIN ──── */}
        <div className="main">
          {/* Topbar */}
          <div className="topbar">
            <div>
              <div style={{fontSize:15,fontWeight:800,color:T.navy2}}>
                {NAV.find(n=>n.id===tab)?.icon} {NAV.find(n=>n.id===tab)?.label}
              </div>
              <div style={{fontSize:11,color:T.muted,marginTop:1}}>
                {new Date().toLocaleDateString("fr-FR",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:12,color:T.muted,fontWeight:600}}>{visitors} visiteurs ce mois</span>
              <div style={{width:8,height:8,borderRadius:"50%",background:T.green,animation:"pulse2 2s infinite"}}/>
              <button className="btn btn-ghost btn-sm" onClick={()=>window.location.reload()}>↺ Actualiser</button>
            </div>
          </div>

          {/* Content */}
          <div className="content">
            <div key={tab} className="afu">
              {tab==="overview" && <Overview data={DATA} setTab={setTab}/>}
              {tab==="content"  && <ContentEditor siteData={siteData} setSiteData={setSiteData} notify={notify}/>}
              {tab==="services" && <ServicesManager notify={notify}/>}
              {tab==="shop"     && <ShopManager notify={notify}/>}
              {tab==="bookings" && <BookingsManager data={DATA} setData={setBookings} notify={notify}/>}
              {tab==="orders"   && <OrdersManager orders={orders}/>}
              {tab==="clients"  && <ClientsManager data={DATA} notify={notify}/>}
              {tab==="docs"     && <DocsManager data={DATA} notify={notify}/>}
              {tab==="settings" && <Settings notify={notify}/>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
