// src/pages/EventDetail.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function EventDetail() {
  // ① 魔法のカンペ（State）：「今、どのタブの舞台セットを見せるべきか？」を記憶する
  const [activeTab, setActiveTab] = useState("lend"); // 初期値は「貸し（lend）」

  return (
    // ② 画面の枠組み：スマホの高さいっぱいに広げ（h-screen）、縦並び（flex-col）にする
    <div className="h-screen flex flex-col bg-gray-50 font-sans">
      
      {/* ＝ 上部：ヘッダー（固定） ＝ */}
      <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center flex-none">
        <div className="flex items-center gap-3">
          {/* トップ画面に戻るドア */}
          <Link to="/" className="text-gray-400 text-xl font-bold hover:text-gray-600">❮</Link>
          <h1 className="font-bold text-lg text-gray-800">セブ島旅行</h1>
        </div>
        <div className="flex gap-4 text-xl">
          <button className="hover:opacity-70 transition-opacity">👥</button>
          <button className="hover:opacity-70 transition-opacity">🧮</button>
        </div>
      </header>

      {/* ＝ 中央部：メインコンテンツ（ここだけがスクロールできる） ＝ */}
      <main className="flex-grow overflow-y-auto p-4">
        
        {/* activeTabが「lend」の時だけ、この舞台セットを出す */}
        {activeTab === "lend" && (
          <div className="animate-fade-in">
            <h2 className="text-gray-500 font-bold mb-4 text-sm">📤 あなたが貸している記録</h2>
            {/* ダミーのカード */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3">
              <p className="font-bold text-gray-800">タクシー代</p>
              <p className="text-sm text-gray-500 mt-1">A君へ • <span className="text-blue-600 font-bold">¥1,500</span></p>
            </div>
          </div>
        )}

        {/* activeTabが「borrow」の時だけ、この舞台セットを出す */}
        {activeTab === "borrow" && (
          <div className="animate-fade-in">
            <h2 className="text-gray-500 font-bold mb-4 text-sm">📥 あなたが借りている記録</h2>
            {/* 🔥 プレッシャーUIのテスト（赤く染める） */}
            <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-200 mb-3">
              <div className="flex justify-between items-start">
                <p className="font-bold text-gray-800">夕食代</p>
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">⚠️ 3日経過</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">B君から • <span className="text-red-600 font-bold text-lg">¥3,000</span></p>
            </div>
          </div>
        )}

        {/* activeTabが「settle」の時だけ、この舞台セットを出す */}
        {activeTab === "settle" && (
          <div className="animate-fade-in">
            <h2 className="text-gray-500 font-bold mb-4 text-sm">📊 精算まとめ</h2>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center mb-6">
              <p className="font-bold text-blue-800">あなたが受け取る総額</p>
              <p className="text-3xl font-black text-blue-900 mt-2">¥5,000</p>
            </div>
            
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl flex justify-center items-center gap-2 shadow-md transition-colors">
              <span>💬</span> LINEで精算結果を共有
            </button>
          </div>
        )}
      </main>

      {/* ＝ 右下：フローティングアクションボタン（＋ボタン） ＝ */}
      {/* 💡ちょっとしたUXの工夫：精算タブ（settle）の時は「追加」しないので隠す！ */}
      {activeTab !== "settle" && (
        <button className="fixed bottom-20 right-6 w-14 h-14 bg-blue-600 rounded-full shadow-lg flex justify-center items-center text-white text-3xl hover:bg-blue-700 hover:scale-105 transition-all">
          ＋
        </button>
      )}

      {/* ＝ 最下部：ボトムナビゲーション（固定） ＝ */}
      <nav className="bg-white border-t border-gray-200 flex justify-around items-center h-16 flex-none pb-safe">
        
        {/* 貸しタブボタン：クリックすると activeTab を "lend" に書き換える */}
        <button 
          onClick={() => setActiveTab("lend")}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === "lend" ? "text-blue-600 font-bold" : "text-gray-400"}`}
        >
          <span className="text-xl mb-1">📤</span>
          <span className="text-[10px]">貸し</span>
        </button>

        {/* 借りタブボタン */}
        <button 
          onClick={() => setActiveTab("borrow")}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === "borrow" ? "text-blue-600 font-bold" : "text-gray-400"}`}
        >
          <span className="text-xl mb-1">📥</span>
          <span className="text-[10px]">借り</span>
        </button>

        {/* 精算タブボタン */}
        <button 
          onClick={() => setActiveTab("settle")}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === "settle" ? "text-blue-600 font-bold" : "text-gray-400"}`}
        >
          <span className="text-xl mb-1">📊</span>
          <span className="text-[10px]">精算</span>
        </button>

      </nav>
    </div>
  );
}