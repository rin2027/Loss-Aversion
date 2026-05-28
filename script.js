// ── データ定義 ─────────────────────────────────────────
const QUESTIONS = [
  // Phase 1: 利得フレーム ── 確実利得 vs 期待値がわずかに高いリスク
  { id:1,  phase:'gain',  phaseLabel:'フェーズ1：利得フレーム',
    safe:  { icon:'💴', main:'¥1,000', sub:'確実にもらえる', gainFixed:1000 },
    risky: { icon:'🎲', main:'50 / 50', sub:'コインを投げる', gain:2200, loss:0 } },
  { id:2,  phase:'gain',  phaseLabel:'フェーズ1：利得フレーム',
    safe:  { icon:'💴', main:'¥1,000', sub:'確実にもらえる', gainFixed:1000 },
    risky: { icon:'🎲', main:'50 / 50', sub:'コインを投げる', gain:2500, loss:0 } },
  { id:3,  phase:'gain',  phaseLabel:'フェーズ1：利得フレーム',
    safe:  { icon:'💴', main:'¥1,000', sub:'確実にもらえる', gainFixed:1000 },
    risky: { icon:'🎲', main:'50 / 50', sub:'コインを投げる', gain:3000, loss:0 } },
  { id:4,  phase:'gain',  phaseLabel:'フェーズ1：利得フレーム',
    safe:  { icon:'💴', main:'¥1,000', sub:'確実にもらえる', gainFixed:1000 },
    risky: { icon:'🎲', main:'50 / 50', sub:'コインを投げる', gain:4000, loss:0 } },
  // Phase 2: 混合フレーム ── 現状維持 vs 損得賭け（損失回避テスト）
  { id:5,  phase:'mixed', phaseLabel:'フェーズ2：損失回避テスト',
    safe:  { icon:'🛡️', main:'現状維持', sub:'何もしない（±0円）', gainFixed:0 },
    risky: { icon:'🎲', main:'50 / 50', sub:'コインを投げる', gain:2500, loss:1000 } },
  { id:6,  phase:'mixed', phaseLabel:'フェーズ2：損失回避テスト',
    safe:  { icon:'🛡️', main:'現状維持', sub:'何もしない（±0円）', gainFixed:0 },
    risky: { icon:'🎲', main:'50 / 50', sub:'コインを投げる', gain:2000, loss:1000 } },
  { id:7,  phase:'mixed', phaseLabel:'フェーズ2：損失回避テスト',
    safe:  { icon:'🛡️', main:'現状維持', sub:'何もしない（±0円）', gainFixed:0 },
    risky: { icon:'🎲', main:'50 / 50', sub:'コインを投げる', gain:1500, loss:1000 } },
  { id:8,  phase:'mixed', phaseLabel:'フェーズ2：損失回避テスト',
    safe:  { icon:'🛡️', main:'現状維持', sub:'何もしない（±0円）', gainFixed:0 },
    risky: { icon:'🎲', main:'50 / 50', sub:'コインを投げる', gain:1000, loss:1000 } },
];

// ── 状態 ──────────────────────────────────────────────
let currentQ = 0;
let answers  = new Array(8).fill(null); // 'safe' | 'risky'

