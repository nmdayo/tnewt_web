'use client';

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function EmailSentPage() {
  const router = useRouter();

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>確認メールを送信しました / Confirmation Email Sent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                ご入力いただいたメールアドレスに確認メールを送信しました。
                <br />
                メールの内容をご確認ください。
              </p>
              <p className="text-gray-600">
                A confirmation email has been sent to your email address.
                <br />
                Please check your inbox.
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => router.push("/")}
              >
                トップページへ戻る / Back to Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 