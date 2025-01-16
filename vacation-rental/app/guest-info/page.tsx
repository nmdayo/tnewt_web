'use client'

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { GuestInformation } from "@/types/booking"

export default function GuestInfoPage() {
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Here you would typically send the data to your server
    // For now, we'll just redirect to the confirmation page
    router.push("/confirmation")
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>お客様情報の入力</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">氏名</Label>
              <Input id="name" name="name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameKana">フリガナ</Label>
              <Input id="nameKana" name="nameKana" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">住所</Label>
              <Input id="address" name="address" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">電話番号</Label>
              <Input id="phone" name="phone" type="tel" required />
            </div>

            <Button type="submit" className="w-full">予約を確定する</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

