// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";

function App() {
  return (
    // BrowserRouter: このアプリ全体で「どこでもドア」を使うよ！という宣言
    <BrowserRouter>
      
      {/* 画面の上に、テスト用の「ナビゲーションメニュー」を仮置きします */}
      <nav className="bg-white shadow-sm p-4 flex gap-4">
        <Link to="/" className="text-blue-600 font-bold">トップへ</Link>
        <Link to="/event" className="text-blue-600 font-bold">イベント詳細へ</Link>
      </nav>

      {/* Routes: URLによって、どの部屋（ページ）を表示するかを決める場所 */}
      <Routes>
        {/* URLが「/」なら、Homeコンポーネントを表示 */}
        <Route path="/" element={<Home />} />
        {/* URLが「/event」なら、EventDetailコンポーネントを表示 */}
        <Route path="/event" element={<EventDetail />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;