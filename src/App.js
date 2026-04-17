import { useState, useEffect, useRef } from "react";

/* ── Brand colors extracted from logo ── */
const C = {
  navy:    "#1a1f3a",
  navyDark:"#0f1224",
  navyMid: "#161b33",
  orange:  "#e8622a",
  orangeL: "#f07a45",
  amber:   "#f5a623",
  cream:   "#fdf6f0",
  muted:   "#8a90aa",
};

/* ── Particle field ── */
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,98,42,${d.opacity})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />;
}

/* ── Flame SVG matching the logo ── */
function FlameLogo({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" fill={C.navy} stroke={C.orange} strokeWidth="1.5" strokeOpacity="0.6" />
      {/* outer flame */}
      <path d="M40 14 C40 14 56 26 59 38 C62 50 55 57 49 63 C46 67 48 74 53 77 C41 72 37 64 39 55 C37 64 29 72 17 77 C22 74 24 67 21 63 C15 57 8 50 11 38 C14 26 40 14 40 14Z" fill={C.orange} />
      {/* mid flame */}
      <path d="M40 26 C40 26 51 35 53 44 C55 53 49 58 45 62 C43 56 45 49 41 45 C39 52 33 57 31 62 C27 58 21 53 23 44 C25 35 40 26 40 26Z" fill={C.amber} />
      {/* inner */}
      <path d="M40 38 C40 38 46 44 47 51 C48 56 44 60 40 62 C36 60 32 56 33 51 C34 44 40 38 40 38Z" fill="#fff8e7" />
      {/* sparks */}
      <circle cx="57" cy="24" r="2.5" fill={C.amber} opacity="0.9" />
      <circle cx="63" cy="34" r="1.5" fill={C.orange} opacity="0.7" />
      <circle cx="23" cy="26" r="2" fill={C.amber} opacity="0.8" />
      <circle cx="17" cy="37" r="1.2" fill={C.orange} opacity="0.6" />
      <circle cx="51" cy="16" r="1.2" fill="#fff8e7" opacity="0.9" />
      <circle cx="29" cy="17" r="1.2" fill="#fff8e7" opacity="0.8" />
    </svg>
  );
}

/* ── Countdown ── */
function useCountdown(targetDate) {
  const calc = () => {
    const diff = targetDate - Date.now();
    if (diff <= 0) return { d:0,h:0,m:0,s:0 };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, []);
  return t;
}

function CountUnit({ value, label }) {
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{
        fontFamily:"Georgia, serif",
        fontSize:"clamp(2.2rem, 5vw, 3.8rem)",
        fontWeight:700,
        color: C.cream,
        lineHeight:1,
        minWidth:"2.5ch",
        letterSpacing:-2,
        transition:"all 0.3s",
      }}>
        {String(value).padStart(2,"0")}
      </div>
      <div style={{ fontSize:"0.7rem", color: C.muted, letterSpacing:3, textTransform:"uppercase", marginTop:6 }}>
        {label}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ color: C.orange, fontSize:"1.8rem", opacity:0.5, alignSelf:"flex-start", marginTop:"0.5rem" }}>:</div>
  );
}

