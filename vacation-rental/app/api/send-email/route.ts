import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// メール送信用のトランスポーター設定
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: Request) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("メール設定が不正です");
    }

    const data = await request.json();
    const { lastName, firstName, email, phone } = data;

    // メールの内容を作成
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "入力内容の確認 / Confirmation of Your Information",
      html: `
        <h2>入力内容の確認 / Confirmation of Your Information</h2>
        
        <p>以下の内容で承りました。/ We have received your information as follows:</p>
        
        <div style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
          <p><strong>お名前 / Name:</strong> ${lastName} ${firstName}</p>
          <p><strong>メールアドレス / Email:</strong> ${email}</p>
          <p><strong>電話番号 / Phone:</strong> ${phone}</p>
        </div>
        
        <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
        <p>If you have any questions, please feel free to contact us.</p>
      `,
    };

    // メールを送信
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "メールの送信に失敗しました" },
      { status: 500 }
    );
  }
} 