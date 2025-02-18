'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function CheckPage() {
  const router = useRouter();
  const [guestInfo, setGuestInfo] = useState<any>(null);
  const [bookingAmount, setBookingAmount] = useState<number>(0);

  useEffect(() => {
    const storedGuestInfo = localStorage.getItem("guestInfo");
    const storedAmount = localStorage.getItem("bookingAmount");
    if (storedGuestInfo) {
      setGuestInfo(JSON.parse(storedGuestInfo));
    }
    if (storedAmount) {
      setBookingAmount(JSON.parse(storedAmount));
    }
  }, []);

  const handlePayment = async () => {
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: bookingAmount,
          currency: "JPY",
          external_order_num: `ORDER-${Date.now()}`,
          email: guestInfo?.email,
          name: `${guestInfo?.lastName} ${guestInfo?.firstName}`
        }),
      });

      const data = await response.json();
      if (response.ok && data.session_url) {
        window.location.href = data.session_url;
      } else {
        throw new Error(data.error || "支払いの初期化に失敗しました");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("支払いの処理中にエラーが発生しました");
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">確認ページ</h1>
      {guestInfo && (
        <div className="space-y-4">
          <p>名前: {guestInfo.lastName} {guestInfo.firstName}</p>
          <p>メールアドレス: {guestInfo.email}</p>
          <p>電話番号: {guestInfo.phone}</p>
          <p>金額: ¥{bookingAmount.toLocaleString()}</p>
          <Button onClick={handlePayment} className="w-full">
            支払い
          </Button>
        </div>
      )}
    </div>
  );
}
