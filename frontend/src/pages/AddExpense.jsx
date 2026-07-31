// src/pages/AddExpense.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AddExpense({ onAddRecord }) {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [isAutoSplit, setIsAutoSplit] = useState(false);
  const navigate = useNavigate();

  // 💡【外貨機能】Stateを追加
  const [currency, setCurrency] = useState("JPY");
  const [foreignAmount, setForeignAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState(1.0);

  const [members, setMembers] = useState([
    { id: 1, name: "自分", isIncluded: false, manualAmount: "" },
    { id: 2, name: "A君", isIncluded: false, manualAmount: "" },
    { id: 3, name: "B君", isIncluded: false, manualAmount: "" },
  ]);

  const activeMembers = members.filter((m) => m.isIncluded);
  const activeOthers = activeMembers.filter((m) => m.id !== 1);
  const availableMembers = members.filter(
    (m) => !m.isIncluded && (isAutoSplit || m.id !== 1),
  );

  const splitAmount =
    amount && activeMembers.length > 0
      ? Math.floor(amount / activeMembers.length)
      : 0;
  const isMultiManual = !isAutoSplit && activeOthers.length > 1;

  // 💡【外貨機能】外貨額やレートが変わったときに自動で日本円（amount）を計算するフック
  useEffect(() => {
    if (currency === "JPY") return;
    const fAmount = parseFloat(foreignAmount) || 0;
    const rate = parseFloat(exchangeRate) || 0;
    const calculatedJpy = Math.round(fAmount * rate);

    setAmount(calculatedJpy > 0 ? String(calculatedJpy) : "");

    // 相手が1人の場合は自動で手動金額にも反映
    if (!isAutoSplit && activeOthers.length === 1) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === activeOthers[0].id
            ? {
                ...m,
                manualAmount: calculatedJpy > 0 ? String(calculatedJpy) : "",
              }
            : m,
        ),
      );
    }
  }, [foreignAmount, exchangeRate, currency]);

  const handleAmountChange = (e) => {
    const val = e.target.value;
    setAmount(val);
    if (!isAutoSplit && activeOthers.length === 1) {
      setMembers(
        members.map((m) =>
          m.id === activeOthers[0].id ? { ...m, manualAmount: val } : m,
        ),
      );
    }
  };

  const handleAddMember = (e) => {
    const selectedId = Number(e.target.value);
    if (!selectedId) return;

    let newMembers = [...members];
    if (!isAutoSplit && activeOthers.length === 1) {
      newMembers = newMembers.map((m) =>
        m.id === activeOthers[0].id ? { ...m, manualAmount: amount } : m,
      );
    }
    newMembers = newMembers.map((m) =>
      m.id === selectedId ? { ...m, isIncluded: true } : m,
    );
    setMembers(newMembers);
  };

  const handleRemoveMember = (id) => {
    let newMembers = members.map((m) =>
      m.id === id ? { ...m, isIncluded: false, manualAmount: "" } : m,
    );

    if (!isAutoSplit) {
      const remainingOthers = newMembers.filter(
        (m) => m.isIncluded && m.id !== 1,
      );
      if (remainingOthers.length === 1) {
        setAmount(String(remainingOthers[0].manualAmount || ""));
      } else if (remainingOthers.length > 1) {
        const sum = remainingOthers.reduce(
          (acc, curr) => acc + (Number(curr.manualAmount) || 0),
          0,
        );
        setAmount(String(sum));
      } else {
        setAmount("");
      }
    }
    setMembers(newMembers);
  };

  const handleManualAmountChange = (id, value) => {
    const newMembers = members.map((m) =>
      m.id === id ? { ...m, manualAmount: value } : m,
    );
    setMembers(newMembers);

    if (!isAutoSplit) {
      const sum = newMembers
        .filter((m) => m.isIncluded && m.id !== 1)
        .reduce((acc, curr) => acc + (Number(curr.manualAmount) || 0), 0);
      setAmount(String(sum));
    }
  };

  const handleToggleAutoSplit = () => {
    if (!isAutoSplit) {
      setMembers(members.map((m) => ({ ...m, isIncluded: true })));
    } else {
      const newMembers = members.map((m) => ({
        ...m,
        isIncluded: m.id === 1 ? false : m.isIncluded,
        manualAmount:
          m.isIncluded && m.id !== 1 && splitAmount > 0
            ? String(splitAmount)
            : "",
      }));
      setMembers(newMembers);

      const remainingOthers = newMembers.filter(
        (m) => m.isIncluded && m.id !== 1,
      );
      setAmount(String(remainingOthers.length * splitAmount));
    }
    setIsAutoSplit(!isAutoSplit);
  };

  // 💡【Django連携】送信ボタンを押した時の非同期処理（fetch）を追加
  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("金額を入力してください。");
      return;
    }
    if (!title.trim()) {
      alert("何に使ったかを入力してください。");
      return;
    }
    if (activeMembers.length === 0) {
      alert("記録する相手を追加してください。");
      return;
    }

    try {
      // 登録対象の相手リスト（自分以外）
      const validOthers = activeMembers.filter((m) => m.id !== 1);

      // 人数分ループしてバックエンド（Django API）へ連続送信
      for (const member of validOthers) {
        let memberAmount = 0;
        if (isAutoSplit) {
          memberAmount = splitAmount;
        } else if (isMultiManual) {
          memberAmount = Number(member.manualAmount) || 0;
        } else {
          memberAmount = Number(amount);
        }

        if (memberAmount <= 0) continue;

        // Djangoへ送るデータの作成（復元した外貨データを含める！）
        const payload = {
          friend_name: member.name,
          amount: memberAmount, // 日本円換算額
          reason: title,
          foreign_currency: currency,
          foreign_amount: currency !== "JPY" ? Number(foreignAmount) || 0 : 0,
          exchange_rate: currency !== "JPY" ? Number(exchangeRate) || 1.0 : 1.0,
        };

        const res = await fetch("http://127.0.0.1:8000/api/debts/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error("Djangoへの保存に失敗しました");
        }
      }

      // ローカル側の表示用State更新（存在する場合）
      if (onAddRecord) {
        onAddRecord({
          id: Date.now(),
          name: title,
          date: "今日",
          balance: Number(amount),
          isOwed: true,
        });
      }

      navigate("/");
    } catch (error) {
      console.error(error);
      alert(
        "通信エラーが発生しました。Djangoが起動しているか確認してください。",
      );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center flex-none">
        <Link
          to="/event"
          className="text-gray-400 text-xl font-bold hover:text-gray-600 mr-4"
        >
          ❮
        </Link>
        <h1 className="font-bold text-lg text-gray-800">記録を追加</h1>
      </header>

      <main className="flex-grow overflow-y-auto p-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-20">
          {/* 💡【外貨機能UI】通貨選択 ＆ レート入力フォーム */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <label className="block text-xs font-bold text-blue-800 mb-2">
              通貨を選択
            </label>
            <select
              value={currency}
              onChange={(e) => {
                const selected = e.target.value;
                setCurrency(selected);
                if (selected === "JPY") setExchangeRate(1.0);
                if (selected === "PHP") setExchangeRate(2.65); // ペソのデフォルトレート例
                if (selected === "USD") setExchangeRate(155.0); // ドルのデフォルトレート例
              }}
              className="w-full bg-white border border-blue-200 rounded-lg py-2 px-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            >
              <option value="JPY">🇯🇵 日本円 (JPY)</option>
              <option value="PHP">🇵🇭 フィリピン・ペソ (PHP)</option>
              <option value="USD">🇺🇸 米ドル (USD)</option>
            </select>

            {currency !== "JPY" && (
              <div className="grid grid-cols-2 gap-3 mt-2 animate-fade-in">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    現地金額 ({currency})
                  </label>
                  <input
                    type="number"
                    value={foreignAmount}
                    onChange={(e) => setForeignAmount(e.target.value)}
                    placeholder="例: 500"
                    className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    レート (1{currency}＝?円)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-500 mb-2">
              {isAutoSplit
                ? "総額 (日本円換算)"
                : isMultiManual
                  ? "合計金額（自動計算）"
                  : "金額 (日本円換算)"}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">
                ¥
              </span>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                disabled={isMultiManual || currency !== "JPY"}
                placeholder="0"
                className={`w-full border rounded-lg py-3 pl-10 pr-4 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isMultiManual || currency !== "JPY" ? "bg-gray-100 text-gray-800 border-gray-200 cursor-not-allowed" : "bg-gray-50 text-gray-800 border-gray-300"}`}
              />
            </div>
            {currency !== "JPY" && (
              <p className="text-xs text-blue-600 font-bold mt-1 text-right">
                ※外貨入力から自動換算されています
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-500 mb-2">
              何に使った？
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：ファミレス代、タクシー"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-500 mb-3">
              誰との記録？
            </label>

            <div className="space-y-3 mb-4">
              {activeMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-white border border-blue-200 rounded-lg shadow-sm animate-fade-in"
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-gray-400 hover:text-red-500 font-bold px-2"
                    >
                      ×
                    </button>
                    <span className="font-bold text-gray-800">
                      {member.name}
                    </span>
                  </div>

                  <div className="w-32 text-right">
                    {isAutoSplit ? (
                      <span className="text-lg font-bold text-blue-600">
                        ¥{splitAmount.toLocaleString()}
                      </span>
                    ) : isMultiManual ? (
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                          ¥
                        </span>
                        <input
                          type="number"
                          value={member.manualAmount}
                          onChange={(e) =>
                            handleManualAmountChange(member.id, e.target.value)
                          }
                          placeholder="0"
                          className="w-full bg-gray-50 border border-gray-300 rounded-md py-1 pl-7 pr-2 text-right font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-gray-400">
                        ¥{amount || 0}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {availableMembers.length > 0 && (
              <div className="relative animate-fade-in">
                <select
                  onChange={handleAddMember}
                  value=""
                  className="w-full bg-blue-50 border border-blue-200 text-blue-600 rounded-lg py-3 px-4 font-bold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    ＋ 相手を追加する
                  </option>
                  {availableMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-blue-600">
                  ▼
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div>
              <p className="font-bold text-blue-800 text-sm">
                グループで割り勘する
              </p>
              <p className="text-xs text-blue-600 mt-1">
                オンにすると全員が追加されます
              </p>
            </div>
            <button
              onClick={handleToggleAutoSplit}
              className={`w-12 h-6 rounded-full relative transition-colors ${isAutoSplit ? "bg-blue-500" : "bg-gray-300"}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${isAutoSplit ? "translate-x-6" : "translate-x-0.5"}`}
              ></div>
            </button>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex-none pb-safe z-10">
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md transition-colors text-lg"
        >
          追加する
        </button>
      </div>
    </div>
  );
}
