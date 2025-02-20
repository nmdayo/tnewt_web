'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GuestInfoPage() {
  const router = useRouter();
  const [guestInfo, setGuestInfo] = useState({
    last_name: "",
    first_name: "",
    email: "",
    phone: "",
    address: "",
    postal_code: "",
    prefecture: "",
    city: "",
    street: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = `〒${guestInfo.postal_code} ${guestInfo.prefecture}${guestInfo.city}${guestInfo.street}`;
    const saveData = {
      ...guestInfo,
      address: fullAddress,
    };
    localStorage.setItem("guestInfo", JSON.stringify(saveData));
    router.push("/confirm");
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>お客様情報入力 / Guest Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="last_name">姓 / Last Name *</Label>
              <Input
                id="last_name"
                value={guestInfo.last_name}
                onChange={(e) => setGuestInfo({ ...guestInfo, last_name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="first_name">名 / First Name</Label>
              <Input
                id="first_name"
                value={guestInfo.first_name}
                onChange={(e) => setGuestInfo({ ...guestInfo, first_name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">メールアドレス / Email</Label>
              <Input
                id="email"
                value={guestInfo.email}
                onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                type="email"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">電話番号 / Phone</Label>
              <Input
                id="phone"
                value={guestInfo.phone}
                onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                type="tel"
                required
              />
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">住所 / Address</h3>
              <div className="grid gap-2">
                <Label htmlFor="postal_code">郵便番号 / Postal Code</Label>
                <Input
                  id="postal_code"
                  value={guestInfo.postal_code}
                  onChange={(e) => setGuestInfo({ ...guestInfo, postal_code: e.target.value })}
                  placeholder="123-4567"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prefecture">都道府県 / Prefecture</Label>
                <Input
                  id="prefecture"
                  value={guestInfo.prefecture}
                  onChange={(e) => setGuestInfo({ ...guestInfo, prefecture: e.target.value })}
                  placeholder="東京都"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">市区町村 / City</Label>
                <Input
                  id="city"
                  value={guestInfo.city}
                  onChange={(e) => setGuestInfo({ ...guestInfo, city: e.target.value })}
                  placeholder="渋谷区"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="street">番地・建物名 / Street Address</Label>
                <Input
                  id="street"
                  value={guestInfo.street}
                  onChange={(e) => setGuestInfo({ ...guestInfo, street: e.target.value })}
                  placeholder="1-2-3 ○○マンション101"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              確認画面へ / Proceed to Confirmation
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
