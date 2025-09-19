import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  CreditCard,
  TrendingDown,
  Bell,
  BarChart3,
  PieChart,
  Calendar,
  DollarSign,
  Target,
  Zap,
  Settings,
  User,
  LogOut,
  Home,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';

const DebtWiseAI = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [debts, setDebts] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddDebt, setShowAddDebt] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [paymentPlan, setPaymentPlan] = useState([]);
  const [extraPayment, setExtraPayment] = useState(0);

  const [paymentHistory, setPaymentHistory] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budget, setBudget] = useState({ income: 0, expenses: 0, available: 0 });
  const [emergencyFund, setEmergencyFund] = useState({ target: 0, current: 0 });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showPaymentRecord, setShowPaymentRecord] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [educationProgress, setEducationProgress] = useState({});
  const [creditScore, setCreditScore] = useState({ current: 650, target: 750 });

  const debtTypes = {
    信用卡: {
      icon: '💳',
      subTypes: ['循環信用', '信用卡分期', '現金卡', '預借現金'],
    },
    房貸: {
      icon: '🏠',
      subTypes: ['指數型房貸', '固定型房貸', '理財型房貸', '青年安心成家貸款', '房屋修繕貸款'],
    },
    車貸: {
      icon: '🚗',
      subTypes: ['新車貸款', '中古車貸款', '機車貸款', '商用車貸款'],
    },
    學貸: {
      icon: '🎓',
      subTypes: ['政府就學貸款', '私校學費貸款', '留學貸款', '在職進修貸款'],
    },
    個人信貸: {
      icon: '💰',
      subTypes: ['信用貸款', '小額信貸', '代償性貸款', '整合性貸款'],
    },
    投資: {
      icon: '📈',
      subTypes: ['融資', '股票質借', '期貨保證金', '外匯保證金'],
    },
    企業經營: {
      icon: '🏢',
      subTypes: ['企業貸款', '週轉金貸款', '設備貸款', '創業貸款'],
    },
    其他: {
      icon: '📋',
      subTypes: ['民間借貸', '親友借款', '當鋪借款', '標會'],
    },
  };

  const ToolsCenter = () => {
    const [activeCalculator, setActiveCalculator] = useState('interest');
    const [calcInputs, setCalcInputs] = useState({
      principal: '',
      rate: '',
      time: '',
      monthlyPayment: '',
      income: '',
      expenses: '',
    });

    const calculateInterest = () => {
      const p = parseFloat(calcInputs.principal);
      const r = parseFloat(calcInputs.rate) / 100 / 12;
      const n = parseFloat(calcInputs.time) * 12;

      if (p && r && n) {
        const monthlyPaymentValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPayment = monthlyPaymentValue * n;
        const totalInterest = totalPayment - p;

        return {
          monthlyPayment: Math.round(monthlyPaymentValue),
          totalPayment: Math.round(totalPayment),
          totalInterest: Math.round(totalInterest),
        };
      }
      return null;
    };

    const calculators = {
      interest: {
        title: '🔢 貸款計算器',
        description: '計算貸款的月付金額和總利息',
        component: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">貸款金額</label>
                <input
                  type="number"
                  placeholder="500000"
                  value={calcInputs.principal}
                  onChange={(e) => setCalcInputs({ ...calcInputs, principal: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">年利率 (%)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="4.5"
                  value={calcInputs.rate}
                  onChange={(e) => setCalcInputs({ ...calcInputs, rate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">貸款年限</label>
                <input
                  type="number"
                  placeholder="20"
                  value={calcInputs.time}
                  onChange={(e) => setCalcInputs({ ...calcInputs, time: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {calculateInterest() && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-3">計算結果</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-blue-700">月付金額</p>
                    <p className="text-xl font-bold text-blue-600">
                      ${calculateInterest().monthlyPayment.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">總付金額</p>
                    <p className="text-xl font-bold text-blue-600">
                      ${calculateInterest().totalPayment.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">總利息</p>
                    <p className="text-xl font-bold text-red-600">
                      ${calculateInterest().totalInterest.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ),
      },
      emergency: {
        title: '🛡️ 緊急基金計算器',
        description: '計算建議的緊急基金金額',
        component: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">月收入</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={calcInputs.income}
                  onChange={(e) => setCalcInputs({ ...calcInputs, income: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">月支出</label>
                <input
                  type="number"
                  placeholder="35000"
                  value={calcInputs.expenses}
                  onChange={(e) => setCalcInputs({ ...calcInputs, expenses: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {calcInputs.expenses && (
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h4 className="font-medium text-green-800 mb-3">建議緊急基金</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-green-700">保守 (3個月)</p>
                    <p className="text-xl font-bold text-green-600">
                      ${(parseFloat(calcInputs.expenses) * 3).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700">建議 (6個月)</p>
                    <p className="text-xl font-bold text-green-600">
                      ${(parseFloat(calcInputs.expenses) * 6).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700">充足 (12個月)</p>
                    <p className="text-xl font-bold text-green-600">
                      ${(parseFloat(calcInputs.expenses) * 12).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ),
      },
      credit: {
        title: '📈 信用評分模擬器',
        description: '模擬不同行為對信用評分的影響',
        component: (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-3">目前信用狀況</h4>
              <div className="flex items-center justify-between mb-4">
                <span className="text-purple-700">信用評分</span>
                <span className="text-2xl font-bold text-purple-600">{creditScore.current}</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full"
                  style={{ width: `${(creditScore.current / 850) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 border-2 border-green-200 rounded-xl hover:bg-green-50 transition-all">
                <div className="text-green-600 font-medium">✅ 按時還款</div>
                <div className="text-sm text-gray-600">+10 分</div>
              </button>
              <button className="p-4 border-2 border-red-200 rounded-xl hover:bg-red-50 transition-all">
                <div className="text-red-600 font-medium">❌ 遲繳款項</div>
                <div className="text-sm text-gray-600">-30 分</div>
              </button>
              <button className="p-4 border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-all">
                <div className="text-blue-600 font-medium">💳 降低使用率</div>
                <div className="text-sm text-gray-600">+15 分</div>
              </button>
              <button className="p-4 border-2 border-orange-200 rounded-xl hover:bg-orange-50 transition-all">
                <div className="text-orange-600 font-medium">🏦 新增信用帳戶</div>
                <div className="text-sm text-gray-600">-5 分</div>
              </button>
            </div>
          </div>
        ),
      },
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🛠️ 財務工具</h2>
          <p className="text-gray-600">實用的財務計算和分析工具</p>
        </div>

        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
          <div className="flex space-x-2">
            {Object.entries(calculators).map(([key, calc]) => (
              <button
                key={key}
                onClick={() => setActiveCalculator(key)}
                className={`flex-1 p-3 rounded-xl font-medium transition-all ${
                  activeCalculator === key
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {calc.title}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-2">{calculators[activeCalculator].title}</h3>
          <p className="text-gray-600 mb-4">{calculators[activeCalculator].description}</p>

          {calculators[activeCalculator].component}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔍 貸款比較工具</h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">銀行</th>
                  <th className="text-right py-2">利率</th>
                  <th className="text-right py-2">手續費</th>
                  <th className="text-right py-2">最高額度</th>
                  <th className="text-center py-2">評級</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { bank: '台新銀行', rate: '2.88%', fee: '$3,000', limit: '$1,000萬', rating: '⭐⭐⭐⭐⭐' },
                  { bank: '中國信託', rate: '3.12%', fee: '$5,000', limit: '$800萬', rating: '⭐⭐⭐⭐' },
                  { bank: '富邦銀行', rate: '3.25%', fee: '$4,000', limit: '$1,200萬', rating: '⭐⭐⭐⭐⭐' },
                  { bank: '玉山銀行', rate: '3.05%', fee: '$3,500', limit: '$900萬', rating: '⭐⭐⭐⭐' },
                ].map((bank) => (
                  <tr key={bank.bank} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 font-medium">{bank.bank}</td>
                    <td className="py-3 text-right">{bank.rate}</td>
                    <td className="py-3 text-right">{bank.fee}</td>
                    <td className="py-3 text-right">{bank.limit}</td>
                    <td className="py-3 text-center">{bank.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const EducationCenter = () => {
    const articles = [
      {
        id: 1,
        title: '債務雪球法 vs 雪崩法：哪個更適合你？',
        category: '還款策略',
        readTime: '5 分鐘',
        difficulty: '入門',
        summary: '深入比較兩種主流債務還款策略的優缺點…',
        icon: '🎯',
      },
      {
        id: 2,
        title: '如何建立緊急基金：財務安全的第一步',
        category: '理財基礎',
        readTime: '8 分鐘',
        difficulty: '入門',
        summary: '學習如何計算和建立適合自己的緊急基金…',
        icon: '🛡️',
      },
      {
        id: 3,
        title: '信用卡利息計算與還款優化技巧',
        category: '信用管理',
        readTime: '10 分鐘',
        difficulty: '進階',
        summary: '理解信用卡計息方式，掌握節省利息的技巧…',
        icon: '💳',
      },
      {
        id: 4,
        title: '債務整合：什麼時候考慮整合貸款？',
        category: '債務管理',
        readTime: '12 分鐘',
        difficulty: '進階',
        summary: '分析債務整合的利弊，幫你做出明智決定…',
        icon: '🔄',
      },
    ];

    const tips = [
      '每月固定日期檢視債務狀況，養成良好的財務習慣',
      '將小額零錢投入債務還款，積少成多效果驚人',
      '避免只還最低金額，盡量多還本金減少利息負擔',
      '考慮副業收入專門用於債務還款，加速清償進度',
      '定期檢討並調整還款策略，確保最符合當前狀況',
    ];

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">📚 理財學院</h2>
          <p className="text-gray-600">提升財商，掌握債務管理技巧</p>
        </div>

        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 text-white shadow-xl">
          <h3 className="text-xl font-bold mb-3 flex items-center">💡 今日理財小貼士</h3>
          <p className="text-lg">{tips[new Date().getDate() % tips.length]}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📈 學習進度</h3>

          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">整體進度</span>
            <span className="font-bold text-purple-600">25%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full w-1/4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { category: '債務管理', progress: 40, color: 'blue' },
              { category: '投資理財', progress: 10, color: 'green' },
              { category: '信用知識', progress: 30, color: 'purple' },
              { category: '預算規劃', progress: 20, color: 'orange' },
            ].map((item) => (
              <div key={item.category} className="text-center">
                <div
                  className={`w-12 h-12 bg-${item.color}-100 rounded-full flex items-center justify-center mx-auto mb-2`}
                >
                  <span className={`text-${item.color}-600 font-bold text-sm`}>{item.progress}%</span>
                </div>
                <p className="text-xs text-gray-600">{item.category}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📖 推薦文章</h3>

          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="p-4 border border-gray-200 rounded-xl hover:border-purple-200 hover:bg-purple-50 transition-all cursor-pointer"
              >
                <div className="flex items-start">
                  <span className="text-2xl mr-4">{article.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-2">{article.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{article.summary}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full">{article.category}</span>
                      <span>⏱️ {article.readTime}</span>
                      <span
                        className={`px-2 py-1 rounded-full ${
                          article.difficulty === '入門'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-orange-100 text-orange-600'
                        }`}
                      >
                        {article.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🛠️ 實用工具</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: '利息計算器', icon: '🔢', desc: '計算貸款利息' },
              { name: '預算規劃', icon: '📊', desc: '制定月度預算' },
              { name: '信用評估', icon: '📈', desc: '檢視信用狀況' },
              { name: '投資試算', icon: '💎', desc: '投資報酬試算' },
            ].map((tool) => (
              <button
                key={tool.name}
                className="p-4 border border-gray-200 rounded-xl hover:border-purple-200 hover:bg-purple-50 transition-all text-center"
              >
                <div className="text-2xl mb-2">{tool.icon}</div>
                <h4 className="font-medium text-gray-800 text-sm">{tool.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{tool.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {isPremium && (
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 border border-purple-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">👥 Premium 社群</h3>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">小王</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">剛完成信用卡債務清償！感謝大家的鼓勵 🎉</p>
                  <p className="text-xs text-gray-500">2 小時前</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">小李</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">有人用過債務整合嗎？想聽聽大家的經驗</p>
                  <p className="text-xs text-gray-500">1 天前 • 12 個回覆</p>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors">
              💬 加入討論
            </button>
          </div>
        )}
      </div>
    );
  };

  const Reports = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyData = Array.from({ length: 12 }, (_, index) => ({
      month: `${currentYear}-${(index + 1).toString().padStart(2, '0')}`,
      totalPayment: getTotalMonthlyPayment() + Math.random() * 5000,
      interestPaid: Math.random() * 3000,
      principalPaid: getTotalMonthlyPayment() + Math.random() * 2000,
      remainingDebt: getTotalDebt() - index * 10000,
    }));

    const totalInterestThisYear = monthlyData.reduce((sum, month) => sum + month.interestPaid, 0);
    const totalPrincipalThisYear = monthlyData.reduce((sum, month) => sum + month.principalPaid, 0);

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 財務報表</h2>
          <p className="text-gray-600">詳細的債務管理分析報告</p>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <h3 className="text-xl font-bold mb-4">{currentYear} 年度摘要</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-white/80 text-sm mb-1">總還款額</p>
              <p className="text-2xl font-bold">
                ${(totalInterestThisYear + totalPrincipalThisYear).toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-sm mb-1">本金償還</p>
              <p className="text-2xl font-bold text-green-300">{totalPrincipalThisYear.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-sm mb-1">利息支出</p>
              <p className="text-2xl font-bold text-red-300">{totalInterestThisYear.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-sm mb-1">債務減少</p>
              <p className="text-2xl font-bold text-yellow-300">
                {Math.round((totalPrincipalThisYear / getTotalDebt()) * 100)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📈 月度還款趨勢</h3>

          <div className="space-y-4">
            {monthlyData.slice(0, 6).map((month, index) => {
              const maxPayment = Math.max(...monthlyData.map((m) => m.totalPayment));
              const paymentPercentage = (month.totalPayment / maxPayment) * 100;

              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-20 text-sm text-gray-600">
                    {new Date(`${month.month}-01`).toLocaleDateString('zh-TW', { month: 'short' })}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-4 relative">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-purple-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${paymentPercentage}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                        ${Math.round(month.totalPayment).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🥧 債務結構分析</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">按金額分布</h4>
              <div className="space-y-2">
                {debts.map((debt) => {
                  const percentage = Math.round((debt.principal / getTotalDebt()) * 100);
                  return (
                    <div key={debt.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center">
                        <span className="mr-2">{debtTypes[debt.type]?.icon}</span>
                        {debt.name}
                      </span>
                      <span className="text-sm font-medium">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-3">按利率排序</h4>
              <div className="space-y-2">
                {[...debts]
                  .sort((a, b) => b.interestRate - a.interestRate)
                  .map((debt) => (
                    <div key={debt.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center">
                        <span className="mr-2">{debtTypes[debt.type]?.icon}</span>
                        {debt.name}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          debt.interestRate > 10
                            ? 'text-red-600'
                            : debt.interestRate > 5
                            ? 'text-orange-600'
                            : 'text-green-600'
                        }`}
                      >
                        {debt.interestRate}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔮 預測分析</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">樂觀情境</h4>
              <p className="text-sm text-green-700 mb-1">額外還款 +50%</p>
              <p className="text-2xl font-bold text-green-600">2.5 年</p>
              <p className="text-xs text-green-600">完全清償</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">現有計劃</h4>
              <p className="text-sm text-blue-700 mb-1">按目前策略</p>
              <p className="text-2xl font-bold text-blue-600">3.8 年</p>
              <p className="text-xs text-blue-600">完全清償</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
              <h4 className="font-medium text-orange-800 mb-2">最低還款</h4>
              <p className="text-sm text-orange-700 mb-1">僅付最低額</p>
              <p className="text-2xl font-bold text-orange-600">8.2 年</p>
              <p className="text-xs text-orange-600">完全清償</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">💡 AI 建議</h3>

          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-green-500 mr-3">✅</span>
              <p className="text-sm text-gray-700">您的信用卡債務利率最高，建議優先清償以節省利息支出</p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-3">💡</span>
              <p className="text-sm text-gray-700">考慮將年終獎金或額外收入投入債務還款，可提前 6-12 個月完成目標</p>
            </div>
            <div className="flex items-start">
              <span className="text-purple-500 mr-3">📈</span>
              <p className="text-sm text-gray-700">房貸利率較低，在清償高利率債務後再考慮提前還款或投資理財</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors">
            📊 導出 Excel 報表
          </button>
          <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors">
            📄 生成 PDF 報告
          </button>
        </div>
      </div>
    );
  };

  const ProgressTracker = () => {
    const totalDebtPaid = debts.reduce((sum, debt) => sum + (debt.originalPrincipal - debt.principal), 0);
    const totalOriginalDebt = debts.reduce((sum, debt) => sum + debt.originalPrincipal, 0);
    const overallProgress = Math.round((totalDebtPaid / totalOriginalDebt) * 100);

    const completedGoals = goals.filter((goal) => goal.isCompleted).length;
    const totalGoals = goals.length;

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">📈 進度追蹤</h2>
          <p className="text-gray-600">監控您的財務目標達成情況</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">🎯 總體進度</h3>
            <div className="text-3xl font-bold">{overallProgress}%</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <p className="text-white/80 text-sm mb-1">已還清</p>
              <p className="text-xl font-bold">${totalDebtPaid.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-sm mb-1">剩餘債務</p>
              <p className="text-xl font-bold">${getTotalDebt().toLocaleString()}</p>
            </div>
          </div>

          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">📊 個別債務進度</h3>

          <div className="space-y-4">
            {debts.map((debt) => {
              const progress = getPaymentProgress(debt);
              return (
                <div key={debt.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="mr-2">{debtTypes[debt.type]?.icon}</span>
                      <span className="font-medium text-gray-800">{debt.name}</span>
                    </div>
                    <span className="font-bold text-green-600">{progress}%</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>已還：${(debt.originalPrincipal - debt.principal).toLocaleString()}</span>
                    <span>剩餘：${debt.principal.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">🎯 財務目標</h3>
            <button
              onClick={() => setShowGoalForm(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              + 新增目標
            </button>
          </div>

          {totalGoals > 0 && (
            <div className="mb-4 p-3 bg-purple-50 rounded-xl">
              <p className="text-sm text-purple-700">
                已完成 <span className="font-bold">{completedGoals}</span> / {totalGoals} 個目標
              </p>
            </div>
          )}

          <div className="space-y-4">
            {goals.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-gray-500">還沒有設定任何目標</p>
                <button
                  onClick={() => setShowGoalForm(true)}
                  className="mt-4 text-purple-600 hover:text-purple-800 font-medium"
                >
                  立即設定第一個目標
                </button>
              </div>
            ) : (
              goals.map((goal) => {
                const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);
                const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));

                return (
                  <div
                    key={goal.id}
                    className={`p-4 rounded-xl border-2 ${
                      goal.isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800 flex items-center">
                        {goal.category === 'debt_payoff' && '🎯'}
                        {goal.category === 'emergency_fund' && '🛡️'}
                        {goal.category === 'investment' && '📈'}
                        {goal.category === 'saving' && '💰'}
                        <span className="ml-2">{goal.title}</span>
                      </h4>
                      {goal.isCompleted && <span className="text-green-600">✅ 已完成</span>}
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          goal.isCompleted
                            ? 'bg-gradient-to-r from-green-400 to-green-500'
                            : 'bg-gradient-to-r from-purple-400 to-purple-500'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</span>
                      <span>{progress}%</span>
                    </div>

                    {!goal.isCompleted && daysLeft > 0 && (
                      <p className="text-xs text-gray-500 mt-1">剩餘 {daysLeft} 天</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">🏆 成就徽章</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl text-center transition-all ${
                  achievement.isUnlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200'
                    : 'bg-gray-50 border-2 border-gray-200 opacity-60'
                }`}
              >
                <div className={`text-3xl mb-2 ${achievement.isUnlocked ? '' : 'grayscale'}`}>{achievement.icon}</div>
                <h4
                  className={`font-medium text-sm ${achievement.isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}
                >
                  {achievement.title}
                </h4>
                <p className={`text-xs mt-1 ${achievement.isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                  {achievement.description}
                </p>
                {achievement.isUnlocked && achievement.unlockedDate && (
                  <p className="text-xs text-yellow-600 mt-2">
                    {new Date(achievement.unlockedDate).toLocaleDateString('zh-TW')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowPaymentRecord(true)}
            className="bg-green-600 text-white p-4 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            💳 記錄還款
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className="bg-blue-600 text-white p-4 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            📊 查看報表
          </button>
        </div>
      </div>
    );
  };

  const PaymentRecordForm = () => {
    const [paymentData, setPaymentData] = useState({
      debtId: debts.length > 0 ? debts[0].id : '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      note: '',
    });

    const handleSubmit = () => {
      if (paymentData.debtId && paymentData.amount && paymentData.date) {
        recordPayment(paymentData.debtId, parseFloat(paymentData.amount), new Date(paymentData.date));
        setPaymentData({
          debtId: debts.length > 0 ? debts[0].id : '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          note: '',
        });
        setShowPaymentRecord(false);

        const debt = debts.find((d) => d.id === paymentData.debtId);
        setNotifications((prev) => [
          {
            id: Date.now(),
            type: 'achievement',
            title: '還款記錄成功！',
            message: `已記錄對${debt?.name}的$${parseFloat(paymentData.amount).toLocaleString()}還款`,
            date: new Date().toISOString(),
            isRead: false,
            priority: 'medium',
          },
          ...prev,
        ]);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">記錄還款</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">選擇債務</label>
              <select
                value={paymentData.debtId}
                onChange={(e) => setPaymentData({ ...paymentData, debtId: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                {debts.map((debt) => (
                  <option key={debt.id} value={debt.id}>
                    {debtTypes[debt.type]?.icon} {debt.name} - 餘額 ${debt.principal.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">還款金額</label>
              <input
                type="number"
                placeholder="2000"
                value={paymentData.amount}
                onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">還款日期</label>
              <input
                type="date"
                value={paymentData.date}
                onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">備註（可選）</label>
              <textarea
                placeholder="額外說明..."
                value={paymentData.note}
                onChange={(e) => setPaymentData({ ...paymentData, note: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all h-20"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                💳 記錄還款
              </button>
              <button
                onClick={() => setShowPaymentRecord(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const GoalForm = () => {
    const [goalData, setGoalData] = useState({
      title: '',
      targetAmount: '',
      targetDate: '',
      category: 'debt_payoff',
      priority: 'medium',
    });

    const handleSubmit = () => {
      if (goalData.title && goalData.targetAmount && goalData.targetDate) {
        addGoal({
          ...goalData,
          targetAmount: parseFloat(goalData.targetAmount),
        });
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">設定新目標</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">目標名稱</label>
              <input
                type="text"
                placeholder="例如：清償信用卡債務"
                value={goalData.title}
                onChange={(e) => setGoalData({ ...goalData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">目標金額</label>
              <input
                type="number"
                placeholder="50000"
                value={goalData.targetAmount}
                onChange={(e) => setGoalData({ ...goalData, targetAmount: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">目標日期</label>
              <input
                type="date"
                value={goalData.targetDate}
                onChange={(e) => setGoalData({ ...goalData, targetDate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">目標類型</label>
              <select
                value={goalData.category}
                onChange={(e) => setGoalData({ ...goalData, category: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="debt_payoff">🎯 債務清償</option>
                <option value="emergency_fund">🛡️ 緊急基金</option>
                <option value="investment">📈 投資理財</option>
                <option value="saving">💰 儲蓄目標</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">優先級</label>
              <select
                value={goalData.priority}
                onChange={(e) => setGoalData({ ...goalData, priority: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="high">🔥 高優先級</option>
                <option value="medium">⭐ 中優先級</option>
                <option value="low">📋 低優先級</option>
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
              >
                設定目標
              </button>
              <button
                onClick={() => setShowGoalForm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const NotificationPanel = () => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const markAsRead = (notificationId) => {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification,
        ),
      );
    };

    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'high':
          return 'border-red-200 bg-red-50';
        case 'medium':
          return 'border-yellow-200 bg-yellow-50';
        default:
          return 'border-gray-200 bg-gray-50';
      }
    };

    const getTypeIcon = (type) => {
      switch (type) {
        case 'payment_due':
          return '💳';
        case 'achievement':
          return '🏆';
        case 'tip':
          return '💡';
        case 'goal':
          return '🎯';
        case 'warning':
          return '⚠️';
        default:
          return '📢';
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">通知中心</h2>
            <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          {unreadCount > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-700">
                您有 <span className="font-bold">{unreadCount}</span> 則未讀通知
              </p>
            </div>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-gray-500">暫無通知</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    notification.isRead ? 'border-gray-100 bg-gray-25' : getPriorityColor(notification.priority)
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">{getTypeIcon(notification.type)}</span>
                    <div className="flex-1">
                      <h3 className={`font-medium ${notification.isRead ? 'text-gray-600' : 'text-gray-800'}`}>
                        {notification.title}
                      </h3>
                      <p className={`text-sm mt-1 ${notification.isRead ? 'text-gray-500' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.date).toLocaleDateString('zh-TW')}
                      </p>
                    </div>
                    {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
              }}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
            >
              標記所有為已讀
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PaymentPlan = () => {
    if (!selectedStrategy || paymentPlan.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">還款計劃表</h2>
          <p className="text-gray-600 mb-6">請先到「還款策略」頁面選擇一個策略</p>
          <button
            onClick={() => setActiveTab('strategy')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            前往選擇策略
          </button>
        </div>
      );
    }

    const totalMonths = paymentPlan.length;
    const totalPaid = paymentPlan.reduce((sum, month) => sum + month.totalPayment, 0);
    const totalInterest = paymentPlan.reduce(
      (sum, month) => sum + month.debts.reduce((debtSum, debt) => debtSum + debt.interest, 0),
      0,
    );
    const totalPrincipal = totalPaid - totalInterest;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              📋 還款計劃表
              <span className="ml-3 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                {selectedStrategy === 'snowball' ? '🎯 雪球法' : '⚡ 雪崩法'}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-white/80 text-sm mb-1">預計完成時間</p>
              <p className="text-xl font-bold">{totalMonths} 個月</p>
              <p className="text-sm">
                {Math.floor(totalMonths / 12)}年{totalMonths % 12}個月
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-sm mb-1">總支出</p>
              <p className="text-xl font-bold">${totalPaid.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-sm mb-1">利息支出</p>
              <p className="text-xl font-bold">${Math.round(totalInterest).toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-sm mb-1">額外還款</p>
              <p className="text-xl font-bold">${(extraPayment * totalMonths).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button onClick={() => setActiveTab('strategy')} className="text-gray-600 hover:text-gray-800 flex items-center">
            ← 重新選擇策略
          </button>
          <div className="space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              📊 下載計劃表
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              🖨️ 列印計劃
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">月份</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">期間</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">總還款</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">剩餘債務</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">債務明細</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paymentPlan.slice(0, 12).map((month, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-4 font-medium text-gray-800">第 {month.month} 個月</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{month.date}</td>
                    <td className="px-4 py-4 text-right font-bold text-green-600">
                      ${month.totalPayment.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-red-600">
                      ${month.totalRemaining.toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        {month.debts
                          .filter((debt) => debt.payment > 0)
                          .map((debt, debtIndex) => (
                            <div key={debtIndex} className="flex justify-between text-sm">
                              <span className="text-gray-600">{debt.name}:</span>
                              <span className="font-medium">
                                ${debt.payment.toLocaleString()}
                                {debt.remaining === 0 && <span className="text-green-600 ml-1">✓ 已清償</span>}
                              </span>
                            </div>
                          ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paymentPlan.length > 12 && (
            <div className="bg-gray-50 px-4 py-3 text-center">
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                顯示完整計劃表 (共 {totalMonths} 個月) ↓
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">🎯 債務清償順序</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(selectedStrategy === 'snowball' ? getSnowballOrder() : getAvalancheOrder()).map((debt, index) => {
              const clearanceMonth =
                paymentPlan.findIndex((month) =>
                  month.debts.find((d) => d.name === debt.name && d.remaining === 0),
                ) + 1;

              return (
                <div key={debt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <span
                      className={`w-8 h-8 ${
                        selectedStrategy === 'snowball' ? 'bg-blue-600' : 'bg-red-600'
                      } text-white text-sm font-bold rounded-full flex items-center justify-center mr-3`}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">{debt.name}</p>
                      <p className="text-sm text-gray-600">
                        {selectedStrategy === 'snowball'
                          ? `$${debt.principal.toLocaleString()}`
                          : `${debt.interestRate}%`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {clearanceMonth > 0 ? (
                      <>
                        <p className="font-bold text-green-600">第 {clearanceMonth} 個月</p>
                        <p className="text-sm text-gray-600">清償完成</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-600">進行中</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">💰 效益分析</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl text-center">
              <p className="text-sm text-gray-600 mb-1">與僅付最低還款相比</p>
              <p className="text-xl font-bold text-green-600">節省 8 個月</p>
              <p className="text-xs text-gray-500">提前完成還款</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl text-center">
              <p className="text-sm text-gray-600 mb-1">利息節省</p>
              <p className="text-xl font-bold text-green-600">$65,000</p>
              <p className="text-xs text-gray-500">相比最低還款</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl text-center">
              <p className="text-sm text-gray-600 mb-1">每月額外投入</p>
              <p className="text-xl font-bold text-purple-600">${extraPayment.toLocaleString()}</p>
              <p className="text-xs text-gray-500">加速債務清償</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  useEffect(() => {
    const sampleDebts = [
      {
        id: 1,
        name: '中信信用卡',
        principal: 50000,
        originalPrincipal: 80000,
        interestRate: 18.5,
        minimumPayment: 2000,
        totalPeriods: 0,
        remainingPeriods: 0,
        dueDate: '2025-10-15',
        type: '信用卡',
        subType: '循環信用',
        color: 'red',
        monthlyDueDay: 15,
      },
      {
        id: 2,
        name: '房屋貸款',
        principal: 2000000,
        originalPrincipal: 2500000,
        interestRate: 2.1,
        minimumPayment: 15000,
        totalPeriods: 240,
        remainingPeriods: 180,
        dueDate: '2025-10-01',
        type: '房貸',
        subType: '指數型房貸',
        color: 'blue',
        monthlyDueDay: 1,
      },
      {
        id: 3,
        name: '汽車貸款',
        principal: 300000,
        originalPrincipal: 500000,
        interestRate: 4.8,
        minimumPayment: 8000,
        totalPeriods: 60,
        remainingPeriods: 36,
        dueDate: '2025-10-05',
        type: '車貸',
        subType: '新車貸款',
        color: 'green',
        monthlyDueDay: 5,
      },
      {
        id: 4,
        name: '就學貸款',
        principal: 120000,
        originalPrincipal: 150000,
        interestRate: 1.15,
        minimumPayment: 3000,
        totalPeriods: 60,
        remainingPeriods: 48,
        dueDate: '2025-10-20',
        type: '學貸',
        subType: '政府就學貸款',
        color: 'yellow',
        monthlyDueDay: 20,
      },
    ];

    setDebts(sampleDebts);
    setCurrentUser({ name: '小明', email: 'user@example.com' });
    setAchievements([
      { id: 1, title: '新手上路', description: '完成第一次登入', icon: '🚀', isUnlocked: true },
      { id: 2, title: '策略選擇者', description: '選擇一種還款策略', icon: '🎯', isUnlocked: false },
      { id: 3, title: '債務終結者', description: '清償一筆債務', icon: '🏆', isUnlocked: false },
    ]);
  }, []);

  const getTotalDebt = () => debts.reduce((sum, debt) => sum + debt.principal, 0);

  const getTotalMonthlyPayment = () => debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);

  const getAverageInterestRate = () => {
    if (debts.length === 0) return 0;
    const totalWeighted = debts.reduce((sum, debt) => sum + debt.principal * debt.interestRate, 0);
    return (totalWeighted / getTotalDebt()).toFixed(1);
  };

  const getPaymentProgress = (debt) => {
    const paid = debt.originalPrincipal - debt.principal;
    return Math.round((paid / debt.originalPrincipal) * 100);
  };

  const getOverallProgress = () => {
    if (debts.length === 0) return 0;
    const totalOriginal = debts.reduce((sum, debt) => sum + debt.originalPrincipal, 0);
    const totalPaid = debts.reduce((sum, debt) => sum + (debt.originalPrincipal - debt.principal), 0);
    return Math.round((totalPaid / totalOriginal) * 100);
  };

  const getSnowballOrder = () => {
    return [...debts].sort((a, b) => a.principal - b.principal);
  };

  const getAvalancheOrder = () => {
    return [...debts].sort((a, b) => b.interestRate - a.interestRate);
  };

  const addDebt = (debtData) => {
    const newDebt = {
      id: Date.now(),
      ...debtData,
      principal: parseFloat(debtData.principal),
      originalPrincipal: parseFloat(debtData.principal),
      interestRate: parseFloat(debtData.interestRate),
      minimumPayment: parseFloat(debtData.minimumPayment),
      monthlyDueDay: parseInt(debtData.monthlyDueDay, 10),
      totalPeriods: debtData.totalPeriods ? parseInt(debtData.totalPeriods, 10) : 0,
      remainingPeriods: debtData.totalPeriods ? parseInt(debtData.totalPeriods, 10) : 0,
      color: ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'orange'][debts.length % 8],
    };
    setDebts([...debts, newDebt]);
    setShowAddDebt(false);
  };

  const needsPeriods = (type) => {
    return !['信用卡', '其他'].includes(type);
  };

  const formatRemainingPeriods = (periods) => {
    if (periods === 0) return '循環信用';
    const years = Math.floor(periods / 12);
    const months = periods % 12;
    if (years > 0 && months > 0) {
      return `${years}年${months}個月`;
    }
    if (years > 0) {
      return `${years}年`;
    }
    return `${months}個月`;
  };

  const getNextDueDate = (monthlyDueDay) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let nextDueDate = new Date(currentYear, currentMonth, monthlyDueDay);

    if (nextDueDate <= today) {
      nextDueDate = new Date(currentYear, currentMonth + 1, monthlyDueDay);
    }

    return nextDueDate.toLocaleDateString('zh-TW', {
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const isComingSoon = (monthlyDueDay) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let nextDueDate = new Date(currentYear, currentMonth, monthlyDueDay);
    if (nextDueDate <= today) {
      nextDueDate = new Date(currentYear, currentMonth + 1, monthlyDueDay);
    }

    const diffTime = nextDueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 3;
  };

  const generatePaymentPlan = (strategy, extraMonthlyPayment = 0) => {
    let workingDebts = debts.map((debt) => ({ ...debt }));
    const orderedDebts = strategy === 'snowball' ? getSnowballOrder() : getAvalancheOrder();

    const plan = [];
    let month = 1;
    const totalMinimumPayment = getTotalMonthlyPayment();
    const totalAvailablePayment = totalMinimumPayment + extraMonthlyPayment;

    while (workingDebts.some((debt) => debt.principal > 0)) {
      const monthPlan = {
        month,
        date: new Date(2025, new Date().getMonth() + month - 1, 1).toLocaleDateString('zh-TW', {
          year: 'numeric',
          month: 'long',
        }),
        debts: [],
        totalPayment: 0,
        totalRemaining: 0,
      };

      let remainingExtraPayment = extraMonthlyPayment;

      workingDebts.forEach((debt) => {
        if (debt.principal > 0) {
          const monthlyInterest = (debt.principal * debt.interestRate) / 100 / 12;
          const principalPayment = Math.min(debt.minimumPayment - monthlyInterest, debt.principal);

          debt.principal = Math.max(0, debt.principal - principalPayment);

          monthPlan.debts.push({
            name: debt.name,
            payment: debt.minimumPayment,
            principal: principalPayment,
            interest: monthlyInterest,
            remaining: debt.principal,
          });

          monthPlan.totalPayment += debt.minimumPayment;
        }
      });

      for (const orderedDebt of orderedDebts) {
        const workingDebt = workingDebts.find((d) => d.id === orderedDebt.id);
        if (workingDebt && workingDebt.principal > 0 && remainingExtraPayment > 0) {
          const extraForThisDebt = Math.min(remainingExtraPayment, workingDebt.principal);
          workingDebt.principal -= extraForThisDebt;
          remainingExtraPayment -= extraForThisDebt;

          const planDebt = monthPlan.debts.find((d) => d.name === workingDebt.name);
          if (planDebt) {
            planDebt.payment += extraForThisDebt;
            planDebt.principal += extraForThisDebt;
            planDebt.remaining = workingDebt.principal;
          }

          monthPlan.totalPayment += extraForThisDebt;

          if (workingDebt.principal === 0) {
            break;
          }
        }
      }

      monthPlan.totalRemaining = workingDebts.reduce((sum, debt) => sum + debt.principal, 0);
      plan.push(monthPlan);

      workingDebts = workingDebts.filter((debt) => debt.principal > 0);
      month += 1;

      if (month > 600) break;
    }

    return plan;
  };

  const selectStrategy = (strategy, extra = 0) => {
    setSelectedStrategy(strategy);
    setExtraPayment(extra);
    const plan = generatePaymentPlan(strategy, extra);
    setPaymentPlan(plan);
    setActiveTab('plan');
  };

  const recordPayment = (debtId, amount, date = new Date()) => {
    const paymentRecord = {
      id: Date.now(),
      debtId,
      amount,
      date: date.toISOString(),
      type: 'payment',
    };

    setPaymentHistory((prev) => [...prev, paymentRecord]);

    setDebts((prev) =>
      prev.map((debt) =>
        debt.id === debtId ? { ...debt, principal: Math.max(0, debt.principal - amount) } : debt,
      ),
    );

    checkAchievements(debtId, amount);
  };

  const checkAchievements = (debtId, amount) => {
    setAchievements((prev) =>
      prev.map((achievement) => {
        if (achievement.isUnlocked) return achievement;

        switch (achievement.id) {
          case 2:
            if (selectedStrategy) {
              return { ...achievement, isUnlocked: true, unlockedDate: new Date().toISOString() };
            }
            break;
          case 3: {
            const debt = debts.find((d) => d.id === debtId);
            if (debt && debt.principal <= amount) {
              return { ...achievement, isUnlocked: true, unlockedDate: new Date().toISOString() };
            }
            break;
          }
          default:
            break;
        }
        return achievement;
      }),
    );
  };

  const addGoal = (goalData) => {
    const newGoal = {
      id: Date.now(),
      ...goalData,
      currentAmount: 0,
      isCompleted: false,
    };
    setGoals((prev) => [...prev, newGoal]);
    setShowGoalForm(false);
  };

  const updateGoalProgress = (goalId, amount) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              currentAmount: Math.min(goal.targetAmount, goal.currentAmount + amount),
              isCompleted: goal.currentAmount + amount >= goal.targetAmount,
            }
          : goal,
      ),
    );
  };

  const deleteDebt = (debtId) => {
    setDebts(debts.filter((debt) => debt.id !== debtId));
  };

  const LoginForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            DebtWise AI
          </h1>
          <p className="text-gray-600">智能債務管理助手</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setCurrentUser({ name: '小明', email: 'demo@example.com' })}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            開始使用 (演示模式)
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button className="border border-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors backdrop-blur-sm">
              Google 登入
            </button>
            <button className="border border-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors backdrop-blur-sm">
              Apple ID
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const AddDebtForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      principal: '',
      interestRate: '',
      minimumPayment: '',
      totalPeriods: '',
      monthlyDueDay: '15',
      type: '信用卡',
      subType: '循環信用',
    });

    const handleTypeChange = (type) => {
      setFormData({
        ...formData,
        type,
        subType: debtTypes[type].subTypes[0],
        totalPeriods: needsPeriods(type) ? formData.totalPeriods : '',
      });
    };

    const handleSubmit = () => {
      if (
        formData.name &&
        formData.principal &&
        formData.interestRate &&
        formData.minimumPayment &&
        formData.monthlyDueDay
      ) {
        if (needsPeriods(formData.type) && !formData.totalPeriods) {
          alert('請輸入貸款期數');
          return;
        }
        addDebt(formData);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md border border-white/20 shadow-2xl">
          <h2 className="text-xl font-bold mb-4 text-gray-800">新增債務</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">債務名稱</label>
              <input
                type="text"
                placeholder="例如：信用卡A"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">本金金額</label>
              <input
                type="number"
                placeholder="50000"
                value={formData.principal}
                onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">年利率 (%)</label>
              <input
                type="number"
                step="0.01"
                placeholder="18.5"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">最低還款額</label>
              <input
                type="number"
                placeholder="2000"
                value={formData.minimumPayment}
                onChange={(e) => setFormData({ ...formData, minimumPayment: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {needsPeriods(formData.type) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  貸款期數 (月)
                  <span className="text-xs text-gray-500 ml-1">例如：60個月 = 5年</span>
                </label>
                <input
                  type="number"
                  placeholder="60"
                  value={formData.totalPeriods}
                  onChange={(e) => setFormData({ ...formData, totalPeriods: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required={needsPeriods(formData.type)}
                />
                <p className="text-xs text-gray-500 mt-1">常見期數：車貸36-72月、房貸240-360月、學貸60-120月</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                每月繳款日
                <span className="text-xs text-gray-500 ml-1">選擇每月固定繳款的日期</span>
              </label>
              <select
                value={formData.monthlyDueDay}
                onChange={(e) => setFormData({ ...formData, monthlyDueDay: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day.toString()}>
                    每月 {day} 號
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">💡 建議選擇發薪日後的日期，確保帳戶有足夠餘額</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">債務類型</label>
              <select
                value={formData.type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                {Object.keys(debtTypes).map((type) => (
                  <option key={type} value={type}>
                    {debtTypes[type].icon} {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">細分類型</label>
              <select
                value={formData.subType}
                onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                {debtTypes[formData.type].subTypes.map((subType) => (
                  <option key={subType} value={subType}>
                    {subType}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                新增債務
              </button>
              <button
                type="button"
                onClick={() => setShowAddDebt(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Dashboard = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">👋 你好，{currentUser.name}</h1>
        <p className="text-gray-600">讓我們一起管理您的債務，邁向財務自由！</p>
      </div>

      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">債務總覽</h2>
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            <BarChart3 size={24} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-white/80 text-sm mb-1">總債務</p>
            <p className="text-2xl font-bold">${getTotalDebt().toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-white/80 text-sm mb-1">月還款</p>
            <p className="text-2xl font-bold">${getTotalMonthlyPayment().toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-white/80 text-sm mb-1">債務項目</p>
            <p className="text-2xl font-bold">{debts.length}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/80">還款進度</span>
            <span className="font-bold">{getOverallProgress()}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getOverallProgress()}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setShowAddDebt(true)}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
        >
          <div className="text-4xl mb-3">💳</div>
          <h3 className="font-bold text-gray-800 mb-1">新增債務</h3>
          <p className="text-sm text-gray-600">快速添加新的債務項目</p>
        </button>

        {selectedStrategy ? (
          <button
            onClick={() => setActiveTab('plan')}
            className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-200 relative"
          >
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <div className="text-4xl mb-3">📋</div>
            <h3 className="font-bold text-gray-800 mb-1">我的計劃表</h3>
            <p className="text-sm text-gray-600">{selectedStrategy === 'snowball' ? '雪球法' : '雪崩法'}策略</p>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('strategy')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
          >
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-gray-800 mb-1">還款策略</h3>
            <p className="text-sm text-gray-600">查看AI推薦的還款計畫</p>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Clock className="mr-2 text-orange-500" size={20} />近期繳款提醒
          </h3>
          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
            {debts.filter((debt) => isComingSoon(debt.monthlyDueDay)).length} 項即將到期
          </span>
        </div>

        <div className="space-y-3">
          {debts
            .filter((debt) => isComingSoon(debt.monthlyDueDay))
            .slice(0, 3)
            .map((debt) => (
              <div
                key={debt.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100"
              >
                <div className="flex items-center">
                  <div className={`w-1 h-12 bg-${debt.color}-500 rounded-full mr-4`} />
                  <div>
                    <p className="font-medium text-gray-800 flex items-center">
                      <span className="mr-2">{debtTypes[debt.type]?.icon}</span>
                      {debt.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-gray-600 bg-white px-2 py-1 rounded-full">{debt.type}</p>
                      {debt.subType && <p className="text-xs text-gray-500">{debt.subType}</p>}
                      <p className="text-sm text-gray-600">• 每月 {debt.monthlyDueDay} 號</p>
                      {debt.remainingPeriods > 0 && (
                        <p className="text-xs text-green-600">剩餘 {formatRemainingPeriods(debt.remainingPeriods)}</p>
                      )}
                    </div>
                    <p className="text-xs text-orange-600 font-medium mt-1">下次繳款：{getNextDueDate(debt.monthlyDueDay)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">${debt.minimumPayment.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{debt.interestRate}%</p>
                </div>
              </div>
            ))}

          {debts.filter((debt) => isComingSoon(debt.monthlyDueDay)).length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">✨</div>
              <p className="text-gray-500">近期沒有需要繳款的債務</p>
              <p className="text-sm text-gray-400">您的財務狀況良好！</p>
            </div>
          )}

          {debts.filter((debt) => !isComingSoon(debt.monthlyDueDay)).length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">其他債務繳款日：</h4>
              <div className="flex flex-wrap gap-2">
                {debts
                  .filter((debt) => !isComingSoon(debt.monthlyDueDay))
                  .map((debt) => (
                    <span key={debt.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {debt.name} • 每月{debt.monthlyDueDay}號
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const DebtsList = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">我的債務</h2>
        <button
          onClick={() => setShowAddDebt(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
        >
          <Plus className="mr-2" size={16} />新增債務
        </button>
      </div>

      <div className="space-y-4">
        {debts.map((debt) => (
          <div
            key={debt.id}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <div className={`w-1 h-16 bg-${debt.color}-500 rounded-full mr-4`} />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                      <span className="mr-2">{debtTypes[debt.type]?.icon}</span>
                      {debt.name}
                    </h3>
                    <div className="flex space-x-2">
                      <p className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full inline-block">{debt.type}</p>
                      {debt.subType && (
                        <p className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full inline-block">{debt.subType}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">本金餘額</p>
                    <p className="font-bold text-red-600">${debt.principal.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">利率</p>
                    <p className="font-bold text-orange-600">{debt.interestRate}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">月還款</p>
                    <p className="font-bold text-blue-600">${debt.minimumPayment.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">剩餘期數</p>
                    <p className="font-bold text-green-600">{formatRemainingPeriods(debt.remainingPeriods)}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">每月繳款日</p>
                    <p className="font-bold text-gray-800">每月 {debt.monthlyDueDay} 號</p>
                    <p className="text-xs text-green-600">下次：{getNextDueDate(debt.monthlyDueDay)}</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">還款進度</span>
                    <span className="font-bold text-green-600">{getPaymentProgress(debt)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getPaymentProgress(debt)}%` }}
                    />
                  </div>
                </div>
              </div>

              <button onClick={() => deleteDebt(debt.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors ml-4">
                刪除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PaymentStrategy = () => {
    const [tempExtraPayment, setTempExtraPayment] = useState(0);

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">還款策略分析</h2>
          <p className="text-gray-600">AI 為您推薦最適合的債務清償策略</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <DollarSign className="mr-2 text-green-600" size={20} />額外還款設定
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">除了最低還款外，每月可額外投入多少資金？</label>
              <input
                type="number"
                placeholder="0"
                value={tempExtraPayment}
                onChange={(e) => setTempExtraPayment(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-xl">
              <p className="font-medium">目前最低還款總額：</p>
              <p className="text-lg font-bold text-green-600">${getTotalMonthlyPayment().toLocaleString()}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">💡 建議額外還款金額為月收入的10-20%，確保不影響基本生活需求</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-xl mr-4">
                <Target className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">雪球法</h3>
                <p className="text-sm text-gray-600">先清償小額債務</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 bg-blue-50 p-3 rounded-xl">💡 優先償還金額最小的債務，建立成就感與動力，心理負擔較小</p>

            <div className="space-y-3 mb-4">
              {getSnowballOrder().map((debt, index) => (
                <div key={debt.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full mr-3 font-bold">{index + 1}</span>
                    <span className="font-medium text-gray-800">{debt.name}</span>
                  </div>
                  <span className="font-bold text-blue-600">${debt.principal.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => selectStrategy('snowball', tempExtraPayment)}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              🎯 選擇雪球法策略
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-3 rounded-xl mr-4">
                <Zap className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">雪崩法</h3>
                <p className="text-sm text-gray-600">先清償高利率債務</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 bg-red-50 p-3 rounded-xl">💡 優先償還高利率債務，節省更多利息支出，數學上最划算</p>

            <div className="space-y-3 mb-4">
              {getAvalancheOrder().map((debt, index) => (
                <div key={debt.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex items-center">
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full mr-3 font-bold">{index + 1}</span>
                    <span className="font-medium text-gray-800">{debt.name}</span>
                  </div>
                  <span className="font-bold text-red-600">{debt.interestRate}%</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => selectStrategy('avalanche', tempExtraPayment)}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              ⚡ 選擇雪崩法策略
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-2xl p-6 border border-purple-100 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl mr-4">
              <CheckCircle className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">🤖 AI 推薦策略</h3>
              <p className="text-sm text-gray-600">基於您的財務狀況分析</p>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-4">
            <p className="text-gray-700 mb-3">
              根據您的債務結構和期數分析，建議採用 <span className="font-bold text-red-600">雪崩法</span> 策略：
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={16} />優先清償 18.5% 高利率信用卡，可節省約
                <span className="font-bold text-green-600 ml-1">15%</span> 利息支出
              </li>
              <li className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={16} />車貸剩餘 3 年，建議維持正常還款即可
              </li>
              <li className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={16} />房貸利率最低且期數長，可最後處理
              </li>
              <li className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={16} />預計提前
                <span className="font-bold text-green-600 ml-1">8 個月</span>完成高利率債務清償
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => selectStrategy('avalanche', tempExtraPayment)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              🚀 採用 AI 推薦策略
            </button>

            {!isPremium && (
              <button
                onClick={() => setIsPremium(true)}
                className="px-6 py-3 border border-purple-300 text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-colors"
              >
                升級 Premium
              </button>
            )}
          </div>

          {isPremium && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200 mt-4">
              <h4 className="font-bold text-purple-600 mb-2">📊 詳細分析報告</h4>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">債務優先級分析：</span>
                  <br />1️⃣ 信用卡 (18.5%利率) - 立即清償
                  <br />2️⃣ 車貸 (4.8%利率，剩36期) - 正常還款
                  <br />3️⃣ 學貸 (1.15%利率，剩48期) - 最後處理
                  <br />4️⃣ 房貸 (2.1%利率，剩180期) - 維持最低還款
                </p>
                <p>
                  <span className="font-semibold">期數優化建議：</span>
                  <br />建議每月額外投入 $3,000 於信用卡還款，可在 18 個月內完全清償。
                  車貸和學貸因期數較短且利率適中，維持原還款計畫即可。
                </p>
                <p>
                  <span className="font-semibold">總節省效益：</span>
                  <br />採用此策略預計節省總利息 $145,000，提前完成債務清償 14 個月。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!currentUser) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <nav className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                <DollarSign className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                DebtWise AI
              </h1>
              {isPremium && (
                <span className="ml-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                  ✨ Premium
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNotifications(true)}
                className="text-gray-600 hover:text-purple-600 transition-colors relative"
              >
                <Bell size={20} />
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsPremium(!isPremium)}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                <Settings size={20} />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="text-white" size={16} />
                </div>
                <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
              </div>
              <button
                onClick={() => setCurrentUser(null)}
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'debts' && <DebtsList />}
        {activeTab === 'strategy' && <PaymentStrategy />}
        {activeTab === 'plan' && <PaymentPlan />}
        {activeTab === 'progress' && <ProgressTracker />}
        {activeTab === 'reports' && <Reports />}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 px-2 py-2 z-30">
        <div className="flex justify-around items-center max-w-lg mx-auto">
          {[
            { id: 'dashboard', name: '總覽', icon: Home, emoji: '🏠' },
            { id: 'debts', name: '債務', icon: CreditCard, emoji: '💳' },
            { id: 'progress', name: '進度', icon: BarChart3, emoji: '📈' },
            { id: 'strategy', name: '策略', icon: Target, emoji: '🎯' },
            ...(selectedStrategy
              ? [{ id: 'plan', name: '計劃', icon: Calendar, emoji: '📋' }]
              : [{ id: 'reports', name: '報表', icon: PieChart, emoji: '📊' }]),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-2 rounded-xl transition-all duration-300 relative ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-110'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <span className="text-lg mb-1">{tab.emoji}</span>
              <span className="text-xs font-medium">{tab.name}</span>
              {tab.id === 'plan' && selectedStrategy && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
              {tab.id === 'progress' &&
                notifications.filter((n) => !n.isRead && n.type === 'achievement').length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                )}
            </button>
          ))}
        </div>
      </nav>

      <button
        onClick={() => setShowAddDebt(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center z-40"
      >
        <Plus size={24} />
      </button>

      {showAddDebt && <AddDebtForm />}
      {showNotifications && <NotificationPanel />}
      {showGoalForm && <GoalForm />}
      {showPaymentRecord && <PaymentRecordForm />}
    </div>
  );
};

export default DebtWiseAI;
