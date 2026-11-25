import type { ComponentProps } from 'react';
import BookingClient from '../dat-lich/BookingClient';

// The home page and /landing/dat-lich share the same form and booking rules.
export default function LandingBookingSection(props: ComponentProps<typeof BookingClient>) {
  return (
    <section id="dat-lich" className="bg-gradient-to-b from-white via-blue-50/40 to-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">Chủ động hẹn khám với <span className="text-blue-600">bác sĩ chuyên khoa</span></h2>
          <p className="mt-3 text-gray-600">Chọn cơ sở, chuyên khoa và giờ khám còn trống từ lịch trực thực tế.</p>
        </div>
        <BookingClient {...props} />
      </div>
    </section>
  );
}
