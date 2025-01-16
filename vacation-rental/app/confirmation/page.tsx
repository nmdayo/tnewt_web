import { CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfirmationPage() {
  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <CardTitle>予約が完了しました</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            ご予約ありがとうございます。予約確認メールを送信しましたので、ご確認ください。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

