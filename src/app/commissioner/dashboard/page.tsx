import {
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  FileText,
  Handshake,
  ListChecks,
  ShieldCheck,
  Store,
  TriangleAlert,
  UserCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Commissioner Dashboard",
  description:
    "Manage EliteMart applications, approvals, assignments and commissions.",
};

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  iconClassName: string;
};

type ApplicationStatus =
  | "Pending"
  | "Under review"
  | "Approved"
  | "Rejected";

const applications = [
  {
    id: "APP-3098",
    applicant: "Kigali Digital Store",
    type: "Seller",
    submitted: "Today, 10:35",
    documents: "4 of 4",
    status: "Pending" as ApplicationStatus,
  },
  {
    id: "APP-3097",
    applicant: "Musanze Electronics",
    type: "Dealer",
    submitted: "Today, 09:12",
    documents: "5 of 5",
    status: "Under review" as ApplicationStatus,
  },
  {
    id: "APP-3096",
    applicant: "Nyamirambo Tech Shop",
    type: "Seller",
    submitted: "Yesterday",
    documents: "4 of 4",
    status: "Approved" as ApplicationStatus,
  },
  {
    id: "APP-3095",
    applicant: "Huye Mobile Center",
    type: "Dealer",
    submitted: "Yesterday",
    documents: "3 of 5",
    status: "Rejected" as ApplicationStatus,
  },
  {
    id: "APP-3094",
    applicant: "Eastern Devices Ltd",
    type: "Seller",
    submitted: "2 days ago",
    documents: "4 of 4",
    status: "Under review" as ApplicationStatus,
  },
];

const assignments = [
  {
    name: "Seller verification review",
    organization: "Kigali Digital Store",
    dueDate: "Today",
    progress: 75,
    status: "In progress",
  },
  {
    name: "Dealer document validation",
    organization: "Musanze Electronics",
    dueDate: "Tomorrow",
    progress: 45,
    status: "In progress",
  },
  {
    name: "Business registration check",
    organization: "Eastern Devices Ltd",
    dueDate: "Aug 8",
    progress: 20,
    status: "New",
  },
  {
    name: "Marketplace compliance review",
    organization: "Muhanga Tech Point",
    dueDate: "Aug 9",
    progress: 100,
    status: "Completed",
  },
];

const activities = [
  {
    title: "Seller application approved",
    description:
      "Nyamirambo Tech Shop was approved as a verified seller.",
    time: "12 minutes ago",
    icon: BadgeCheck,
    iconClassName:
      "bg-emerald-100 text-emerald-700",
  },
  {
    title: "New dealer application",
    description:
      "Musanze Electronics submitted verification documents.",
    time: "31 minutes ago",
    icon: Building2,
    iconClassName:
      "bg-brand-mist text-brand-ink",
  },
  {
    title: "Commission credited",
    description:
      "RWF 84,500 was added to your commissioner balance.",
    time: "1 hour ago",
    icon: CircleDollarSign,
    iconClassName:
      "bg-brand-mist text-brand-ink",
  },
  {
    title: "Document requires attention",
    description:
      "One dealer application has incomplete documentation.",
    time: "2 hours ago",
    icon: TriangleAlert,
    iconClassName:
      "bg-brand-mist text-brand-orange",
  },
];

const performanceItems = [
  {
    label: "Application response rate",
    value: "94%",
    progress: 94,
  },
  {
    label: "Verification completion",
    value: "86%",
    progress: 86,
  },
  {
    label: "Assignment completion",
    value: "78%",
    progress: 78,
  },
];

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconClassName,
}: StatCardProps) {
  return (
    <article className="dashboard-card dashboard-stat-card rounded-3xl border border-white bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <span
          className={`grid size-12 place-items-center rounded-2xl ${iconClassName}`}
        >
          <Icon className="size-6" />
        </span>

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
          <ArrowUpRight className="size-3.5" />
          {change}
        </span>
      </div>

      <p className="mt-5 text-sm font-semibold text-brand-ink/70">
        {title}
      </p>

      <p className="mt-1 text-2xl font-black tracking-tight text-brand-ink sm:text-3xl">
        {value}
      </p>
    </article>
  );
}

