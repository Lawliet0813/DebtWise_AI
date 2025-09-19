const PALETTE = ['#38bdf8', '#34d399', '#fbbf24', '#f472b6', '#a855f7', '#94a3b8'];
const TYPE_LABELS = {
  credit_card: '信用卡',
  loan: '信用貸款',
  mortgage: '房貸',
  auto: '車貸',
  student: '學貸',
  other: '其他',
};
const STATUS_LABELS = {
  active: '進行中',
  paid: '已結清',
  overdue: '逾期',
};

function formatCurrency(value) {
  const number = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: number >= 100000 ? 0 : 2,
  }).format(number);
}

function formatPercent(value) {
  const number = Number.isFinite(value) ? value : 0;
  return `${number.toFixed(1)}%`;
}

function formatDate(value) {
  if (!value) return '—';
  try {
    const date = new Date(value);
    return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (error) {
    return value;
  }
}

function clampPercent(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function toLabel(type) {
  return TYPE_LABELS[type] || TYPE_LABELS.other;
}

function statusLabel(status) {
  return STATUS_LABELS[status] || status;
}

function buildGradient(distribution) {
  if (!distribution || distribution.length === 0) {
    return 'conic-gradient(#1e293b 0deg, #1e293b 360deg)';
  }
  const total = distribution.reduce((sum, item) => sum + (item.balance || item.principal || 0), 0) || 1;
  let cursor = 0;
  const segments = distribution.map((item, index) => {
    const value = item.balance || item.principal || 0;
    const degrees = (value / total) * 360;
    const start = cursor;
    cursor += degrees;
    const color = PALETTE[index % PALETTE.length];
    return `${color} ${start.toFixed(2)}deg ${cursor.toFixed(2)}deg`;
  });
  return `conic-gradient(${segments.join(', ')})`;
}

function buildPolyline(trends) {
  if (!trends || !Array.isArray(trends.paid) || trends.paid.length === 0) {
    return { width: 480, height: 220, points: '', labels: '' };
  }
  const width = 520;
  const height = 220;
  const padding = 32;
  const values = trends.paid.map((value) => (Number.isFinite(value) ? value : 0));
  const maxValue = Math.max(...values, 1);
  const step = trends.paid.length > 1 ? (width - padding * 2) / (trends.paid.length - 1) : 0;
  const points = values
    .map((value, index) => {
      const x = padding + step * index;
      const y = height - padding - (value / maxValue) * (height - padding * 1.6);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
  const labels = (trends.months || [])
    .map((label, index) => {
      const x = padding + step * index;
      return `<text x="${x}" y="${height - 10}" font-size="12" fill="rgba(226,232,240,0.7)" text-anchor="middle">${label}</text>`;
    })
    .join('');
  return { width, height, points, labels };
}

function createDemoData() {
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(now.getMonth() + 1, 5);
  const twoMonths = new Date(now);
  twoMonths.setMonth(now.getMonth() + 2, 18);
  return {
    user: {
      id: 'demo-user',
      name: '陳艾達',
      email: 'ada.chen@example.com',
      membership: 'premium',
      reminderPreferences: { daysBeforeDue: 3, timeOfDay: '09:00' },
    },
    summary: {
      totals: {
        principal: 680000,
        balance: 248600,
        paid: 431400,
        averageApr: 7.8,
      },
      progress: 63.5,
      nextDueDebt: {
        id: 'debt-cc',
        name: '花旗現金回饋卡',
        dueDate: nextMonth.toISOString(),
        balance: 38600,
      },
      debtsCount: 4,
    },
    debts: [
      {
        id: 'debt-cc',
        name: '花旗現金回饋卡',
        principal: 85000,
        balance: 38600,
        apr: 15.9,
        minimumPayment: 3200,
        dueDate: nextMonth.toISOString(),
        type: 'credit_card',
        progress: 54.6,
        totalPaid: 46400,
        status: 'active',
      },
      {
        id: 'debt-loan',
        name: '個人信貸',
        principal: 220000,
        balance: 92000,
        apr: 6.4,
        minimumPayment: 7800,
        dueDate: twoMonths.toISOString(),
        type: 'loan',
        progress: 58.2,
        totalPaid: 128000,
        status: 'active',
      },
      {
        id: 'debt-auto',
        name: '車貸',
        principal: 180000,
        balance: 32400,
        apr: 5.1,
        minimumPayment: 5200,
        dueDate: nextMonth.toISOString(),
        type: 'auto',
        progress: 82,
        totalPaid: 147600,
        status: 'active',
      },
      {
        id: 'debt-student',
        name: '學貸',
        principal: 195000,
        balance: 85600,
        apr: 2.2,
        minimumPayment: 3500,
        dueDate: twoMonths.toISOString(),
        type: 'student',
        progress: 56.1,
        totalPaid: 109400,
        status: 'active',
      },
    ],
    distribution: [
      { type: 'credit_card', principal: 85000, balance: 38600 },
      { type: 'loan', principal: 220000, balance: 92000 },
      { type: 'auto', principal: 180000, balance: 32400 },
      { type: 'student', principal: 195000, balance: 85600 },
    ],
    trends: {
      months: ['2023-12', '2024-01', '2024-02', '2024-03', '2024-04', '2024-05'],
      paid: [22000, 23500, 24800, 25000, 25500, 26800],
      payments: [4, 4, 5, 4, 5, 5],
    },
    reminders: [
      {
        id: 'demo-reminder-1',
        title: 'Upcoming payment: 花旗現金回饋卡',
        debtId: 'debt-cc',
        notifyAt: nextMonth.toISOString(),
        dueDate: nextMonth.toISOString(),
        amountDue: 3200,
        type: 'system',
      },
      {
        id: 'demo-reminder-2',
        title: '車貸自動扣繳確認',
        debtId: 'debt-auto',
        notifyAt: nextMonth.toISOString(),
        dueDate: nextMonth.toISOString(),
        amountDue: 5200,
        type: 'custom',
      },
    ],
    strategy: {
      monthlyBudget: 26000,
      snowball: {
        strategy: 'snowball',
        totalInterest: 42850,
        months: 16,
        payoffDate: new Date(now.getFullYear(), now.getMonth() + 16, 1).toISOString(),
        debtSummaries: [
          { id: 'debt-cc', name: '花旗現金回饋卡', months: 4, interest: 3860, payoffDate: new Date(now.getFullYear(), now.getMonth() + 4, 1).toISOString() },
          { id: 'debt-auto', name: '車貸', months: 8, interest: 5200, payoffDate: new Date(now.getFullYear(), now.getMonth() + 8, 1).toISOString() },
          { id: 'debt-loan', name: '個人信貸', months: 12, interest: 16240, payoffDate: new Date(now.getFullYear(), now.getMonth() + 12, 1).toISOString() },
          { id: 'debt-student', name: '學貸', months: 16, interest: 17550, payoffDate: new Date(now.getFullYear(), now.getMonth() + 16, 1).toISOString() },
        ],
      },
      avalanche: {
        strategy: 'avalanche',
        totalInterest: 35120,
        months: 14,
        payoffDate: new Date(now.getFullYear(), now.getMonth() + 14, 1).toISOString(),
        debtSummaries: [
          { id: 'debt-cc', name: '花旗現金回饋卡', months: 5, interest: 3420, payoffDate: new Date(now.getFullYear(), now.getMonth() + 5, 1).toISOString() },
          { id: 'debt-auto', name: '車貸', months: 10, interest: 4800, payoffDate: new Date(now.getFullYear(), now.getMonth() + 10, 1).toISOString() },
          { id: 'debt-loan', name: '個人信貸', months: 14, interest: 15400, payoffDate: new Date(now.getFullYear(), now.getMonth() + 14, 1).toISOString() },
          { id: 'debt-student', name: '學貸', months: 14, interest: 11500, payoffDate: new Date(now.getFullYear(), now.getMonth() + 14, 1).toISOString() },
        ],
      },
      interestSavings: 7730,
      monthsDifference: 2,
    },
  };
}

class DebtWiseDashboard extends HTMLElement {
  constructor() {
    super();
    this.state = {
      token: '',
      user: null,
      summary: null,
      debts: [],
      distribution: [],
      trends: null,
      reminders: [],
      strategy: null,
      monthlyBudget: 20000,
      loading: false,
      error: '',
      useDemo: false,
      lastSync: null,
    };
    this._apiBase = '';
    this._isMounted = false;
  }

  connectedCallback() {
    if (this._isMounted) return;
    this._isMounted = true;
    this.restoreSession();
    this.render();
    if (this.state.token) {
      this.fetchAll();
    }
  }

  set apiBase(value) {
    if (typeof value === 'string') {
      this._apiBase = value.replace(/\/$/, '');
    }
  }

  get apiBase() {
    return this._apiBase || '';
  }

  resolveUrl(path) {
    if (!path.startsWith('/')) {
      return `${this.apiBase}${path}`;
    }
    if (!this.apiBase) {
      return path;
    }
    return `${this.apiBase}${path}`;
  }

  restoreSession() {
    try {
      const session = window.localStorage && window.localStorage.getItem('debtwiseSession');
      if (session) {
        const parsed = JSON.parse(session);
        this.state = {
          ...this.state,
          token: parsed.token || '',
          user: parsed.user || null,
          monthlyBudget: parsed.monthlyBudget || this.state.monthlyBudget,
        };
        if (parsed.apiBase) {
          this._apiBase = parsed.apiBase;
        }
      }
    } catch (error) {
      // ignore persistence errors
    }
  }

  persistSession(user) {
    try {
      if (this.state.token) {
        window.localStorage.setItem(
          'debtwiseSession',
          JSON.stringify({
            token: this.state.token,
            user,
            apiBase: this.apiBase,
            monthlyBudget: this.state.monthlyBudget,
          })
        );
      }
    } catch (error) {
      // ignore persistence errors
    }
  }

  clearSession() {
    try {
      window.localStorage.removeItem('debtwiseSession');
    } catch (error) {
      // ignore
    }
  }

  setState(patch) {
    this.state = { ...this.state, ...patch };
    this.render();
  }

  async request(path, options = {}, includeAuth = true) {
    const headers = { Accept: 'application/json', ...(options.headers || {}) };
    let body = options.body;
    if (body && typeof body === 'object' && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(body);
    }
    if (includeAuth && this.state.token) {
      headers.Authorization = `Bearer ${this.state.token}`;
    }
    const response = await fetch(this.resolveUrl(path), { ...options, headers, body });
    if (!response.ok) {
      let message = `Request failed (${response.status})`;
      try {
        const data = await response.json();
        if (data && data.error && data.error.message) {
          message = data.error.message;
        }
      } catch (error) {
        // ignore JSON parse error
      }
      throw new Error(message);
    }
    if (response.status === 204) {
      return null;
    }
    return response.json();
  }

  async handleLogin(form) {
    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '').trim();
    const api = String(formData.get('api') || '').trim();
    if (api) {
      this.apiBase = api;
    }
    if (!email || !password) {
      this.setState({ error: '請輸入 Email 與密碼。' });
      return;
    }
    this.setState({ loading: true, error: '' });
    try {
      const result = await this.request(
        '/auth/login',
        { method: 'POST', body: { email, password } },
        false
      );
      this.setState({ token: result.token, user: result.user, loading: false, useDemo: false });
      this.persistSession(result.user);
      await this.fetchAll();
    } catch (error) {
      this.setState({ loading: false, error: error.message || '登入失敗，請稍後再試。' });
    }
  }

  async fetchAll() {
    if (!this.state.token) return;
    this.setState({ loading: true, error: '' });
    try {
      const [profile, summary, debts, distribution, trends, reminders] = await Promise.all([
        this.request('/users/me'),
        this.request('/analytics/summary'),
        this.request('/debts'),
        this.request('/analytics/distribution'),
        this.request('/analytics/trends'),
        this.request('/reminders/upcoming'),
      ]);
      const strategy = await this.request('/strategies/compare', {
        method: 'POST',
        body: {
          monthlyBudget: this.state.monthlyBudget,
        },
      });
      this.setState({
        user: profile.user,
        summary,
        debts: debts.debts || [],
        distribution: distribution.distribution || [],
        trends,
        reminders: reminders.reminders || [],
        strategy,
        loading: false,
        error: '',
        useDemo: false,
        lastSync: new Date().toISOString(),
      });
      this.persistSession(profile.user);
    } catch (error) {
      this.setState({ loading: false, error: error.message || '無法載入儀表板資料。' });
    }
  }

  async refreshStrategy(budget) {
    if (this.state.useDemo) {
      const demo = createDemoData();
      this.setState({
        monthlyBudget: budget,
        strategy: { ...demo.strategy, monthlyBudget: budget },
      });
      return;
    }
    if (!this.state.token) return;
    this.setState({ loading: true, error: '' });
    try {
      const strategy = await this.request('/strategies/compare', {
        method: 'POST',
        body: {
          monthlyBudget: budget,
        },
      });
      this.setState({ strategy, monthlyBudget: budget, loading: false, lastSync: new Date().toISOString() });
      this.persistSession(this.state.user);
    } catch (error) {
      this.setState({ loading: false, error: error.message || '試算失敗，請確認債務資料。' });
    }
  }

  loadDemoData() {
    const demo = createDemoData();
    this.setState({
      token: '',
      user: demo.user,
      summary: demo.summary,
      debts: demo.debts,
      distribution: demo.distribution,
      trends: demo.trends,
      reminders: demo.reminders,
      strategy: demo.strategy,
      useDemo: true,
      monthlyBudget: demo.strategy.monthlyBudget,
      loading: false,
      error: '',
      lastSync: new Date().toISOString(),
    });
    this.clearSession();
  }

  logout() {
    this.clearSession();
    this.setState({
      token: '',
      user: null,
      summary: null,
      debts: [],
      distribution: [],
      trends: null,
      reminders: [],
      strategy: null,
      useDemo: false,
      loading: false,
      error: '',
      lastSync: null,
    });
  }

  bindEvents() {
    const loginForm = this.querySelector('#login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        this.handleLogin(loginForm);
      });
    }
    const refreshButton = this.querySelector('#refresh-dashboard');
    if (refreshButton) {
      refreshButton.addEventListener('click', () => {
        if (this.state.useDemo) {
          this.loadDemoData();
        } else {
          this.fetchAll();
        }
      });
    }
    const logoutButton = this.querySelector('#logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => this.logout());
    }
    const demoButton = this.querySelector('#demo-button');
    if (demoButton) {
      demoButton.addEventListener('click', () => this.loadDemoData());
    }
    const budgetForm = this.querySelector('#budget-form');
    if (budgetForm) {
      budgetForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(budgetForm);
        const value = Number.parseFloat(String(formData.get('budget')) || '0');
        if (!Number.isFinite(value) || value <= 0) {
          this.setState({ error: '請輸入有效的月度還款預算。' });
          return;
        }
        this.refreshStrategy(value);
      });
    }
  }

  renderHero() {
    const { user, summary, useDemo, loading, lastSync } = this.state;
    const membership = user && user.membership ? user.membership : 'free';
    const memberLabel = membership === 'premium' ? '付費版會員' : '免費版會員';
    const progress = summary ? clampPercent(summary.progress) : 0;
    return `
      <section class="hero">
        <div class="tag-list">
          <span class="tag">DebtWise AI</span>
          <span class="tag">${memberLabel}</span>
          ${useDemo ? '<span class="tag">Demo 模式</span>' : ''}
        </div>
        <h1>${user ? `${user.name || user.email} 的債務儀表板` : '掌握債務、降低壓力'}</h1>
        <p>一次掌握債務總覽、還款策略試算與提醒通知，打造屬於你的智慧理財教練。</p>
        <div class="actions">
          <button class="primary" id="refresh-dashboard" ${loading ? 'disabled' : ''}>${loading ? '同步中...' : '重新整理資料'}</button>
          ${this.state.token ? '<button class="secondary" id="logout-button">登出</button>' : ''}
        </div>
        ${summary ? `<div class="footer-note">目前整體清償進度 ${formatPercent(progress)}${lastSync ? ` · 上次同步 ${formatDate(lastSync)}` : ''}</div>` : ''}
      </section>
    `;
  }

  renderSummary() {
    const { summary } = this.state;
    if (!summary) {
      return '';
    }
    const cards = [
      { label: '總本金', value: formatCurrency(summary.totals.principal) },
      { label: '剩餘餘額', value: formatCurrency(summary.totals.balance) },
      { label: '已償還', value: formatCurrency(summary.totals.paid) },
      { label: '平均年利率', value: `${summary.totals.averageApr.toFixed(2)}%` },
    ];
    const nextDue = summary.nextDueDebt
      ? `<div class="badge warning">下一筆到期：${summary.nextDueDebt.name} · ${formatDate(summary.nextDueDebt.dueDate)}</div>`
      : '<div class="badge positive">所有債務皆為最新狀態</div>';
    const progress = clampPercent(summary.progress);
    return `
      <section class="card">
        <h2>債務概況</h2>
        <div class="stats">
          ${cards
            .map(
              (card) => `
              <div class="stat">
                <span class="label">${card.label}</span>
                <span class="value">${card.value}</span>
              </div>
            `
            )
            .join('')}
        </div>
        <div class="badge positive" style="margin-top:16px;">整體清償進度 ${formatPercent(progress)}</div>
        <div style="margin-top:12px;">${nextDue}</div>
      </section>
    `;
  }

  renderDebts() {
    const { debts } = this.state;
    if (!debts || debts.length === 0) {
      return `
        <section class="card">
          <h2>債務清單</h2>
          <p>目前沒有債務資料，請先建立債務或載入示範資料。</p>
        </section>
      `;
    }
    const rows = debts
      .map((debt) => {
        const progressWidth = clampPercent(debt.progress);
        return `
          <tr>
            <td>${debt.name}</td>
            <td>${toLabel(debt.type)}</td>
            <td>${formatCurrency(debt.balance)}</td>
            <td>${debt.apr.toFixed(2)}%</td>
            <td>${formatCurrency(debt.minimumPayment)}</td>
            <td>${formatDate(debt.dueDate)}</td>
            <td class="status">${statusLabel(debt.status)}</td>
            <td style="min-width:120px;">
              <div class="progress-bar"><span style="width:${progressWidth}%"></span></div>
            </td>
          </tr>
        `;
      })
      .join('');
    return `
      <section class="card">
        <h2>債務清單</h2>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>名稱</th>
                <th>類型</th>
                <th>目前餘額</th>
                <th>APR</th>
                <th>最低還款</th>
                <th>到期日</th>
                <th>狀態</th>
                <th>進度</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>
    `;
  }

  renderDistribution() {
    const { distribution } = this.state;
    if (!distribution || distribution.length === 0) {
      return `
        <section class="card">
          <h2>債務分佈</h2>
          <p>尚無資料可供分析。</p>
        </section>
      `;
    }
    const total = distribution.reduce((sum, item) => sum + (item.balance || item.principal || 0), 0) || 1;
    const gradient = buildGradient(distribution);
    const legend = distribution
      .map((item, index) => {
        const color = PALETTE[index % PALETTE.length];
        const amount = item.balance || item.principal || 0;
        const percent = ((amount / total) * 100).toFixed(1);
        return `<li><span class="swatch" style="background:${color}"></span>${toLabel(item.type)} · ${percent}%</li>`;
      })
      .join('');
    return `
      <section class="card">
        <h2>債務分佈圓餅圖</h2>
        <div class="chart">
          <div class="pie" style="background:${gradient};"></div>
          <ul class="legend">${legend}</ul>
        </div>
      </section>
    `;
  }

  renderTrends() {
    const { trends } = this.state;
    if (!trends || !Array.isArray(trends.paid) || trends.paid.length === 0) {
      return `
        <section class="card">
          <h2>總額趨勢</h2>
          <p>尚未記錄任何還款，完成首次付款後會顯示趨勢分析。</p>
        </section>
      `;
    }
    const { width, height, points, labels } = buildPolyline(trends);
    return `
      <section class="card">
        <h2>總額趨勢</h2>
        <div class="line-chart">
          <svg viewBox="0 0 ${width} ${height}">
            <polyline points="${points}" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>
            ${labels}
          </svg>
        </div>
        <p class="footer-note">最近 ${trends.months.length} 個月累計還款 ${formatCurrency(trends.paid.reduce((sum, value) => sum + value, 0))}</p>
      </section>
    `;
  }

  renderReminders() {
    const { reminders } = this.state;
    if (!reminders || reminders.length === 0) {
      return `
        <section class="card">
          <h2>提醒通知</h2>
          <p>目前沒有即將到期的提醒。</p>
        </section>
      `;
    }
    const items = reminders
      .map((reminder) => {
        const amount = reminder.amountDue ? `<span class="meta">建議付款：${formatCurrency(reminder.amountDue)}</span>` : '';
        const due = reminder.dueDate ? `<span class="meta">到期日：${formatDate(reminder.dueDate)}</span>` : '';
        return `
          <div class="reminder">
            <span class="title">${reminder.title}</span>
            <span class="meta">提醒時間：${formatDate(reminder.notifyAt)}</span>
            ${due}
            ${amount}
            <span class="meta">來源：${reminder.type === 'custom' ? '自訂提醒' : '系統提醒'}</span>
          </div>
        `;
      })
      .join('');
    return `
      <section class="card">
        <h2>提醒通知</h2>
        <div class="reminders">${items}</div>
      </section>
    `;
  }

  renderStrategy() {
    const { strategy, monthlyBudget } = this.state;
    const form = `
      <form id="budget-form" class="actions" style="margin-top:12px;">
        <label style="display:grid;gap:6px;font-size:0.9rem;color:var(--text-muted);">
          月度還款預算 (TWD)
          <input name="budget" type="number" min="1" step="100" value="${monthlyBudget}" style="max-width:200px;" />
        </label>
        <button class="primary" type="submit">重新試算</button>
      </form>
    `;
    if (!strategy) {
      return `
        <section class="card">
          <h2>還款策略試算</h2>
          <p>請輸入月度還款預算後開始試算。</p>
          ${form}
        </section>
      `;
    }
    const savingsBadge =
      strategy.interestSavings >= 0
        ? `利息差額節省 ${formatCurrency(strategy.interestSavings)}`
        : `雪崩法增加利息 ${formatCurrency(Math.abs(strategy.interestSavings))}`;
    let timelineBadge = '兩種策略清償時間相同';
    if (strategy.monthsDifference > 0) {
      timelineBadge = `雪崩法可提早 ${strategy.monthsDifference} 個月清償`;
    } else if (strategy.monthsDifference < 0) {
      timelineBadge = `雪球法可提早 ${Math.abs(strategy.monthsDifference)} 個月清償`;
    }
    const summary = `
      <div class="badge positive">月預算 ${formatCurrency(strategy.monthlyBudget)} · ${savingsBadge}</div>
      <div class="badge" style="margin-top:12px;">${timelineBadge}</div>
    `;
    const snowball = this.renderStrategyDetail(strategy.snowball, '#34d399');
    const avalanche = this.renderStrategyDetail(strategy.avalanche, '#38bdf8');
    return `
      <section class="card">
        <h2>還款策略比較</h2>
        ${summary}
        <div class="grid two" style="margin-top:16px;">
          ${snowball}
          ${avalanche}
        </div>
        ${form}
      </section>
    `;
  }

  renderStrategyDetail(result, color) {
    if (!result) {
      return '<div>尚無資料</div>';
    }
    const list = (result.debtSummaries || [])
      .map(
        (item) => `
          <li>${item.name} · ${item.months} 個月 · 利息 ${formatCurrency(item.interest)} · 完成於 ${formatDate(item.payoffDate)}</li>
        `
      )
      .join('');
    return `
      <div class="card" style="background:rgba(15,23,42,0.4); border:1px solid rgba(148,163,184,0.18);">
        <h3 style="margin-top:0;color:${color};text-transform:uppercase;letter-spacing:0.05em;">${result.strategy}</h3>
        <p>總利息 ${formatCurrency(result.totalInterest)}</p>
        <p>清償時間 ${result.months} 個月 · 預估完成日 ${formatDate(result.payoffDate)}</p>
        <ul style="margin:12px 0 0 18px; color: var(--text-muted); font-size:0.9rem;">
          ${list}
        </ul>
      </div>
    `;
  }

  renderAuth() {
    const defaultApi = this.apiBase || 'http://localhost:4000';
    return `
      <section class="card auth-card">
        <h2>登入 DebtWise AI</h2>
        <p>使用您在後端建立的帳號登入，或快速載入示範資料。</p>
        <form id="login-form">
          <label>
            電子郵件
            <input type="email" name="email" placeholder="you@example.com" required />
          </label>
          <label>
            密碼
            <input type="password" name="password" placeholder="••••••••" required />
          </label>
          <label>
            API 伺服器 (預設為本機)
            <input type="text" name="api" value="${defaultApi}" />
          </label>
          <button class="primary" type="submit" ${this.state.loading ? 'disabled' : ''}>${this.state.loading ? '登入中...' : '登入'}</button>
        </form>
        <button class="secondary" id="demo-button">立即體驗示範儀表板</button>
      </section>
    `;
  }

  renderDashboard() {
    return `
      ${this.renderSummary()}
      <section class="grid two">
        ${this.renderStrategy()}
        ${this.renderReminders()}
      </section>
      <section class="grid two">
        ${this.renderDebts()}
        ${this.renderDistribution()}
      </section>
      ${this.renderTrends()}
    `;
  }

  render() {
    const { error, token, useDemo } = this.state;
    const hasData = Boolean(token || useDemo);
    this.innerHTML = `
      <div class="dashboard-shell">
        ${this.renderHero()}
        ${error ? `<div class="alert">${error}</div>` : ''}
        ${hasData ? this.renderDashboard() : this.renderAuth()}
      </div>
    `;
    this.bindEvents();
  }
}

customElements.define('debtwise-dashboard', DebtWiseDashboard);