// ── メインレンダ ──────────────────────────────────────
function render() {
  const app = document.getElementById('app');
  if (currentQ >= QUESTIONS.length) {
    renderResults(app);
    return;
  }
  const q = QUESTIONS[currentQ];
  const ans    = answers[currentQ];
  const isLast = currentQ === QUESTIONS.length - 1;
  const pct    = Math.round((currentQ + 1) / QUESTIONS.length * 100);

  function outcomeBox(g, l) {
    if (l === 0) return `
      <div class="choice-outcome">
        <span class="outcome-gain">表 → ¥${g.toLocaleString()} 獲得</span><br>
        <span class="outcome-neutral">裏 → ¥0（何ももらえない）</span>
      </div>`;
    return `
      <div class="choice-outcome">
        <span class="outcome-gain">表 → ¥${g.toLocaleString()} 獲得</span><br>
        <span class="outcome-loss">裏 → ¥${l.toLocaleString()} 損失</span>
      </div>`;
  }

  app.innerHTML = `
    <div class="progress-row">
      <span class="progress-label">問題 ${currentQ+1} / ${QUESTIONS.length}</span>
      <div class="progress-track">
        <div class="progress-fill" style="width:${pct}%"></div>
      </div>
      <span class="phase-badge ${q.phase === 'gain' ? 'phase-gain' : 'phase-mixed'}">
        ${q.phase === 'gain' ? '利得フレーム' : '損失回避テスト'}
      </span>
    </div>

    <div class="question-card">
      <div class="q-header">
        <span class="q-number">Q${q.id} / 8</span>
        <span class="q-title">${q.phase === 'gain' ? 'どちらを選びますか？' : 'この賭けを受け入れますか？'}</span>
      </div>
      <div class="choices">
        <div class="choice-card safe-card ${ans === 'safe' ? 'selected' : ''}" onclick="choose('safe')">
          <div class="check-mark">✓</div>
          <div class="choice-type">🛡 安全な選択肢</div>
          <span class="choice-icon">${q.safe.icon}</span>
          <div class="choice-main">${q.safe.main}</div>
          <div class="choice-sub">${q.safe.sub}</div>
        </div>
        <div class="choice-card risky-card ${ans === 'risky' ? 'selected' : ''}" onclick="choose('risky')">
          <div class="check-mark">✓</div>
          <div class="choice-type">🎲 リスクのある選択肢</div>
          <span class="choice-icon">${q.risky.icon}</span>
          <div class="choice-main">${q.risky.main}</div>
          <div class="choice-sub">${q.risky.sub}</div>
          ${outcomeBox(q.risky.gain, q.risky.loss)}
        </div>
      </div>
    </div>

    <div class="nav-row">
      <span class="hint-text">
        ${ans ? '✓ 選択済みです。次へ進んでください。' : 'カードをクリックして選択してください'}
      </span>
      <button class="btn btn-primary" onclick="nextQ()" ${ans ? '' : 'disabled'}>
        ${isLast ? '結果を見る →' : '次の問題 →'}
      </button>
    </div>
  `;
}

function choose(c) {
  answers[currentQ] = c;
  render();
}

function nextQ() {
  if (!answers[currentQ]) return;
  currentQ++;
  render();
}

// ── 結果計算 ──────────────────────────────────────────
function calcResults() {
  // フェーズ1 (Q0-3)：リスク回避スコア（安全選択の数）
  const riskSafeCount = answers.slice(0, 4).filter(a => a === 'safe').length;

  // フェーズ2 (Q4-7)：損失回避推定
  // Q4 (index4): 比率 2.5 → λ>2.5で拒否
  // Q5 (index5): 比率 2.0 → λ>2.0で拒否
  // Q6 (index6): 比率 1.5 → λ>1.5で拒否
  // Q7 (index7): 比率 1.0 → λ>1.0で拒否
  const q5s = answers[4] === 'safe';
  const q6s = answers[5] === 'safe';
  const q7s = answers[6] === 'safe';
  const q8s = answers[7] === 'safe';

  let lambdaMin, lambdaMax;
  if      (q5s) { lambdaMin = 2.5; lambdaMax = 4.5; }
  else if (q6s) { lambdaMin = 2.0; lambdaMax = 2.5; }
  else if (q7s) { lambdaMin = 1.5; lambdaMax = 2.0; }
  else if (q8s) { lambdaMin = 1.0; lambdaMax = 1.5; }
  else          { lambdaMin = 0;   lambdaMax = 1.0; }

  const mixedSafeCount = answers.slice(4).filter(a => a === 'safe').length;
  return { riskSafeCount, mixedSafeCount, lambdaMin, lambdaMax };
}

function lambdaDisplay(min, max) {
  if (min === 0)   return 'λ < 1.0';
  if (max >= 4.5)  return 'λ > 2.5';
  return `λ ≈ ${min.toFixed(1)}〜${max.toFixed(1)}`;
}

function lambdaVerdict(min) {
  if (min >= 2.5) return '強い損失回避傾向があります';
  if (min >= 2.0) return '平均的な損失回避（K&Tの標準値に近い）';
  if (min >= 1.5) return '軽度の損失回避傾向があります';
  if (min >= 1.0) return '損失回避はやや低めです';
  return 'リスク選好的で、損失回避バイアスは低いようです';
}

function meterPos(min, max) {
  const mid = (min + Math.min(max, 4.5)) / 2;
  return Math.min(mid / 4.5 * 100, 98);
}

