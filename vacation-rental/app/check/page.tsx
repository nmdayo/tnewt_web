'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckPage() {
  const router = useRouter();
  const [guestInfo, setGuestInfo] = useState({ lastName: "", firstName: "", email: "", phone: "" });
  const [amount, setAmount] = useState(10000);

  useEffect(() => {
    // ローカルストレージからデータを取得
    const savedGuestInfo = localStorage.getItem("guestInfo");
    const savedAmount = localStorage.getItem("bookingAmount");
    if (savedGuestInfo) setGuestInfo(JSON.parse(savedGuestInfo));
    if (savedAmount) setAmount(JSON.parse(savedAmount));
  }, []);

  const handlePayment = async () => {
    try {
      // 支払いセッションを作成
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${guestInfo.lastName} ${guestInfo.firstName}`,
          email: guestInfo.email,
          phone: guestInfo.phone,
          amount,
          currency: "JPY",
        }),
      });

      const result = await response.json();

      if (response.ok && result.session_url) {
        // 支払いページにリダイレクト
        window.location.href = result.session_url;
      } else {
        console.error("支払いエラー:", result);
        alert("支払いページに遷移できませんでした");
      }
    } catch (error) {
      console.error("支払い処理エラー:", error);
      alert("支払い処理中にエラーが発生しました");
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">確認ページ</h1>
      <p>名前: {`${guestInfo.lastName} ${guestInfo.firstName}`}</p>
      <p>メールアドレス: {guestInfo.email}</p>
      <p>電話番号: {guestInfo.phone}</p>
      <p>金額: ¥{amount}</p>
      <button onClick={handlePayment} className="mt-4 p-2 bg-green-500 text-white rounded">
        支払い
      </button>
    </div>
  );
}
