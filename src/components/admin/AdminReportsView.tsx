"use client";

import {
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Download,
  Wallet,
  Wrench,
} from "lucide-react";
import { useMemo } from "react";

import AnalyticsChart, {
  type ChartDatum,
} from "@/components/admin/AnalyticsChart";
import Button from "@/components/common/Button";
import DashboardIntro from "@/components/common/DashboardIntro";
import EmptyState from "@/components/common/EmptyState";
import StatCard from "@/components/common/StatCard";
import { useAdminOverview } from "@/hooks/useAdminData";
import { useBookings } from "@/hooks/useBookings";
import type { BookingStatus } from "@/types/booking";
import { bookingStatusMeta } from "@/utils/statusHelpers";
import { formatCurrency } from "@/utils/formatCurrency";

const MONTHS = [
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

const STATUS_ORDER: BookingStatus[] = [
  "pending",
  "confirmed",
  "in-progress",
  "completed",
  "cancelled",
];

function monthLabel(key: string): string {
  const [year, month] = key.split("-");
  const index = Number(month) - 1;
  return `${MONTHS[index] ?? month} ${year}`;
}

interface RankedRow {
  id: string;
  name: string;
  bookings: number;
  value: number;
}

/** API-backed summary with booking-derived charts across Quicker. */
export default function AdminReportsView() {
  const { bookings } = useBookings();
  const {
    overview,
    loading: overviewLoading,
    error: overviewError,
  } = useAdminOverview();

  const activeBookings = useMemo(
    () => bookings.filter((booking) => booking.status !== "cancelled"),
    [bookings],
  );

  const completionRate = overview && overview.totalBookings > 0
    ? Math.round((overview.completedBookings / overview.totalBookings) * 100)
    : 0;

  const statusData = useMemo<ChartDatum[]>(
    () =>
      STATUS_ORDER.map((status) => ({
        label: bookingStatusMeta(status).label,
        value: bookings.filter((booking) => booking.status === status).length,
      })).filter((item) => item.value > 0),
    [bookings],
  );

  const statusRows = useMemo(
    () =>
      STATUS_ORDER.map((status) => {
        const matching = bookings.filter((booking) => booking.status === status);
        return {
          status,
          count: matching.length,
          value: matching.reduce((sum, booking) => sum + booking.price, 0),
        };
      }).filter((row) => row.count > 0),
    [bookings],
  );

  const monthlyData = useMemo<ChartDatum[]>(() => {
    const totals = activeBookings.reduce<Record<string, number>>(
      (months, booking) => {
        const key = booking.createdAt.slice(0, 7);
        months[key] = (months[key] ?? 0) + booking.price;
        return months;
      },
      {},
    );

    return Object.keys(totals)
      .sort()
      .map((key) => ({ label: monthLabel(key), value: totals[key] }));
  }, [activeBookings]);

  const topServices = useMemo<RankedRow[]>(() => {
    const groups = new Map<string, RankedRow>();
    activeBookings.forEach((booking) => {
      const row = groups.get(booking.serviceId) ?? {
        id: booking.serviceId,
        name: booking.serviceName,
        bookings: 0,
        value: 0,
      };
      row.bookings += 1;
      row.value += booking.price;
      groups.set(booking.serviceId, row);
    });
    return [...groups.values()]
      .sort((a, b) => b.bookings - a.bookings || b.value - a.value)
      .slice(0, 5);
  }, [activeBookings]);

  const topProviders = useMemo<RankedRow[]>(() => {
    const groups = new Map<string, RankedRow>();
    activeBookings.forEach((booking) => {
      const row = groups.get(booking.providerId) ?? {
        id: booking.providerId,
        name: booking.providerName,
        bookings: 0,
        value: 0,
      };
      row.bookings += 1;
      row.value += booking.price;
      groups.set(booking.providerId, row);
    });
    return [...groups.values()]
      .sort((a, b) => b.bookings - a.bookings || b.value - a.value)
      .slice(0, 5);
  }, [activeBookings]);

  function exportCsv() {
    const escape = (value: string | number) =>
      `"${String(value).replace(/"/g, '""')}"`;
    const header = [
      "Reference",
      "Booked on",
      "Service date",
      "Service",
      "Customer",
      "Provider",
      "Status",
      "Price (PKR)",
    ];
    const lines = [
      header.map(escape).join(","),
      ...bookings.map((booking) =>
        [
          booking.reference,
          booking.createdAt.slice(0, 10),
          booking.date,
          booking.serviceName,
          booking.customerName,
          booking.providerName,
          booking.status,
          booking.price,
        ]
          .map(escape)
          .join(","),
      ),
    ];
    const blob = new Blob(["\uFEFF", lines.join("\r\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "quicker-admin-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <DashboardIntro
        title="Platform reports"
        description="Booking, revenue and catalogue performance across Quicker."
        action={
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Export CSV
          </Button>
        }
      />

      {overviewLoading ? (
        <p
          role="status"
          className="rounded-xl border border-line bg-card px-4 py-3 text-sm text-muted"
        >
          Loading the platform summary…
        </p>
      ) : null}
      {overviewError ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {overviewError}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total bookings"
          value={overview ? overview.totalBookings.toString() : "—"}
          icon={CalendarCheck}
          hint="All bookings in the marketplace"
        />
        <StatCard
          label="Booked value"
          value={overview ? formatCurrency(overview.revenue) : "—"}
          icon={Wallet}
          hint="Completed bookings"
        />
        <StatCard
          label="Completion rate"
          value={overview ? `${completionRate}%` : "—"}
          icon={CheckCircle2}
          hint={
            overview
              ? `${overview.completedBookings} completed bookings`
              : "Completion data unavailable"
          }
        />
        <StatCard
          label="Services"
          value={overview ? overview.services.toString() : "—"}
          icon={Wrench}
          hint="Listed in the catalogue"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AnalyticsChart
          title="Booked value by month"
          description="Monthly value of all non-cancelled bookings."
          data={monthlyData}
          formatValue={(value) => formatCurrency(value)}
        />
        <AnalyticsChart
          title="Bookings by status"
          description="Current distribution of booking states."
          data={statusData}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6">
          <h3 className="text-base font-bold text-heading">Top services</h3>
          <p className="mt-1 text-sm text-muted">
            Most booked services by booking volume.
          </p>
          <RankedTable rows={topServices} />
        </section>
        <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6">
          <h3 className="text-base font-bold text-heading">Top providers</h3>
          <p className="mt-1 text-sm text-muted">
            Providers with the most booked work.
          </p>
          <RankedTable rows={topProviders} />
        </section>
      </div>

      <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
          <h3 className="text-base font-bold text-heading">
            Booking status breakdown
          </h3>
        </div>
        <p className="mt-1 text-sm text-muted">
          Booked value includes all bookings in each status.
        </p>
        <div className="mt-5 table-scroll">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-background text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Bookings</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Booked value
                </th>
              </tr>
            </thead>
            <tbody>
              {statusRows.map((row) => (
                <tr
                  key={row.status}
                  className="border-b border-line last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-heading">
                    {bookingStatusMeta(row.status).label}
                  </td>
                  <td className="px-4 py-3 text-muted">{row.count}</td>
                  <td className="px-4 py-3 text-right font-semibold text-heading">
                    {formatCurrency(row.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function RankedTable({ rows }: { rows: RankedRow[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No booking data yet"
        description="Analytics will appear once bookings are created."
      />
    );
  }

  return (
    <div className="mt-5 table-scroll">
      <table className="w-full min-w-[380px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-background text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Bookings</th>
            <th className="px-4 py-3 text-right font-semibold">Booked value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-line last:border-0">
              <td className="px-4 py-3 font-medium text-heading">{row.name}</td>
              <td className="px-4 py-3 text-muted">{row.bookings}</td>
              <td className="px-4 py-3 text-right font-semibold text-heading">
                {formatCurrency(row.value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
