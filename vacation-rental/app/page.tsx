'use client';

import { BookingForm } from "@/components/booking-form";


export default function DetailsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">予約フォーム</h2>
        <BookingForm />
      </div>
    </div>
  );
}
