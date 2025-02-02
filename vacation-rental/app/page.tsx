'use client';

import {
  Ban,
  Wifi,
  ShowerHeadIcon as Shower,
  Refrigerator,
  Waves,
  Utensils,
  CreditCard,
  Users,
} from "lucide-react";
import { BookingForm } from "@/components/booking-form";
import { AmenityCard } from "@/components/amenity-card";
import type { Amenity } from "@/types/booking";

const amenities: Amenity[] = [
  { name: "禁煙", description: "施設内は全て禁煙です", icon: Ban },
  { name: "Wi-Fi", description: "無料Wi-Fiを完備しています", icon: Wifi },
  { name: "シャワー/風呂", description: "清潔なバスルームを完備", icon: Shower },
  { name: "冷蔵庫", description: "冷蔵庫完備", icon: Refrigerator },
  { name: "洗濯機", description: "無料で洗濯機をご利用いただけます", icon: Waves },
  { name: "BBQ", description: "BBQ設備があります（要予約）", icon: Utensils },
  { name: "支払い方法", description: "クレジットカード・現金対応", icon: CreditCard },
  { name: "定員", description: "最大4名様までご利用いただけます", icon: Users },
];

export default function DetailsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">宿泊施設の詳細</h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {amenities.map((amenity) => (
          <AmenityCard key={amenity.name} amenity={amenity} />
        ))}
      </div>

      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">予約フォーム</h2>
        <BookingForm />
      </div>
    </div>
  );
}