// ── 結果レンダ ────────────────────────────────────────
function renderResults(app) {
  const { riskSafeCount, mixedSafeCount, lambdaMin, lambdaMax } = calcResults();
  const pos     = meterPos(lambdaMin, lambdaMax);
  const verdict = lambdaVerdict(lambdaMin);
  const disp    = lambdaDisplay(lambdaMin, lambdaMax);

  const riskNote = riskSafeCount === 0
    ? '利得フレームではすべてリスク選択肢を選びました。期待値が高ければ積極的にリスクを取る傾向があります。'
    : riskSafeCount <= 2
    ? `利得フレームでは4問中${riskSafeCount}問を安全選択。期待値の高いリスクは受け入れる傾向があります。`
    : `利得フレームでは4問中${riskSafeCount}問を安全選択。確実な利得を強く好む（リスク回避的）傾向があります。`;

  const lossNote = mixedSafeCount === 0
    ? 'すべての混合ギャンブルを受け入れました。損失への感度が相対的に低いようです。'
    : mixedSafeCount === 4
    ? 'すべての賭けを断りました。損失への感度が非常に高い（強い損失回避）傾向があります。'
    : `4問中${mixedSafeCount}問を断りました。期待値がプラスでも損失の可能性が選択を抑制しています。`;

  function bdRow(q, i) {
    const a = answers[i];
    const ev = q.phase === 'gain'
      ? `期待値 ¥${(q.risky.gain / 2).toLocaleString()}`
      : `EV = +¥${((q.risky.gain - q.risky.loss) / 2).toLocaleString()}`;
    const desc = q.phase === 'gain'
      ? `¥${q.risky.gain.toLocaleString()} or ¥0`
      : `+¥${q.risky.gain.toLocaleString()} or −¥${q.risky.loss.toLocaleString()} (${(q.risky.gain / q.risky.loss).toFixed(1)}倍)`;
    return `
      <div class="bd-row">
        <span class="bd-num">Q${q.id}</span>
        <span class="bd-text">${desc}</span>
        <span class="bd-ev">${ev}</span>
        <span class="bd-badge ${a === 'safe' ? 'badge-safe' : 'badge-risky'}">${a === 'safe' ? '安全' : 'リスク'}</span>
      </div>`;
  }

  app.innerHTML = `
    <div class="results-wrap">
      <div class="results-hero">
        <div class="h2">あなたの損失回避係数</div>
        <div class="lambda-display">${disp}</div>
        <div class="lambda-label">推定 Lambda（プロスペクト理論）</div>
        <div class="lambda-verdict">${verdict}</div>
      </div>

      <div class="meter-section">
        <div class="section-title">📊 損失回避スペクトラム上のあなたの位置</div>
        <div class="meter-wrap">
          <div class="meter-track">
            <div class="meter-fill" id="mFill"></div>
            <div class="meter-tick-kt"></div>
            <div class="meter-thumb" id="mThumb"></div>
          </div>
          <div class="meter-ticks">
            <span>λ=0<br>リスク選好</span>
            <span>λ=1<br>中立</span>
            <span></span>
            <span>λ=4+<br>強い回避</span>
          </div>
        </div>
        <div class="meter-desc">
          ${riskNote}<br>
          ${lossNote}<br>
          カーネマン＆トヴェルスキー（1979）の実験では、人々は平均して損失を利得の約 <strong>2.25倍</strong>に感じることが示されています。
        </div>
      </div>

      <div class="breakdown-section">
        <div class="section-title">📋 回答の詳細</div>
        <div class="phase-divider">フェーズ1 ── 利得フレーム（確実¥1,000 vs リスク）</div>
        ${QUESTIONS.slice(0,4).map((q,i) => bdRow(q, i)).join('')}
        <div class="phase-divider">フェーズ2 ── 損失回避テスト（混合ギャンブル）</div>
        ${QUESTIONS.slice(4).map((q,i) => bdRow(q, i+4)).join('')}
      </div>

      <div class="science-section">
        <div class="section-title">🔬 プロスペクト理論と損失回避バイアス</div>
        <p>
          カーネマン＆トヴェルスキー（1979）の<strong>プロスペクト理論</strong>によると、人は同額の利得より損失に対してより強く反応します。
          「¥1,000の損失」が引き起こす心理的痛みは、「¥1,000の利得」による喜びの約2.25倍とされており、この非対称性を
          <strong>損失回避係数 λ（ラムダ）</strong>で表します。
        </p>
        <p>
          このバイアスは、投資の損切りができない・サブスクを解約しづらい・現状維持を好むなど、
          日常の意思決定に広く影響しています。λ が高いほど損失を過大に評価する傾向があり、
          合理的な意思決定から乖離しやすくなります。
        </p>
      </div>

      <button class="restart-btn" onclick="restart()">↩ もう一度試す</button>
    </div>
  `;

  // メーター アニメーション（100ms後に発火してCSS transitionを有効化）
  setTimeout(() => {
    document.getElementById('mFill').style.width  = pos + '%';
    document.getElementById('mThumb').style.left  = pos + '%';
  }, 120);
}

function restart() {
  currentQ = 0;
  answers  = new Array(8).fill(null);
  render();
}

render();