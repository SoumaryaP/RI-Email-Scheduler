"use client";

import Link from "next/link";
import {
  Send,
  Clock,
  PenSquare,
  Mail,
  FileText,
  BarChart2,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
  Plus,
  Check,
  PlayCircle,
} from "lucide-react";
import styles from "./landing.module.css";
import { useAuth } from "@/hooks/useAuth";

const MAIL_ROWS = [
  { initials: "PJ", color: "#5b6ee8", subject: "Project update and next steps", time: "Tomorrow, 9:15 AM" },
  { initials: "MR", color: "#2dd4bf", subject: "Meeting recap and actions", time: "Tomorrow, 11:00 AM" },
  { initials: "DR", color: "#f5a524", subject: "Quarterly results and insights", time: "Tomorrow, 1:30 PM" },
  { initials: "SK", color: "#e8618c", subject: "Invitation: design review session", time: "Fri, 9:00 AM" },
  { initials: "AL", color: "#7c6ee8", subject: "Follow up on partnership", time: "Fri, 3:45 PM" },
];

const CAL_DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const CAL_DATES = [
  { d: 27, dim: true }, { d: 28, dim: true }, { d: 29, dim: true }, { d: 30, dim: true },
  { d: 1 }, { d: 2 }, { d: 3 },
  { d: 4 }, { d: 5 }, { d: 6 }, { d: 7 }, { d: 8 }, { d: 9 }, { d: 10 },
  { d: 11 }, { d: 12 }, { d: 13 }, { d: 14, today: true }, { d: 15 }, { d: 16 }, { d: 17 },
];

const STEPS = [
  { title: "Compose", body: "Write the email like you always do. Nothing new to learn." },
  { title: "Schedule", body: "Pick the exact date and time it should land in their inbox." },
  { title: "Arrive", body: "It sends itself — even if you're asleep, or in a meeting, or offline." },
];

