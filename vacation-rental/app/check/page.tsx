'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckPage() {
  const router = useRouter();
  const [guestInfo, setGuestInfo] = useState({ lastName: "", firstName: "", email: "", phone: "", address: "" });
  const [amount, setAmount] = useState(10000);
  const [bookingDates, setBookingDates] = useState<{ 
    checkIn: string, 
    checkOut: string 
  }>({ 
    checkIn: new Date().toLocaleDateString('ja-JP').replace(/\//g, '-'), 
    checkOut: new Date().toLocaleDateString('ja-JP').replace(/\//g, '-') 
  });

  useEffect(() => {
    const savedGuestInfo = localStorage.getItem("guestInfo");
    const savedAmount = localStorage.getItem("bookingAmount");
    const savedDates = localStorage.getItem("bookingDates");
    
    if (savedGuestInfo) setGuestInfo(JSON.parse(savedGuestInfo));
    if (savedAmount) setAmount(JSON.parse(savedAmount));
    if (savedDates) {
      const dates = JSON.parse(savedDates);
      setBookingDates({
        checkIn: dates.checkIn,
        checkOut: dates.checkOut
      });
    }

    // URLパラメータから予約情報を取得
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    const amountParam = params.get('amount');
    const checkInParam = params.get('checkIn');
    const checkOutParam = params.get('checkOut');
    const lastNameParam = params.get('lastName');
    const firstNameParam = params.get('firstName');
    const phoneParam = params.get('phone');
    const addressParam = params.get('address');

    if (emailParam && amountParam && checkInParam && checkOutParam) {
      setGuestInfo({
        lastName: lastNameParam || "",
        firstName: firstNameParam || "",
        email: emailParam,
        phone: phoneParam || "",
        address: addressParam || ""
      });
      setAmount(parseInt(amountParam));
      setBookingDates({
        checkIn: checkInParam,
        checkOut: checkOutParam
      });
    }
  }, []);

  const handlePayment = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const checkInParam = params.get('checkIn');
      const checkOutParam = params.get('checkOut');

      // デバッグ用のログ出力
      console.log("送信前のguestInfo:", guestInfo);

      const paymentData = {
        name: `${guestInfo.lastName} ${guestInfo.firstName}`,
        email: guestInfo.email,
        phone: guestInfo.phone,
        amount,
        currency: "JPY",
        check_in_date: checkInParam,
        check_out_date: checkOutParam,
        address: guestInfo.address || ''  // 空文字列をフォールバックとして設定
      };

      console.log("送信するデータ:", paymentData);

      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (response.ok && result.session_url) {
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

  // 日付のフォーマット関数（文字列用）
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${year}年${month}月${day}日`;
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">確認ページ</h1>
      <p>名前: {`${guestInfo.lastName} ${guestInfo.firstName}`}</p>
      <p>メールアドレス: {guestInfo.email}</p>
      <p>電話番号: {guestInfo.phone}</p>
      <p>チェックイン: {formatDate(bookingDates.checkIn)}</p>
      <p>チェックアウト: {formatDate(bookingDates.checkOut)}</p>
      <p>金額: ¥{amount.toLocaleString()}</p>
      <button onClick={handlePayment} className="mt-4 p-2 bg-green-500 text-white rounded">
        支払い
      </button>
    </div>
  );
}
