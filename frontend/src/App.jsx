// src/App.jsx

// ① ダミーデータ（本来は後でDjangoの金庫から貰うデータです）
const dummyExpenses = [
  { id: 1, payer: "Kazu", amount: 15000, description: "セブ島のホテル代（予約金）", date: "2026-03-10" },
  { id: 2, payer: "友人A", amount: 1200, description: "空港までのタクシー代", date: "2026-03-10" },
  { id: 3, payer: "友人B", amount: 4500, description: "現地の夕食代（立て替え）", date: "2026-03-11" },
];

function App() {
  return (
    // 画面全体を少しグレーにして、スマホっぽい縦長の枠を作る設定
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        
        {/* アプリのヘッダー部分 */}
        <div className="bg-blue-600 p-5 text-white text-center font-bold text-xl tracking-wider">
          旅行の割り勘リスト
        </div>

        {/* 支払い履歴のリスト部分 */}
        <div className="p-5">
          <ul className="space-y-4">
            
            {/* ② 魔法の関数「map」で、データを1つずつカードに変身させる！ */}
            {dummyExpenses.map((expense) => (
              <li 
                key={expense.id} 
                className="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {/* 左側：何に誰が払ったか */}
                <div>
                  <p className="font-bold text-gray-800">{expense.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {expense.date} • <span className="font-medium text-blue-600">{expense.payer}</span> が支払い
                  </p>
                </div>
                
                {/* 右側：金額 */}
                <div className="font-black text-xl text-gray-800">
                  ¥{expense.amount.toLocaleString()}
                </div>
              </li>
            ))}

          </ul>
        </div>

      </div>
    </div>
  );
}

export default App;