function applicationStatusClassName(
  status: ApplicationStatus,
): string {
  if (status === "Approved") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "Under review") {
    return "bg-brand-mist text-brand-ink";
  }

  if (status === "Rejected") {
    return "bg-red-100 text-red-700";
  }

  return "bg-brand-mist text-brand-orange";
}

function assignmentStatusClassName(
  status: string,
): string {
  if (status === "Completed") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "New") {
    return "bg-brand-mist text-brand-ink";
  }

  return "bg-brand-mist text-brand-ink";
}

export default function CommissionerDashboardPage() {
  return (
    <div>
      {/* Page heading */}
      <section className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-ink">
            Commissioner overview
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-ink sm:text-4xl">
            Welcome back, Commissioner 👋
          </h1>

          <p className="mt-2 text-sm leading-6 text-brand-ink/70 sm:text-base">
            Review applications, manage assignments and track
            commissions across EliteMart.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/commissioner/assignments"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-steel bg-white px-5 py-3 text-sm font-black text-brand-ink shadow-sm transition hover:border-brand-orange hover:text-brand-ink"
          >
            <Handshake className="size-4" />
            View assignments
          </Link>

          <Link
            href="/commissioner/applications"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-ink px-5 py-3 text-sm font-black text-white shadow-lg shadow-brand-ink/20 transition hover:-translate-y-0.5 hover:bg-brand-ink"
          >
            <FileCheck2 className="size-4" />
            Review applications
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Pending applications"
          value="18"
          change="+4 today"
          icon={FileText}
          iconClassName="bg-brand-mist text-brand-orange"
        />

        <StatCard
          title="Approved this month"
          value="64"
          change="+15.8%"
          icon={ListChecks}
          iconClassName="bg-emerald-100 text-emerald-700"
        />

        <StatCard
          title="Active assignments"
          value="27"
          change="+6.4%"
          icon={Handshake}
          iconClassName="bg-brand-mist text-brand-ink"
        />

        <StatCard
          title="Commission earned"
          value="RWF 3.84M"
          change="+12.3%"
          icon={CircleDollarSign}
          iconClassName="bg-brand-mist text-brand-ink"
        />
      </section>

      {/* Analytics and commission */}
      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]">
        <article className="dashboard-card rounded-3xl border border-white bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-brand-ink">
                Application performance
              </h2>

              <p className="mt-1 text-sm text-brand-ink/70">
                Submitted and approved applications over seven months
              </p>
            </div>

            <select
              defaultValue="7-months"
              className="rounded-xl border border-brand-steel bg-brand-mist px-3 py-2 text-sm font-bold text-brand-ink outline-none focus:border-brand-orange"
            >
              <option value="7-months">
                Last 7 months
              </option>

              <option value="12-months">
                Last 12 months
              </option>
            </select>
          </div>

          <div className="mt-7 overflow-hidden">
            <svg
              viewBox="0 0 760 285"
              role="img"
              aria-label="Commissioner application performance chart"
              className="h-[270px] w-full"
            >
              <defs>
                <linearGradient
                  id="commissionerApplicationsArea"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#2563eb"
                    stopOpacity="0.28"
                  />

                  <stop
                    offset="100%"
                    stopColor="#2563eb"
                    stopOpacity="0"
                  />
                </linearGradient>

                <linearGradient
                  id="commissionerApprovedArea"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#10b981"
                    stopOpacity="0.18"
                  />

                  <stop
                    offset="100%"
                    stopColor="#10b981"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              {[40, 90, 140, 190, 240].map(
                (position) => (
                  <line
                    key={position}
                    x1="30"
                    x2="735"
                    y1={position}
                    y2={position}
                    stroke="#e2e8f0"
                    strokeDasharray="5 7"
                  />
                ),
              )}

              <path
                d="M35 220 C90 205, 115 170, 165 187 C220 205, 245 135, 300 150 C350 164, 380 92, 435 110 C490 126, 520 67, 575 82 C630 96, 675 42, 730 55 L730 260 L35 260 Z"
                fill="url(#commissionerApplicationsArea)"
              />

              <path
                d="M35 220 C90 205, 115 170, 165 187 C220 205, 245 135, 300 150 C350 164, 380 92, 435 110 C490 126, 520 67, 575 82 C630 96, 675 42, 730 55"
                fill="none"
                stroke="#2563eb"
                strokeWidth="5"
                strokeLinecap="round"
              />

              <path
                d="M35 242 C95 232, 120 205, 165 215 C220 226, 250 170, 300 182 C360 194, 390 140, 435 151 C495 165, 525 116, 575 128 C635 140, 680 91, 730 103 L730 260 L35 260 Z"
                fill="url(#commissionerApprovedArea)"
              />

              <path
                d="M35 242 C95 232, 120 205, 165 215 C220 226, 250 170, 300 182 C360 194, 390 140, 435 151 C495 165, 525 116, 575 128 C635 140, 680 91, 730 103"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>

            <div className="grid grid-cols-7 text-center text-xs font-semibold text-brand-steel">
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-5 text-xs font-bold text-brand-ink/70">
              <span className="inline-flex items-center gap-2">
                <span className="size-3 rounded-full bg-brand-ink" />
                Submitted
              </span>

              <span className="inline-flex items-center gap-2">
                <span className="size-3 rounded-full bg-emerald-500" />
                Approved
              </span>
            </div>
          </div>
        </article>

        <article className="dashboard-card rounded-3xl border border-white bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-brand-mist text-brand-ink">
              <Banknote className="size-5" />
            </span>

            <div>
              <h2 className="text-xl font-black text-brand-ink">
                Commission summary
              </h2>

              <p className="text-sm text-brand-ink/70">
                Current earning period
              </p>
            </div>
          </div>

          <div className="mt-7 rounded-3xl bg-gradient-to-br from-brand-ink to-brand-ink p-5 text-white">
            <p className="text-sm font-semibold text-brand-mist">
              Available balance
            </p>

            <p className="mt-2 text-3xl font-black">
              RWF 984,500
            </p>

            <p className="mt-3 text-xs leading-5 text-brand-mist">
              This amount is available for your next payout request.
            </p>

            <Link
              href="/commissioner/payouts"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-brand-ink transition hover:bg-brand-mist"
            >
              Request payout
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-xs font-bold text-emerald-700">
                Paid
              </p>

              <p className="mt-2 text-lg font-black text-emerald-900">
                RWF 2.86M
              </p>
            </div>

            <div className="rounded-2xl bg-brand-mist p-4">
              <p className="text-xs font-bold text-brand-orange">
                Pending
              </p>

              <p className="mt-2 text-lg font-black text-brand-orange">
                RWF 328K
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {performanceItems.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-bold text-brand-ink/70">
                    {item.label}
                  </span>

                  <span className="font-black text-brand-ink">
                    {item.value}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-mist">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-ink to-brand-ink"
                    style={{
                      width: `${item.progress}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Application queue */}
      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.7fr)]">
        <article className="dashboard-card overflow-hidden rounded-3xl border border-white bg-white shadow-[0_14px_35px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-4 border-b border-brand-mist px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-xl font-black text-brand-ink">
                Application queue
              </h2>

              <p className="mt-1 text-sm text-brand-ink/70">
                Recent seller and dealer applications
              </p>
            </div>

            <Link
              href="/commissioner/applications"
              className="text-sm font-black text-brand-ink hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-brand-mist text-left text-xs uppercase tracking-wider text-brand-ink/70">
                  <th className="px-6 py-4 font-black">
                    Application
                  </th>

                  <th className="px-6 py-4 font-black">
                    Applicant
                  </th>

                  <th className="px-6 py-4 font-black">
                    Type
                  </th>

                  <th className="px-6 py-4 font-black">
                    Submitted
                  </th>

                  <th className="px-6 py-4 font-black">
                    Documents
                  </th>

                  <th className="px-6 py-4 font-black">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-brand-mist">
                {applications.map((application) => (
                  <tr
                    key={application.id}
                    className="transition hover:bg-brand-mist/50"
                  >
                    <td className="px-6 py-4 text-sm font-black text-brand-ink">
                      {application.id}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-brand-ink">
                      {application.applicant}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-brand-mist px-3 py-1 text-xs font-black text-brand-ink">
                        {application.type}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-brand-ink/70">
                      {application.submitted}
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-brand-ink">
                      {application.documents}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${applicationStatusClassName(application.status)}`}
                      >
                        {application.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="dashboard-card rounded-3xl border border-white bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-brand-mist text-brand-ink">
              <Clock3 className="size-5" />
            </span>

            <div>
              <h2 className="text-xl font-black text-brand-ink">
                Recent activity
              </h2>

              <p className="text-sm text-brand-ink/70">
                Commissioner account updates
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <div
                  key={`${activity.title}-${activity.time}`}
                  className="flex items-start gap-3"
                >
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-xl ${activity.iconClassName}`}
                  >
                    <Icon className="size-5" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm font-black text-brand-ink">
                      {activity.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-brand-ink/70">
                      {activity.description}
                    </p>

                    <p className="mt-1.5 text-[11px] font-semibold text-brand-steel">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      {/* Assignments and quick actions */}
      <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        <article className="dashboard-card rounded-3xl border border-white bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-brand-ink">
                Current assignments
              </h2>

              <p className="mt-1 text-sm text-brand-ink/70">
                Verification and compliance work
              </p>
            </div>

            <Handshake className="size-6 text-brand-ink" />
          </div>

          <div className="mt-6 space-y-5">
            {assignments.map((assignment) => (
              <div
                key={`${assignment.name}-${assignment.organization}`}
                className="rounded-2xl border border-brand-mist p-4 transition hover:border-brand-steel hover:bg-brand-mist/40"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-sm font-black text-brand-ink">
                      {assignment.name}
                    </p>

                    <p className="mt-1 text-xs text-brand-ink/70">
                      {assignment.organization}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${assignmentStatusClassName(assignment.status)}`}
                    >
                      {assignment.status}
                    </span>

                    <span className="text-xs font-bold text-brand-ink/70">
                      {assignment.dueDate}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-bold text-brand-ink/70">
                      Progress
                    </span>

                    <span className="font-black text-brand-ink">
                      {assignment.progress}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-brand-mist">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-ink to-brand-ink"
                      style={{
                        width: `${assignment.progress}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-card rounded-3xl border border-white bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="size-5" />
            </span>

            <div>
              <h2 className="text-xl font-black text-brand-ink">
                Quick actions
              </h2>

              <p className="text-sm text-brand-ink/70">
                Common commissioner tasks
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <Link
              href="/commissioner/applications"
              className="flex items-center justify-between rounded-2xl bg-brand-mist px-4 py-4 text-sm font-black text-brand-ink transition hover:-translate-y-0.5 hover:bg-brand-mist"
            >
              Review applications
              <ArrowUpRight className="size-5" />
            </Link>

            <Link
              href="/commissioner/approvals"
              className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-4 text-sm font-black text-emerald-800 transition hover:-translate-y-0.5 hover:bg-emerald-100"
            >
              Manage approvals
              <ArrowUpRight className="size-5" />
            </Link>

            <Link
              href="/commissioner/assignments"
              className="flex items-center justify-between rounded-2xl bg-brand-mist px-4 py-4 text-sm font-black text-brand-ink transition hover:-translate-y-0.5 hover:bg-brand-mist"
            >
              Open assignments
              <ArrowUpRight className="size-5" />
            </Link>

            <Link
              href="/commissioner/reports"
              className="flex items-center justify-between rounded-2xl bg-brand-mist px-4 py-4 text-sm font-black text-brand-orange transition hover:-translate-y-0.5 hover:bg-brand-mist"
            >
              View reports
              <BarChart3 className="size-5" />
            </Link>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs leading-5 text-emerald-800">
            <ShieldCheck className="mt-0.5 size-5 shrink-0" />

            <div>
              <p className="font-black">
                Commissioner access verified
              </p>

              <p className="mt-1">
                Your account is active and authorized to review
                marketplace applications.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-brand-mist p-4 text-center">
              <Store className="mx-auto size-5 text-brand-ink" />

              <p className="mt-2 text-xl font-black text-brand-ink">
                286
              </p>

              <p className="text-xs text-brand-ink/70">
                Sellers
              </p>
            </div>

            <div className="rounded-2xl bg-brand-mist p-4 text-center">
              <Users className="mx-auto size-5 text-brand-ink" />

              <p className="mt-2 text-xl font-black text-brand-ink">
                74
              </p>

              <p className="text-xs text-brand-ink/70">
                Dealers
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
