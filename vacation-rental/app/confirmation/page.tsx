"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmationPage() {
  const router = useRouter();

  useEffect(() => {
    // クエリパラメータをチェック
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") === "canceled") {
      router.replace("/cancel"); // キャンセル時はキャンセルページへ
    }

    // ページのキャッシュを防ぐ
    window.history.replaceState(null, "", window.location.href);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">予約が完了しました</h1>
      <p className="text-gray-600">予約確認メールを送信しましたので、ご確認ください。</p>
    </div>
  );
}
