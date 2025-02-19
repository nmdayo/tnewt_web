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
};

export default function ConfirmPage() {
  const router = useRouter();
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    lastName: "",
    firstName: "",
    email: "",
    phone: ""
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

  const handleConfirm = () => {
    // 確認メール送信ページへ遷移
    router.push("/email-sent");
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