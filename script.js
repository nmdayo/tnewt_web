function calculateStay() {
  const checkin = new Date(document.getElementById('checkin').value);
  const checkout = new Date(document.getElementById('checkout').value);
  
  if (checkin && checkout && checkout > checkin) {
    // 日付表示の更新関数
    const updateDateDisplay = (date, prefix) => {
      const days = ['日', '月', '火', '水', '木', '金', '土'];
      const dayElement = document.getElementById(`${prefix}-day`);
      const dateElement = document.getElementById(`${prefix}-date`);
      const monthYearElement = document.getElementById(`${prefix}-month-year`);
      
      dayElement.textContent = `${days[date.getDay()]}曜日`;
      dateElement.textContent = date.getDate();
      monthYearElement.textContent = `${date.getMonth() + 1}月 ${date.getFullYear()}`;
    };

    updateDateDisplay(checkin, 'checkin');
    updateDateDisplay(checkout, 'checkout');

    const nights = (checkout - checkin) / (1000 * 60 * 60 * 24);
    document.getElementById('stay-duration').textContent = 
      `${nights}泊`;
    
    calculateTotal(nights);
  }
}

function calculateTotal(nights) {
  const guests = parseInt(document.getElementById('guests').value);
  let total = 0;

  if (!isNaN(nights) && nights > 0) {
    // 基本料金計算（1泊1000円×人数）
    const basePrice = nights * 1000 * guests;
    total = basePrice;

    // オプション料金の計算
    if (document.getElementById('breakfast').checked) total += 2000;
    if (document.getElementById('bbq').checked) total += 5000;
    if (document.getElementById('parking').checked) total += 1000;
  }

  document.getElementById('total-amount').textContent = total.toLocaleString();
}