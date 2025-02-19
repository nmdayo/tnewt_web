'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GuestInfoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const guestData = {
      lastName: formData.get("lastName")?.toString() || "",
      firstName: formData.get("firstName")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
    };

    // ローカルストレージに保存
    localStorage.setItem("guestInfo", JSON.stringify(guestData));

    // 確認ページに遷移（/checkから/confirmに変更）
    router.push("/confirm");
    setLoading(false);
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            お客様情報の入力（代表者のみ）/ Guest Information (Primary Guest)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastName">姓 / Family Name</Label>
                <Input id="lastName" name="lastName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">名 / Given Name</Label>
                <Input id="firstName" name="firstName" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス / Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">電話番号 / Phone</Label>
              <Input id="phone" name="phone" type="tel" required />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "処理中..." : "確認"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
