'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import type { GuestInfo } from "@/types/database.types";

export default function ConfirmPage() {
  const router = useRouter();
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    last_name: "",
    first_name: "",
    email: "",
    phone: "",
    amount: 0,
    status: "pending",
    check_in_date: new Date().toISOString(),
    check_out_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    id: "",
    address: ""
  });

  useEffect(() => {
    const savedGuestInfo = localStorage.getItem("guestInfo");
    const savedAmount = localStorage.getItem("bookingAmount"); // 予約金額を取得

    if (savedGuestInfo) {
      const parsedInfo = JSON.parse(savedGuestInfo);
      const amount = savedAmount ? parseInt(savedAmount, 10) : 0;

      setGuestInfo({
        last_name: parsedInfo.last_name || "",
        first_name: parsedInfo.first_name || "",
        email: parsedInfo.email || "",
        phone: parsedInfo.phone || "",
        amount: amount, // 予約金額を設定
        status: "pending",
        check_in_date: new Date().toISOString(),
        check_out_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        id: "",
        address: parsedInfo.address || ""
      });
    } else {
      router.push("/guest-info");
    }
  }, [router]);

  const handleBack = () => {
    router.push("/guest-info");
  };

  // バリデーション関数の追加
  const validateGuestInfo = (info: GuestInfo) => {
    const errors: string[] = [];

    // メールアドレスの検証
    if (!info.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.push('無効なメールアドレスです');
    }

    // 電話番号の検証
    if (!info.phone?.match(/^[0-9-]{10,}$/)) {
      errors.push('無効な電話番号です');
    }

    // 名前の検証
    if (!info.last_name?.trim() || !info.first_name?.trim()) {
      errors.push('お名前を入力してください');
    }

    // 金額の検証
    if (typeof info.amount !== 'number' || info.amount <= 0) {
      errors.push('無効な金額です');
    }

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }
  };

  const handleConfirm = async () => {
    try {
      // データの検証
      validateGuestInfo(guestInfo);

      // ローカルストレージから日付データを取得
      const savedDates = localStorage.getItem("bookingDates");
      let bookingDates = { checkIn: "", checkOut: "" };
      
      if (savedDates) {
        bookingDates = JSON.parse(savedDates);
      }

      console.log("Sending data to Supabase:", guestInfo);

      // Supabaseにデータを保存
      const { data, error } = await supabase
        .from('customer_info_data')
        .insert([
          {
            last_name: guestInfo.last_name,
            first_name: guestInfo.first_name,
            email: guestInfo.email,
            phone: guestInfo.phone,
            amount: guestInfo.amount || 0,
            status: 'pending',
            check_in_date: bookingDates.checkIn,
            check_out_date: bookingDates.checkOut,
            address: guestInfo.address || ''
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase Error:", error);
        throw new Error(`データの保存に失敗しました: ${error.message}`);
      }

      // メール送信処理
      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...guestInfo,
          check_in_date: bookingDates.checkIn,
          check_out_date: bookingDates.checkOut
        }),
      });

      if (!emailResponse.ok) {
        throw new Error("メール送信に失敗しました");
      }

      // メール送信成功時にローカルストレージをクリア
      localStorage.removeItem("bookingDates");
      localStorage.removeItem("bookingAmount");
      localStorage.removeItem("guestInfo");
      
      router.push("/email-sent");
    } catch (error) {
      console.error("Error details:", error);
      alert(error instanceof Error ? error.message : "処理に失敗しました。もう一度お試しください。");
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>入力内容の確認 / Confirm Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">お客様情報 / Guest Information</h2>
              <div className="grid gap-2">
                <div>
                  <p className="text-sm text-gray-500">お名前 / Name</p>
                  <p className="font-medium">{`${guestInfo.last_name} ${guestInfo.first_name}`}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">メールアドレス / Email</p>
                  <p className="font-medium">{guestInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">電話番号 / Phone</p>
                  <p className="font-medium">{guestInfo.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">住所 / Address</p>
                  <p className="font-medium">{guestInfo.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">予約金額 / Amount</p>
                  <p className="font-medium">¥{guestInfo.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-between">
              <Button
                onClick={handleBack}
                variant="outline"
              >
                修正する / Edit
              </Button>
              <Button
                onClick={handleConfirm}
              >
                確認する / Confirm
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 