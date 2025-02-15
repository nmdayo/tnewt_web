import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function BookingForm() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch("/api/bookings");
        const data = await response.json();
        if (data.bookedDates) {
          setBookedDates(data.bookedDates.map((date: string) => new Date(date)));
        }
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      }
    }
    fetchBookings();
  }, []);

  const handleBooking = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      alert("日付を選択してください");
      return;
    }

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkIn: dateRange.from.toISOString().split("T")[0],
          checkOut: dateRange.to.toISOString().split("T")[0],
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("予約が完了しました");
        setBookedDates([...bookedDates, dateRange.from, dateRange.to]);
      } else {
        alert(`エラー: ${data.error}`);
      }
    } catch (error) {
      console.error("Error booking:", error);
    }
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <div>
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "yyyy/MM/dd", { locale: ja })}
                    {" - "}
                    {format(dateRange.to, "yyyy/MM/dd", { locale: ja })}
                  </>
                ) : (
                  format(dateRange.from, "yyyy/MM/dd", { locale: ja })
                )
              ) : (
                "日付を選択"
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={new Date()}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            disabled={(date) => {
              return bookedDates.some(
                (bookedDate) => bookedDate.toDateString() === date.toDateString()
              );
            }}
          />
        </PopoverContent>
      </Popover>

      <Button onClick={handleBooking}>予約する</Button>
    </div>
  );
}
