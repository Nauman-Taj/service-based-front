"use client";

import {
  CalendarDays,
  CircleDollarSign,
  ListChecks,
  ReceiptText,
  TrendingUp,
  Wallet,
} from "lucide-react";

import Badge from "@/components/common/Badge";
import { ButtonLink } from "@/components/common/Button";
import DashboardIntro from "@/components/common/DashboardIntro";
import EmptyState from "@/components/common/EmptyState";
import StatCard from "@/components/common/StatCard";
import EarningsChart from "@/components/provider/EarningsChart";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function monthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  const name = MONTH_NAMES[Number(month) - 1] ?? month;
  return `${name} ${year.slice(-2)}`;
}

function monthlyTotals(
  bookings: Array<{ date: string; price: number }>,
): Array<{ label: string; value: number }> {
  const grouped = new Map<string, number>();
  for (const booking of bookings) {
    const key = booking.date.slice(0, 7);
    grouped.set(key, (grouped.get(key) ?? 0) + booking.price);
  }
  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => ({ label: monthLabel(key), value }));
}

export default function ProviderEarnings() {
  const { user } = useAuth();
  const { bookings } = useBookings();

  const completed = bookings
    .filter(
      (booking) =>
        booking.providerId === user?.providerId &&
        booking.status === "completed",
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  const total = completed.reduce((sum, booking) => sum + booking.price, 0);
  const average = completed.length ? Math.round(total / completed.length) : 0;
  const monthly = monthlyTotals(completed);

  const latest = monthly.at(-1);

  return (
    <div className="space-y-8">
      <DashboardIntro
        title="Earnings"
        description="A local summary of completed bookings assigned to your provider profile."
        action={
          <ButtonLink href="/provider/bookings" variant="outline" size="sm">
            <ReceiptText className="h-4 w-4" aria-hidden="true" />
            View bookings
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total earnings"
          value={formatCurrency(total)}
          icon={Wallet}
          hint="From completed bookings"
        />
        <StatCard
          label="Completed jobs"
          value={String(completed.length)}
          icon={ListChecks}
          hint="All time on this device"
        />
        <StatCard
          label="Average job value"
          value={formatCurrency(average)}
          icon={CircleDollarSign}
          hint="Per completed booking"
        />
        <StatCard
          label={`${latest?.label ?? "No month"} earnings`}
          value={formatCurrency(latest?.value ?? 0)}
          icon={TrendingUp}
          hint="Latest month with completed work"
        />
      </div>

      <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-7">
        <div>
          <h3 className="text-lg font-bold text-heading">Earnings by month</h3>
          <p className="mt-1 text-sm text-muted">
            Totals are calculated from completed bookings in PKR.
          </p>
        </div>
        <div className="mt-6">
          <EarningsChart data={monthly} />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-5 sm:p-6">
          <div>
            <h3 className="text-lg font-bold text-heading">
              Completed bookings
            </h3>
            <p className="mt-1 text-sm text-muted">
              Each row contributes to the totals above.
            </p>
          </div>
          <Badge variant="success">
            <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
            {completed.length} completed
          </Badge>
        </div>

        {completed.length === 0 ? (
          <div className="p-5 sm:p-6">
            <EmptyState
              icon={CalendarDays}
              title="No completed bookings yet"
              description="Earnings will appear here once your bookings are marked as completed."
            />
          </div>
        ) : (
          <>
            <div className="table-scroll hidden md:block">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-background text-xs font-semibold uppercase tracking-wide text-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3">Customer</th>
                    <th scope="col" className="px-6 py-3">Service</th>
                    <th scope="col" className="px-6 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {completed.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-t border-line text-heading"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-muted">
                        {formatDate(booking.date)}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {booking.customerName}
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {booking.serviceName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right font-semibold">
                        {formatCurrency(booking.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-line md:hidden">
              {completed.map((booking) => (
                <li key={booking.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-heading">
                        {booking.serviceName}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {booking.customerName}
                      </p>
                    </div>
                    <p className="whitespace-nowrap font-bold text-heading">
                      {formatCurrency(booking.price)}
                    </p>
                  </div>
                  <p className="mt-3 text-xs text-muted">
                    {formatDate(booking.date)} · {booking.reference}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