const PREVIEW_ROWS = [
  { subject: "Contract renewal — final terms", time: "Tomorrow, 7:00 AM", status: "scheduled" as const },
  { subject: "Welcome aboard, Alex", time: "Fri, 9:00 AM", status: "scheduled" as const },
  { subject: "Q2 recap for the board", time: "Sent · Mon, 8:15 AM", status: "sent" as const },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const ctaHref = isAuthenticated ? "/dashboard" : "/login";
  const ctaLabel = isAuthenticated ? "Go to dashboard" : "Start free";

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <nav className={styles.nav}>
          <div className={styles.navLeft}>
            <Link href="/" className={styles.brand}>
              <span className={styles.brandIcon}>
                <Mail size={18} />
              </span>
              <span className={styles.brandName}>ReachInbox</span>
            </Link>

            <div className={styles.navLinks}>
              <a href="#how-it-works">Features</a>
              <a href="#how-it-works">How it works</a>
              <a href="#glimpse">Dashboard</a>
            </div>
          </div>

          <div className={styles.navRight}>
            <Link href="/login" className={styles.loginLink}>
              Log in
            </Link>
            <Link href={ctaHref} className={styles.getStarted}>
              Get started
            </Link>
          </div>
        </nav>

        <section className={styles.hero}>
          <div>
            <span className={styles.badge}>
              <span className={styles.badgeDot} />
              New: schedule with recipient time zones
            </span>

            <h1 className={styles.headline}>
              Schedule emails that land at the perfect moment
            </h1>

            <p className={styles.subhead}>
              Write when inspiration strikes. Let ReachInbox deliver at the
              time your recipient is most likely to read, reply, and
              remember.
            </p>

            <div className={styles.ctaRow}>
              <Link href={ctaHref} className={styles.ctaPrimary}>
                {ctaLabel} <Send size={16} />
              </Link>
              <a href="#how-it-works" className={styles.ctaGhost}>
                <PlayCircle size={17} /> See how it works
              </a>
            </div>

            <div className={styles.trustRow}>
              <span>
                <Check size={16} className={styles.trustCheck} /> Sign in
                with Google
              </span>
              <span>
                <Check size={16} className={styles.trustCheck} /> No card
                required
              </span>
              <span>
                <Check size={16} className={styles.trustCheck} /> Cancel
                anytime
              </span>
            </div>
          </div>

          <div className={styles.mockupWrap} aria-hidden="true">
            <div className={styles.mockup}>
              <div className={styles.mockupSidebar}>
                <span className={styles.sidebarIcon}>
                  <Send size={17} />
                </span>
                <span className={`${styles.sidebarIcon} ${styles.isActive}`}>
                  <Clock size={17} />
                </span>
                <span className={styles.sidebarIcon}>
                  <PenSquare size={17} />
                </span>
                <span className={styles.sidebarIcon}>
                  <Mail size={17} />
                </span>
                <span className={styles.sidebarIcon}>
                  <FileText size={17} />
                </span>
                <span className={styles.sidebarIcon}>
                  <BarChart2 size={17} />
                </span>
                <span className={styles.sidebarIcon}>
                  <Users size={17} />
                </span>
                <span className={styles.sidebarIcon}>
                  <Settings size={17} />
                </span>
              </div>

              <div className={styles.mockupMain}>
                <div className={styles.mockupMainHead}>
                  <span className={styles.addBtn}>
                    <Plus size={14} /> New
                  </span>
                  <span className={styles.filterBtn}>
                    <Filter size={13} /> Filter <ChevronDown size={13} />
                  </span>
                </div>

                {MAIL_ROWS.map((row) => (
                  <div className={styles.mailRow} key={row.subject}>
                    <span
                      className={styles.avatar}
                      style={{ background: row.color }}
                    >
                      {row.initials}
                    </span>
                    <span className={styles.mailBody}>
                      <span className={styles.mailSubject}>
                        <span className={styles.mailDot} />
                        {row.subject}
                      </span>
                    </span>
                    <span className={styles.mailTime}>
                      <Clock size={12} />
                      {row.time}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.mockupCalendar}>
                <div className={styles.calCard}>
                  <div className={styles.calHead}>
                    <ChevronLeft size={14} />
                    <span>July 2026</span>
                    <ChevronRight size={14} />
                  </div>
                  <div className={styles.calGrid}>
                    {CAL_DAYS.map((d, i) => (
                      <span key={`h-${i}`}>{d}</span>
                    ))}
                    {CAL_DATES.map((c, i) => (
                      <span
                        key={i}
                        className={
                          c.today
                            ? styles.isToday
                            : c.dim
                            ? styles.isDim
                            : undefined
                        }
                      >
                        {c.d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.statCard}>
                  <span className={styles.donut} />
                  <span className={styles.statLegend}>
                    <span>
                      <span
                        className={styles.legendDot}
                        style={{ background: "#2dd4bf" }}
                      />
                      8 scheduled
                    </span>
                    <span>
                      <span
                        className={styles.legendDot}
                        style={{ background: "#f5a524" }}
                      />
                      3 sent today
                    </span>
                    <span>
                      <span
                        className={styles.legendDot}
                        style={{ background: "#e7e1d2" }}
                      />
                      2 drafts
                    </span>
                  </span>
                </div>

                <div className={styles.trendCard}>
                  <span className={styles.trendLine} />
                  <span className={styles.trendLine} />
                  <span className={styles.trendLine} />
                </div>
              </div>

              <div className={styles.bottomIcons}>
                <span
                  className={styles.bottomIcon}
                  style={{ background: "#2dd4bf" }}
                >
                  <Clock size={15} />
                </span>
                <span
                  className={styles.bottomIcon}
                  style={{ background: "#f5a524" }}
                >
                  <FileText size={15} />
                </span>
                <span
                  className={styles.bottomIcon}
                  style={{ background: "#16214a" }}
                >
                  <Send size={15} />
                </span>
              </div>
            </div>

            <div className={styles.floatCard}>
              <span className={styles.floatIcon}>
                <Clock size={18} />
              </span>
              <span>
                <p className={styles.floatTitle}>Next email scheduled</p>
                <p className={styles.floatBody}>
                  Tomorrow, 9:15 AM · recipient&apos;s local time
                </p>
              </span>
            </div>
          </div>
        </section>

        <section id="how-it-works" className={styles.section}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionEyebrow}>How it works</p>
            <h2 className={styles.sectionTitle}>
              Three steps, then it&apos;s out of your hands.
            </h2>
          </div>

          <div className={styles.steps}>
            {STEPS.map((step, i) => (
              <div className={styles.step} key={step.title}>
                <p className={styles.stepIndex}>0{i + 1}</p>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="glimpse" className={styles.section}>
          <div className={styles.glimpse}>
            <div className={styles.glimpseText}>
              <p className={styles.sectionEyebrow}>Your dashboard</p>
              <h2 className={styles.sectionTitle}>
                Every email you&apos;ve queued, in one place.
              </h2>
              <p>
                See what&apos;s waiting, what already went out, and cancel
                anything before it sends. No spreadsheets, no sticky notes
                on your monitor.
              </p>
            </div>

            <div className={styles.tablePreview} aria-hidden="true">
              <div className={`${styles.tableRow} ${styles.isHead}`}>
                <span>Subject</span>
                <span>Send time</span>
                <span>Status</span>
              </div>
              {PREVIEW_ROWS.map((row) => (
                <div className={styles.tableRow} key={row.subject}>
                  <span className={styles.tableSubject}>{row.subject}</span>
                  <span className={styles.tableTime}>{row.time}</span>
                  <span className={`${styles.pill} ${styles[row.status]}`}>
                    {row.status === "sent" ? "Sent" : "Scheduled"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.closing}>
          <h2 className={styles.closingTitle}>
            Stop hitting send <em>at the wrong hour.</em>
          </h2>
          <Link href={ctaHref} className={styles.ctaPrimary}>
            {ctaLabel} <Send size={16} />
          </Link>
        </section>

        <footer className={styles.footer}>
          <span>ReachInbox</span>
          <span>Built for people who write emails at odd hours.</span>
        </footer>
      </div>
    </div>
  );
}
