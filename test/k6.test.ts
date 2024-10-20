/* eslint-disable @typescript-eslint/naming-convention */
import http from 'k6/http';
import { check, sleep } from 'k6';

// Thiết lập thông số kiểm tra
export const options = {
  vus: 20, // Số lượng người dùng ảo (Virtual Users)
  duration: '120s', // Thời gian kiểm tra
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getFutureDate(daysFromNow) {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysFromNow);

  return futureDate.toISOString().split('T')[0]; // Trả về định dạng YYYY-MM-DD
}

export default function () {
  const url = 'http://localhost:3030/api/v1/hotel/search/region';

  // Payload với dữ liệu POST
  const adult = getRandomInt(1, 4);
  const children = getRandomInt(0, 2);
  const infant = getRandomInt(0, 1);

  const checkinDaysFromNow = getRandomInt(1, 30); // Ngày checkin trong vòng 1 đến 30 ngày tới
  const checkin = getFutureDate(checkinDaysFromNow);
  const checkoutDaysFromNow = checkinDaysFromNow + getRandomInt(1, 10); // Checkout là checkin + random(1, 10)
  const checkout = getFutureDate(checkoutDaysFromNow);

  const payload = JSON.stringify({
    rooms: [
      {
        adult,
        children,
        infant,
      },
    ],
    checkin,
    checkout,
    region_id: '1951',
    currency: 'SGD',
  });

  // Thông số headers
  const params = {
    headers: {
      'x-key': 'superkey',
      'x-access-token':
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwid29ya3NwYWNlIjoiYWdlbnQsIiwiaWF0IjoxNzI5MTM0MTc3LCJleHAiOjE3Mjk5OTgxNzd9.ZfkTu-Wg5kwz4SKabS-2oujT-Xd5GQMpNJfOQhr3YlI',
      'Content-Type': 'application/json',
    },
  };
  // Gửi yêu cầu POST
  const res = http.post(url, payload, params);
  check(res, {
    'status was 200': (r) => r.status === 200, // Kiểm tra status code
    'response time < 4000ms': (r) => r.timings.duration < 4000, // Kiểm tra thời gian phản hồi
  });

  // Nghỉ 1 giây trước khi gửi yêu cầu tiếp theo
  sleep(1);
}
