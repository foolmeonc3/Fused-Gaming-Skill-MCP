# LESSON 1: AUTHENTICATION WORKFLOW PRO

https://claude.ai/public/artifacts/99ae3e69-a336-4909-8704-532504e59133

```jsx
import React, { useState, useRef } from 'react';
 
export default function AuthFlowPro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('email');
  const [feedback, setFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const debounceRef = useRef(null);
 
  const analyzWithClaude = async (type, value) => {
    if (!value.trim()) {
      setFeedback(null);
      return;
    }
 
    setIsAnalyzing(true);
    try {
      const prompt = type === 'email'
        ? `User entered email for signup: "${value}". Is it valid? Respond in 1 sentence max.`
        : `User password: "${value}". Rate strength 1-10 and suggest ONE improvement. 1 sentence max.`;
 
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 50,
          messages: [{ role: 'user', content: prompt }]
        })
      });
 
      const data = await response.json();
      const text = data.content?.[0]?.text || 'No response';
      
      setFeedback({
        type,
        text,
        isPositive: text.toLowerCase().includes('valid') || text.toLowerCase().includes('good') || text.toLowerCase().includes('strong')
      });
    } catch (err) {
      setFeedback({ type, text: 'Analysis unavailable', isPositive: false });
    }
    setIsAnalyzing(false);
  };
 
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    clearTimeout(debounceRef.current);
    if (value.length > 3) {
      debounceRef.current = setTimeout(() => analyzWithClaude('email', value), 400);
    }
  };
 
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    clearTimeout(debounceRef.current);
    if (value.length > 3) {
      debounceRef.current = setTimeout(() => analyzWithClaude('password', value), 400);
    }
  };
 
  const isValidEmail = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  const isStrongPassword = password.length >= 12;
 
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated gradient orbs for depth */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 10s ease-in-out infinite reverse'
      }} />
 
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { box-shadow: 0 0 16px rgba(59, 130, 246, 0.1); }
          50% { box-shadow: 0 0 24px rgba(59, 130, 246, 0.2); }
          100% { box-shadow: 0 0 16px rgba(59, 130, 246, 0.1); }
        }
      `}</style>
 
      {/* Glass-morphism card */}
      <div style={{
        background: 'rgba(30, 41, 82, 0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '48px',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), inset 1px 1px 0 rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 10,
        animation: 'slideIn 0.6s ease-out'
      }}>
        {/* Brand header with logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
          }}>
            ✨
          </div>
          <div>
            <p style={{ 
              margin: 0, 
              fontSize: '11px', 
              color: '#94a3b8', 
              textTransform: 'uppercase', 
              letterSpacing: '1px', 
              fontWeight: '700'
            }}>
              YOUR BRAND HERE
            </p>
            <p style={{
              margin: '4px 0 0',
              fontSize: '13px',
              color: '#cbd5e1',
              fontWeight: '500'
            }}>
              Powered by Claude
            </p>
          </div>
        </div>
 
        {/* Headline */}
        <h1 style={{ 
          margin: '0 0 8px', 
          fontSize: '36px', 
          fontWeight: '800',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: '#f0f9ff'
        }}>
          Create Account
        </h1>
        <p style={{ 
          margin: '0 0 36px', 
          color: '#cbd5e1', 
          fontSize: '15px',
          lineHeight: '1.6',
          fontWeight: '400'
        }}>
          Real-time intelligence as you sign up • Claude analyzes every input
        </p>
 
        {/* Email Step */}
        {step === 'email' && (
          <div style={{ animation: 'slideIn 0.5s ease-out' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '14px', 
              fontWeight: '700', 
              color: '#f0f9ff',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="you@example.com"
              autoFocus
              style={{
                width: '100%',
                padding: '15px 18px',
                border: '2px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '14px',
                fontSize: '16px',
                boxSizing: 'border-box',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#f0f9ff',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                borderColor: isValidEmail ? 'rgba(59, 130, 246, 0.6)' : 'rgba(148, 163, 184, 0.2)',
                boxShadow: isValidEmail 
                  ? 'inset 0 0 0 1px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.12)' 
                  : 'inset 0 0 0 1px rgba(148, 163, 184, 0.1)',
                backdropFilter: 'blur(8px)'
              }}
            />
            
            {isAnalyzing && (
              <div style={{ 
                marginTop: '16px', 
                color: '#60a5fa', 
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: '500'
              }}>
                <span style={{ animation: 'float 1.5s ease-in-out infinite' }}>⚡</span> 
                Claude is analyzing...
              </div>
            )}
            
            {feedback?.type === 'email' && (
              <div style={{
                marginTop: '16px',
                padding: '14px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                background: feedback.isPositive 
                  ? 'rgba(34, 197, 94, 0.12)' 
                  : 'rgba(239, 68, 68, 0.12)',
                color: feedback.isPositive ? '#86efac' : '#fca5a5',
                border: `1px solid ${feedback.isPositive ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                backdropFilter: 'blur(8px)',
                lineHeight: '1.6',
                fontWeight: '500'
              }}>
                {feedback.isPositive ? '✓' : '⚠'} {feedback.text}
              </div>
            )}
 
            <button
              onClick={() => setStep('password')}
              disabled={!isValidEmail}
              style={{
                width: '100%',
                marginTop: '32px',
                padding: '15px 18px',
                background: isValidEmail 
                  ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
                  : 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: isValidEmail ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isValidEmail 
                  ? '0 12px 32px rgba(59, 130, 246, 0.35)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.2)',
                opacity: isValidEmail ? 1 : 0.65,
                letterSpacing: '0.3px'
              }}
              onMouseOver={(e) => {
                if (isValidEmail) {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 16px 40px rgba(59, 130, 246, 0.45)';
                }
              }}
              onMouseOut={(e) => {
                if (isValidEmail) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.35)';
                }
              }}
            >
              Continue →
            </button>
          </div>
        )}
 
        {/* Password Step */}
        {step === 'password' && (
          <div style={{ animation: 'slideIn 0.5s ease-out' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '14px', 
              fontWeight: '700', 
              color: '#f0f9ff',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}>
              Create Password (min 12 chars)
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••••••"
              autoFocus
              style={{
                width: '100%',
                padding: '15px 18px',
                border: '2px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '14px',
                fontSize: '16px',
                boxSizing: 'border-box',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#f0f9ff',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                borderColor: isStrongPassword ? 'rgba(59, 130, 246, 0.6)' : 'rgba(148, 163, 184, 0.2)',
                boxShadow: isStrongPassword 
                  ? 'inset 0 0 0 1px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.12)' 
                  : 'inset 0 0 0 1px rgba(148, 163, 184, 0.1)',
                backdropFilter: 'blur(8px)',
                letterSpacing: '0.1em'
              }}
            />
            
            {isAnalyzing && (
              <div style={{ 
                marginTop: '16px', 
                color: '#60a5fa', 
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: '500'
              }}>
                <span style={{ animation: 'float 1.5s ease-in-out infinite' }}>⚡</span> 
                Claude is analyzing strength...
              </div>
            )}
            
            {feedback?.type === 'password' && (
              <div style={{
                marginTop: '16px',
                padding: '14px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                background: feedback.isPositive 
                  ? 'rgba(34, 197, 94, 0.12)' 
                  : 'rgba(239, 68, 68, 0.12)',
                color: feedback.isPositive ? '#86efac' : '#fca5a5',
                border: `1px solid ${feedback.isPositive ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                backdropFilter: 'blur(8px)',
                lineHeight: '1.6',
                fontWeight: '500'
              }}>
                {feedback.isPositive ? '✓' : '⚠'} {feedback.text}
              </div>
            )}
 
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '32px' }}>
              <button
                onClick={() => { setStep('email'); setFeedback(null); }}
                style={{
                  padding: '15px 18px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#e0e7ff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '14px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  letterSpacing: '0.3px'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => alert('✨ Account created! Welcome to the future.')}
                disabled={!isStrongPassword}
                style={{
                  padding: '15px 18px',
                  background: isStrongPassword 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
                    : 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: isStrongPassword ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isStrongPassword 
                    ? '0 12px 32px rgba(59, 130, 246, 0.35)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.2)',
                  opacity: isStrongPassword ? 1 : 0.65,
                  letterSpacing: '0.3px'
                }}
                onMouseOver={(e) => {
                  if (isStrongPassword) {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 16px 40px rgba(59, 130, 246, 0.45)';
                  }
                }}
                onMouseOut={(e) => {
                  if (isStrongPassword) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.35)';
                  }
                }}
              >
                Create Account →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

# 10 Fast, Highly Impactful Claude Tools Teaching Moments
**Short-Form Content Strategy for Social Media (TikTok, Instagram Reels, YouTube Shorts)**

---

## 1. **"Your Code Just Explained Itself"** (15 seconds)
**Hook:** "I made a typo in my Python. Watch Claude fix it AND explain why it broke."

- **Visual:** Split-screen: broken code on left → Claude API analyzing → corrected code + explanation on right
- **Flow:** Type broken code → error message appears → Claude analyzes in real-time → code fix + one-liner explanation pops up
- **Teach:** Claude Code + API can do instant code review
- **CTA:** "Claude sees your code before you do. Try Code."

---

## 2. **"The AI That Knows Your Files"** (20 seconds)
**Hook:** "I uploaded my entire project. Claude read it, understood it, and built me a feature."

- **Visual:** Drag-and-drop multiple files → Claude loads them → generates new code that integrates perfectly
- **Sound:** Satisfying "whoosh" sounds as files load, typing sounds as code appears
- **Teach:** Claude understands project context across files, MCP connectors work with your file system
- **CTA:** "Context is king. Claude remembers everything."

---

## 3. **"Watch Your Spreadsheet Become Smart"** (18 seconds)
**Hook:** "I gave Claude 6 months of data. 10 seconds later, I had forecasts."

- **Visual:** Spreadsheet with raw numbers → Claude API analyzing → visualizations and predictions appear
- **Text overlays:** "6 months of data" → "Claude thinks..." → "Patterns found" → "Forecast ready"
- **Teach:** Claude's API can process tabular data, find patterns, generate insights
- **CTA:** "Stop analyzing by hand. Let Claude find what's hidden."

---

## 4. **"This Email Is Too Long. Let Claude Shorten It."** (15 seconds)
**Hook:** "I wrote 500 words. Claude rewrote it as 50. My boss loved it."

- **Visual:** Long email text → highlighting → word count counter going down → shortened version appears
- **Type:** Show character count dropping in real-time: 500 → 350 → 150 → 47 words
- **Teach:** Claude excels at conciseness and clarity, API can integrate into email workflows
- **CTA:** "Write more. Claude edits better. Save 10 minutes per email."

---

## 5. **"Can Claude Learn Your Brand Voice?"** (22 seconds)
**Hook:** "I showed Claude 3 examples of my writing. Now it writes like me."

- **Visual:** Feed 3 brand examples → Claude processes → generates new content in same style → side-by-side comparison
- **Text:** Show three examples on left (your style) → three generated examples on right (Claude's style match)
- **Teach:** Claude uses examples as context, can adopt writing styles, fine-tuning with prompts
- **CTA:** "Brand consistency at scale. Claude learns fast."

---

## 6. **"I Asked Claude to Audit My Security"** (25 seconds)
**Hook:** "Gave Claude my code. It found 4 vulnerabilities I missed."

- **Visual:** Code scanning → red highlights appear on issues → Claude's security report pops up → explaining each issue
- **Teach:** Claude can do security analysis, code review, vulnerability detection
- **CTA:** "Second pair of eyes that never sleeps. Try Code review mode."

---

## 7. **"Claude Just Became Your Research Assistant"** (20 seconds)
**Hook:** "I asked Claude a question. It searched the web, synthesized 5 sources, and gave me ONE clear answer."

- **Visual:** Question typed → web search icons appear → sources load → Claude integrates them → one clean answer appears
- **Sound:** quick "ding" sounds as sources load
- **Teach:** Claude's web search + synthesis capabilities, API can integrate external data
- **CTA:** "Stop tab-hopping. Claude brings research to you."

---

## 8. **"Your Spreadsheet Formula Just Became AI-Powered"** (18 seconds)
**Hook:** "Asked Claude to build a formula for complex calculations. It did in one shot."

- **Visual:** Natural language request (type it) → Claude generates Excel formula → formula appears → calculation results show
- **Text:** "Generate XLS formula for..." → formula appears → results calculated live
- **Teach:** Claude understands spreadsheet logic, can generate formulas from descriptions
- **CTA:** "Stop Googling formulas. Claude writes them."

---

## 9. **"This Is How Claude Reads Your PDF"** (20 seconds)
**Hook:** "I uploaded a 50-page manual. Claude found the one sentence I needed in 2 seconds."

- **Visual:** PDF upload animation → pages flip quickly → Claude highlighting relevant section → answer pops up
- **Teach:** Claude can extract from documents, context window handles long PDFs
- **CTA:** "PDFs used to be searchable. Now they're readable. New Claude."

---

## 10. **"Your Workflow Just Got 10x Faster"** (25 seconds)
**Hook:** "I connected Claude to my tools. Now it automates my entire Tuesday."

- **Visual:** MCP ecosystem diagram: Claude center → arrows to Slack, Gmail, Spreadsheets, GitHub → automation flowing
- **Sound:** satisfying automation "click" sounds as tasks complete
- **Text overlays:** "Email drafts → approved" → "Code reviewed → merged" → "Report generated → sent"
- **Teach:** MCP integrations, Claude orchestrating multiple tools, workflow automation
- **CTA:** "One AI. All your tools. Work smarter, not harder."

---

## **Production Notes for Maximum Impact**

### **Visual Patterns That Work:**
- **Before/After splits** (left side: problem, right side: Claude solution)
- **Live typing/streaming** (show Claude thinking in real-time)
- **Satisfying progress bars** (file loads, analysis runs, results appear)
- **Text overlays with pacing** (reveal each benefit sequentially)
- **Ambient cursor movement** (show the interaction, not just the result)

### **Sound Design (Silent-First TikTok):**
- Subtle "whoosh" for file uploads
- Quick "ding" for analysis completion
- Keyboard typing clicks for code/writing moments
- Brief ambient synth undertones (not distracting)
- **Use text overlays heavily** — assume no audio

### **CTA Strategy:**
- Each video ends with a **one-sentence action** (Try Claude Code, Try Web Search, Try API, etc.)
- Include a **URL or handle** in pinned comment
- Use pattern: "Stop [old way]. Claude [new way]."

### **Hook Speed:**
- First 2 seconds must show the **problem**
- Next 3 seconds show Claude **in action**
- Last 10-15 seconds show the **benefit**

### **Hashtag Strategy (Platform-Specific):**
- **TikTok:** #AIAutomation #CodingTok #ProductivityHacks #AIDeveloper
- **Instagram Reels:** #AITools #DeveloperLife #TechTok #SmartWorkflow
- **YouTube Shorts:** #AI #Claude #CodingAssistant #TechTutorial

### **Repurposing Strategy:**
- Each video is **16:9** (landscape) for YouTube Shorts
- Also cut **9:16** (portrait) for TikTok/Reels
- Create **Vertical cutdown** (text-heavy, mobile-first)
- Generate **Blog post** from each (Q&A format)
- Create **1-image carousel** (key frame + 3 tips)

---

## **Why These 10 Work:**

1. **Teach immediately** — every viewer learns something practical in 15-25 seconds
2. **Show, don't tell** — visuals dominate, text is minimal
3. **Match real workflows** — all examples are tasks people actually do
4. **Emphasize Claude as multiplier** — each video shows Claude making something faster/better/clearer
5. **Highlight different Claude surfaces** — Code, API, Web Search, PDF reading, MCP, etc.
6. **Pattern consistency** — "Stop X, Claude does Y" format repeats, makes brand memorable
7. **Social proof angle** — "I did this, it worked" framing (not "Claude is good")
8. **Actionable CTAs** — each video ends with something specific to try
9. **Sharable moments** — each has a *wow* moment people want to show others
10. **Authentic friction** — show real problems (typos, long emails, complex code) then solutions

---

## **Engagement Playbook**

- **Comments to pinned:** Answer the most common question with a follow-up video
- **Collaboration potential:** Partner with DevTok creators, Product Hunt movers, AI enthusiasts
- **Series format:** Create 3-video series (e.g., "Claude Code 101", "Claude API 101", "MCP 101")
- **Trending audio:** Use trending sounds but keep voiceover clear (captions over sound)
- **Duet/Stitch:** Encourage users to show their own Claude wins
- **Monthly themes:** Week 1: Code, Week 2: Data, Week 3: Writing, Week 4: Automation

---

## **Timeline for Launch**
- **Week 1:** Shoot all 10 videos
- **Week 2:** Edit + optimize per platform
- **Week 3:** Stagger posts (3-4x per week, across platforms)
- **Week 4:** Analyze performance, double down on top 3 videos with paid amplification
- **Ongoing:** Update thumbnails + descriptions weekly based on comments/questions

---

## **Tools You'll Need**
- **Screen recording:** OBS (free) or ScreenFlow (Mac)
- **Editing:** CapCut (free, TikTok native), Adobe Premiere Pro
- **Animations:** After Effects, or use CapCut's built-in transitions
- **Sound:** Freepik, Epidemic Sound, or Artlist (licensing needed for commercial use)
- **Graphics:** Figma (for text overlays), Canva Pro

---

**The goal:** By the end of month one, people are *asking* about Claude instead of you telling them about it.