/* ── Email form ── */
function EmailForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    if (!email.includes("@") || !email.includes(".")) {
      setError("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{
        display:"flex", alignItems:"center", gap:12,
        background:"rgba(232,98,42,0.12)",
        border:`1px solid ${C.orange}55`,
        borderRadius:16, padding:"16px 24px",
        animation:"fadeUp 0.5s ease",
      }}>
        <span style={{ fontSize:"1.5rem" }}>🎉</span>
        <div>
          <div style={{ color: C.cream, fontWeight:600, fontSize:"0.95rem" }}>Du bist dabei!</div>
          <div style={{ color: C.muted, fontSize:"0.8rem", marginTop:2 }}>
            Wir benachrichtigen dich sobald wir live gehen.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:220, position:"relative" }}>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="deine@email.de"
            style={{
              width:"100%",
              padding:"14px 18px",
              borderRadius:12,
              border:`1.5px solid ${focused ? C.orange : "rgba(255,255,255,0.12)"}`,
              background:"rgba(255,255,255,0.06)",
              color: C.cream,
              fontSize:"0.95rem",
              outline:"none",
              transition:"border-color 0.2s",
              fontFamily:"inherit",
            }}
          />
        </div>
        <button
          onClick={handleSubmit}
          style={{
            padding:"14px 28px",
            borderRadius:12,
            border:"none",
            background:`linear-gradient(135deg, ${C.orange}, ${C.orangeL})`,
            color:"#fff",
            fontSize:"0.95rem",
            fontWeight:700,
            cursor:"pointer",
            whiteSpace:"nowrap",
            letterSpacing:0.3,
            transition:"transform 0.15s, opacity 0.15s",
            fontFamily:"inherit",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >
          Benachrichtigen →
        </button>
      </div>
      {error && (
        <div style={{ color:"#ff7070", fontSize:"0.78rem", marginTop:6, paddingLeft:4 }}>{error}</div>
      )}
      <div style={{ color: C.muted, fontSize:"0.72rem", marginTop:10, paddingLeft:4 }}>
        🔒 Kein Spam. Nur eine E-Mail wenn wir live gehen. DSGVO-konform.
      </div>
    </div>
  );
}

/* ── Feature pill ── */
function Feature({ icon, text }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:8,
      background:"rgba(255,255,255,0.04)",
      border:"0.5px solid rgba(255,255,255,0.08)",
      borderRadius:30, padding:"8px 16px",
      fontSize:"0.8rem", color: C.muted,
      whiteSpace:"nowrap",
    }}>
      <span style={{ fontSize:"0.95rem" }}>{icon}</span>
      {text}
    </div>
  );
}

/* ── Social link ── */
function SocialLink({ href, label, icon }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:"flex", alignItems:"center", gap:8,
        padding:"10px 18px",
        borderRadius:10,
        border:`0.5px solid ${hov ? C.orange + "88" : "rgba(255,255,255,0.1)"}`,
        background: hov ? "rgba(232,98,42,0.08)" : "rgba(255,255,255,0.03)",
        color: hov ? C.orange : C.muted,
        fontSize:"0.82rem", fontWeight:500,
        textDecoration:"none",
        transition:"all 0.2s",
      }}
    >
      <span style={{ fontSize:"1rem" }}>{icon}</span>
      {label}
    </a>
  );
}

