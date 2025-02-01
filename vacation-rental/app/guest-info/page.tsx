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
          <CardTitle>お客様情報の入力（代表者のみ）/ Guest Information (Primary Guest)</CardTitle>
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

            <Button type="submit" className="w-full">予約を確定する / Confirm Reservation</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

