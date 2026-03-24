// src/pages/Home.jsx
import { Link } from "react-router-dom";

// 🌟 注目！カッコの中に「{ events }」を追加して、親からデータを受け取る！
export default function Home({ events }) {
  
  // ❌ ここにあった const events = [...] のダミーデータは削除しました！
  // なぜなら、親（App.jsx）から最新のデータが降ってくるからです！

  // 親から受け取った events を使って、今まで通り計算する
  const totalBalance = events.reduce((sum, event) => sum + event.balance, 0);

  let summaryText = "";
  let summaryColor = "";
  
  if (totalBalance > 0) {
    summaryText = "あなたが受け取る総額";
    summaryColor = "from-blue-500 to-blue-700";
  } else if (totalBalance < 0) {
    summaryText = "あなたが支払う総額";
    summaryColor = "from-red-500 to-red-700";
  } else {
    summaryText = "貸し借りはゼロです";
    summaryColor = "from-gray-400 to-gray-600";
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans">
      
      <header className="bg-white shadow-sm px-5 py-4 flex justify-between items-center flex-none">
        <h1 className="font-black text-2xl text-blue-600 tracking-tight">PayMate</h1>
        <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-lg shadow-sm">👤</div>
      </header>

      <main className="flex-grow overflow-y-auto p-4">
        
        <div className={`bg-gradient-to-br ${summaryColor} p-6 rounded-2xl shadow-md text-white mb-8 transition-colors duration-500`}>
          <p className="text-white/90 text-sm font-bold mb-1">{summaryText}</p>
          <div className="flex items-end gap-2">
            {totalBalance !== 0 ? (
              <span className="text-4xl font-black">¥{Math.abs(totalBalance).toLocaleString()}</span>
            ) : (
              <span className="text-4xl font-black">¥0</span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="text-lg font-bold text-gray-800">イベント・記録</h2>
          <button className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-full transition-colors">
            ＋ 新規作成
          </button>
        </div>

        <div className="space-y-3">
          {/* 親から受け取った events を map で展開！ */}
          {events.map(event => (
            <Link
              key={event.id}
              to="/event"
              className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{event.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">{event.date}</p>
                </div>
                <div className="text-right">
                  {event.balance > 0 && (
                    <p className="font-bold text-blue-600">貸し ¥{event.balance.toLocaleString()}</p>
                  )}
                  {event.balance < 0 && (
                    <p className="font-bold text-red-500">借り ¥{Math.abs(event.balance).toLocaleString()}</p>
                  )}
                  {event.balance === 0 && (
                    <p className="font-bold text-gray-400 text-sm">精算済み</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <nav className="bg-white border-t border-gray-200 flex justify-around items-center h-16 flex-none pb-safe">
        <button className="flex flex-col items-center justify-center w-full h-full text-blue-600 font-bold">
          <span className="text-xl mb-1">🏠</span>
          <span className="text-[10px]">ホーム</span>
        </button>
        <button className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-gray-500 transition-colors">
          <span className="text-xl mb-1">🤝</span>
          <span className="text-[10px]">フレンド</span>
        </button>
        <button className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-gray-500 transition-colors">
          <span className="text-xl mb-1">⚙️</span>
          <span className="text-[10px]">設定</span>
        </button>
      </nav>

    </div>
  );
}