/* ── Main ── */
export default function ComingSoon() {
  // Launch date: 60 days from a fixed point
  const launchDate = new Date("2026-06-17T00:00:00");
  const { d, h, m, s } = useCountdown(launchDate);

  const [signupCount] = useState(1284);

  return (
    <div style={{
      minHeight:"100vh",
      background: C.navyDark,
      position:"relative",
      overflow:"hidden",
      fontFamily:"'Segoe UI', system-ui, -apple-system, sans-serif",
      color: C.cream,
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes flameFlicker {
          0%,100% { transform: scaleY(1) scaleX(1); }
          30%     { transform: scaleY(1.04) scaleX(0.97); }
          60%     { transform: scaleY(0.97) scaleX(1.02); }
        }
        @keyframes pulse {
          0%,100% { opacity:1; }
          50%     { opacity:0.6; }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .anim-1 { animation: fadeUp 0.7s ease 0.1s both; }
        .anim-2 { animation: fadeUp 0.7s ease 0.25s both; }
        .anim-3 { animation: fadeUp 0.7s ease 0.4s both; }
        .anim-4 { animation: fadeUp 0.7s ease 0.55s both; }
        .anim-5 { animation: fadeUp 0.7s ease 0.7s both; }
        .anim-6 { animation: fadeUp 0.7s ease 0.85s both; }
        .flame-anim { animation: flameFlicker 3s ease-in-out infinite; }
        input::placeholder { color: rgba(138,144,170,0.6); }
      `}</style>

      {/* Particle field */}
      <Particles />

      {/* Background glow blobs */}
      <div style={{
        position:"absolute", top:"-15%", right:"-10%",
        width:"50vw", height:"50vw", maxWidth:700,
        borderRadius:"50%",
        background:`radial-gradient(circle, ${C.orange}18 0%, transparent 70%)`,
        pointerEvents:"none",
      }} />
      <div style={{
        position:"absolute", bottom:"-20%", left:"-15%",
        width:"60vw", height:"60vw", maxWidth:800,
        borderRadius:"50%",
        background:`radial-gradient(circle, ${C.navy}cc 0%, transparent 70%)`,
        pointerEvents:"none",
      }} />

      {/* Decorative ring top-right */}
      <div style={{
        position:"absolute", top:40, right:60,
        width:180, height:180,
        borderRadius:"50%",
        border:`1px solid ${C.orange}22`,
        pointerEvents:"none",
      }} />
      <div style={{
        position:"absolute", top:55, right:75,
        width:150, height:150,
        borderRadius:"50%",
        border:`1px solid ${C.orange}11`,
        pointerEvents:"none",
      }} />

      {/* Main content */}
      <div style={{
        position:"relative", zIndex:10,
        maxWidth:760,
        margin:"0 auto",
        padding:"clamp(2rem, 6vw, 5rem) 1.5rem",
        minHeight:"100vh",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
      }}>

        {/* Logo row */}
        <div className="anim-1" style={{
          display:"flex", alignItems:"center", gap:18, marginBottom:"2.5rem",
        }}>
          <div className="flame-anim">
            <FlameLogo size={72} />
          </div>
          <div>
            <div style={{
              fontFamily:"Georgia, 'Times New Roman', serif",
              fontSize:"clamp(2rem, 5vw, 3rem)",
              fontWeight:700,
              lineHeight:1,
              letterSpacing:-1,
            }}>
              Schnäpp<span style={{ color: C.orange }}>chen</span>
            </div>
            <div style={{
              fontSize:"0.7rem", color: C.muted,
              letterSpacing:4, textTransform:"uppercase",
              marginTop:4,
            }}>
              Deals · Gutscheine · Rabatte
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div className="anim-2" style={{ marginBottom:"1.5rem" }}>
          <span style={{
            display:"inline-flex", alignItems:"center", gap:6,
            background:"rgba(232,98,42,0.12)",
            border:`1px solid ${C.orange}44`,
            borderRadius:20,
            padding:"6px 16px",
            fontSize:"0.75rem", color: C.orange,
            fontWeight:600, letterSpacing:1,
            textTransform:"uppercase",
          }}>
            <span style={{ display:"inline-block", width:6, height:6, borderRadius:"50%", background:C.orange, animation:"pulse 1.5s infinite" }} />
            Bald verfügbar
          </span>
        </div>

        {/* Headline */}
        <div className="anim-2" style={{ marginBottom:"1rem" }}>
          <h1 style={{
            fontFamily:"Georgia, 'Times New Roman', serif",
            fontSize:"clamp(2rem, 6vw, 3.8rem)",
            fontWeight:700,
            lineHeight:1.1,
            letterSpacing:-1,
            margin:0,
            color: C.cream,
          }}>
            Deutschlands klügste<br />
            <span style={{ color: C.orange }}>Deal-Plattform</span> kommt.
          </h1>
        </div>

        {/* Subline */}
        <div className="anim-3" style={{ marginBottom:"2.5rem" }}>
          <p style={{
            fontSize:"1rem", color: C.muted,
            lineHeight:1.7, margin:0, maxWidth:540,
          }}>
            Verifizierte Gutscheine, echte Ersparnisse und ein KI-Assistent der für dich die besten Deals findet — alles an einem Ort. Für Deutschland gemacht.
          </p>
        </div>

        {/* Countdown */}
        <div className="anim-3" style={{ marginBottom:"2.5rem" }}>
          <div style={{
            display:"inline-block",
            background:"rgba(255,255,255,0.04)",
            border:"0.5px solid rgba(255,255,255,0.08)",
            borderRadius:20,
            padding:"24px 32px",
          }}>
            <div style={{
              fontSize:"0.65rem", color: C.muted,
              letterSpacing:3, textTransform:"uppercase",
              marginBottom:16, textAlign:"center",
            }}>
              Launch in
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <CountUnit value={d} label="Tage" />
              <Divider />
              <CountUnit value={h} label="Stunden" />
              <Divider />
              <CountUnit value={m} label="Minuten" />
              <Divider />
              <CountUnit value={s} label="Sekunden" />
            </div>
          </div>
        </div>

        {/* Email signup */}
        <div className="anim-4" style={{ marginBottom:"2rem", maxWidth:540 }}>
          <div style={{
            fontSize:"0.8rem", color: C.muted,
            marginBottom:10, fontWeight:500,
          }}>
            Sei dabei wenn wir starten — trage dich jetzt ein:
          </div>
          <EmailForm />
        </div>

        {/* Signup counter */}
        <div className="anim-4" style={{ marginBottom:"2.5rem" }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            fontSize:"0.8rem", color: C.muted,
          }}>
            <div style={{ display:"flex", gap:-4 }}>
              {["🧑","👩","🧔","👱","🙍"].map((e,i) => (
                <span key={i} style={{
                  display:"inline-flex", alignItems:"center", justifyContent:"center",
                  width:24, height:24, borderRadius:"50%",
                  background: C.navyMid,
                  border:`2px solid ${C.navyDark}`,
                  fontSize:"0.75rem",
                  marginLeft: i > 0 ? -6 : 0,
                  zIndex: 5-i,
                  position:"relative",
                }}>{e}</span>
              ))}
            </div>
            <span>
              <strong style={{ color: C.cream }}>{signupCount.toLocaleString("de-DE")}</strong> Personen sind bereits eingetragen
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="anim-5" style={{ marginBottom:"2.5rem" }}>
          <div style={{
            display:"flex", flexWrap:"wrap", gap:8,
          }}>
            <Feature icon="✅" text="Verifizierte Deals" />
            <Feature icon="🤖" text="KI-Deal-Finder" />
            <Feature icon="🔥" text="Bis -90% Rabatt" />
            <Feature icon="🇩🇪" text="Nur deutsche Shops" />
            <Feature icon="🔔" text="Deal-Alarm" />
            <Feature icon="🔒" text="DSGVO-konform" />
          </div>
        </div>

        {/* Divider */}
        <div className="anim-5" style={{
          height:"0.5px",
          background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          marginBottom:"2rem",
        }} />

        {/* Social */}
        <div className="anim-6">
          <div style={{ fontSize:"0.75rem", color: C.muted, marginBottom:12, letterSpacing:1 }}>
            Folge uns für erste Deals:
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <SocialLink href="#" icon="📱" label="Instagram" />
            <SocialLink href="#" icon="✈️" label="Telegram" />
            <SocialLink href="#" icon="🎵" label="TikTok" />
          </div>
        </div>

        {/* Footer */}
        <div className="anim-6" style={{
          marginTop:"3rem",
          paddingTop:"1.5rem",
          borderTop:"0.5px solid rgba(255,255,255,0.06)",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          flexWrap:"wrap", gap:8,
        }}>
          <div style={{ fontSize:"0.72rem", color:"rgba(138,144,170,0.5)" }}>
            © 2026 Schnäppchen · Alle Rechte vorbehalten
          </div>
          <div style={{ display:"flex", gap:16 }}>
            {["Datenschutz","Impressum","Kontakt"].map(l => (
              <a key={l} href="#" style={{
                fontSize:"0.72rem", color:"rgba(138,144,170,0.5)",
                textDecoration:"none", transition:"color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.orange}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(138,144,170,0.5)"}
              >{l}</a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
