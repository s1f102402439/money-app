// src/App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import AddExpense from "./pages/AddExpense";

function App() {
  const [events, setEvents] = useState([
    { id: 1, name: "セブ島旅行", date: "2026/03", balance: 5000, isOwed: true },
    { id: 2, name: "軽井沢スノボ", date: "2026/03", balance: -3000, isOwed: false },
    { id: 3, name: "箱根温泉", date: "2026/04", balance: 0, isOwed: null },
  ]);

  // 🔥 新機能：新しい記録を配列（箱）に追加する「専用リモコン」
  const handleAddRecord = (newRecord) => {
    // 今までのeventsに、新しい記録（newRecord）をガッチャンコして上書きする！
    setEvents([...events, newRecord]);
  };

  return (
    <BrowserRouter>
      <nav className="bg-white shadow-sm p-4 flex gap-4 hidden">
        <Link to="/" className="text-blue-600 font-bold">トップへ</Link>
        <Link to="/event" className="text-blue-600 font-bold">イベント詳細へ</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home events={events} />} />
        <Route path="/event" element={<EventDetail />} />
        
        {/* 🔥 注目！AddExpenseに「onAddRecord」という名前でリモコンを渡す！ */}
        <Route path="/add" element={<AddExpense onAddRecord={handleAddRecord} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;