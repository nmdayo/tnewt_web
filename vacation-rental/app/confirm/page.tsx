'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type GuestInfo = {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  amount: number;
};

export default function ConfirmPage() {
  const router = useRouter();
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    amount: 0
  });

  useEffect(() => {
    const savedGuestInfo = localStorage.getItem("guestInfo");
    if (savedGuestInfo) {
      setGuestInfo(JSON.parse(savedGuestInfo));
    } else {
      router.push("/guest-info");
    }
  }, [router]);

  const handleBack = () => {
    router.push("/guest-info");
  };

  const handleConfirm = async () => {
    try {
      // メール送信APIを呼び出し（金額情報を追加）
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...guestInfo,
          amount: guestInfo.amount
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "メール送信に失敗しました");
      }

      router.push("/email-sent");
    } catch (error) {
      console.error("Error sending email:", error);
      alert(error instanceof Error ? error.message : "メールの送信に失敗しました。もう一度お試しください。");
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
                  <p className="font-medium">{`${guestInfo.lastName} ${guestInfo.firstName}`}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">メールアドレス / Email</p>
                  <p className="font-medium">{guestInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">電話番号 / Phone</p>
                  <p className="font-medium">{guestInfo.phone}</p>
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