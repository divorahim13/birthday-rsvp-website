import Image from "next/image";
import Link from "next/link";
import { ArrowDown, CalendarDays, Clock, MapPin, Sparkles, Utensils } from "lucide-react";

import { RsvpForm } from "@/components/rsvp-form";
import { eventConfig } from "@/lib/event-config";

const detailIcons = [Clock, Utensils, Sparkles];

export default function Home() {
  return (
    <main>
      <section className="relative min-h-[86svh] overflow-hidden bg-[var(--color-ink)] text-white">
        <Image
          src="/images/hero-table-v2.png"
          alt="A warm birthday dinner table with invitation cards, citrus, candles, and flowers"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[35%_center] sm:object-center"
        />
        <div className="absolute inset-0 bg-[rgba(30,25,22,0.38)]" aria-hidden="true" />
        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="font-serif text-xl">
            {eventConfig.celebrantName}
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium sm:flex">
            <a href="#details" className="hover:text-[var(--color-celadon)]">
              Details
            </a>
            <a href="#itinerary" className="hover:text-[var(--color-celadon)]">
              Weekend
            </a>
            <a href="#rsvp" className="hover:text-[var(--color-celadon)]">
              RSVP
            </a>
          </div>
        </nav>

        <div className="relative z-10 mx-auto flex min-h-[calc(86svh-5rem)] max-w-7xl items-end px-5 pb-14 pt-20 sm:px-8 md:pb-20">
          <div className="max-w-3xl soft-rise">
            <p className="mb-5 inline-flex rounded-full bg-white/16 px-4 py-2 text-sm font-semibold backdrop-blur-md">
              {eventConfig.date} | {eventConfig.time}
            </p>
            <h1 className="font-serif text-5xl leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              <span style={{ textShadow: "0 3px 22px rgba(0,0,0,0.42)" }}>{eventConfig.eventTitle}</span>
            </h1>
            <p
              className="mt-6 max-w-2xl text-lg leading-8 text-white/88 sm:text-xl"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.38)" }}
            >
              {eventConfig.shortIntro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#rsvp"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#2b2926] transition hover:bg-[var(--color-celadon)]"
                style={{ color: "#2b2926" }}
              >
                <ArrowDown className="size-4" aria-hidden="true" />
                <span>RSVP now</span>
              </a>
              <a
                href={eventConfig.mapLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/55 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[var(--color-ink)]"
              >
                <MapPin className="size-4" aria-hidden="true" />
                View map
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="details" className="px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold text-[var(--color-wine)]">The invitation</p>
              <h2 className="mt-3 font-serif text-4xl leading-tight text-[var(--color-ink)] sm:text-5xl">
                A birthday dinner with room for the whole weekend.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--color-muted)]">
                The plan is simple: arrive unrushed, stay awhile, and leave with one more story than you came with.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {eventConfig.details.map((detail, index) => {
                const Icon = detailIcons[index] ?? CalendarDays;

                return (
                  <article key={detail.label} className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-5 shadow-[0_18px_54px_rgba(47,40,34,0.06)]">
                    <div className="mb-5 flex size-11 items-center justify-center rounded-full bg-[var(--color-celadon)] text-[var(--color-ink)]">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--color-ink)]">{detail.label}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{detail.value}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="mt-10 grid gap-4 rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-ink)] p-5 text-white shadow-[0_24px_70px_rgba(43,41,38,0.16)] md:grid-cols-3 md:p-7">
            <div>
              <p className="text-sm text-white/62">Date</p>
              <p className="mt-1 text-lg font-semibold">{eventConfig.date}</p>
            </div>
            <div>
              <p className="text-sm text-white/62">Venue</p>
              <p className="mt-1 text-lg font-semibold">{eventConfig.venue}</p>
            </div>
            <div>
              <p className="text-sm text-white/62">Address</p>
              <p className="mt-1 text-lg font-semibold">{eventConfig.address}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="itinerary" className="border-y border-[var(--color-line)] bg-white/62 px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold text-[var(--color-wine)]">Weekend rhythm</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-[var(--color-ink)] sm:text-5xl">
              Enough structure to feel easy, enough space to feel like a getaway.
            </h2>
            <div className="mt-6 rounded-[1.5rem] bg-[var(--color-celadon)] p-5">
              <p className="text-sm font-semibold text-[var(--color-ink)]">Dress code</p>
              <p className="mt-2 text-base leading-7 text-[var(--color-ink)]">{eventConfig.dressCode}</p>
            </div>
          </div>

          <div className="grid gap-4">
            {eventConfig.itinerary.map((item) => (
              <article
                key={`${item.time}-${item.title}`}
                className="grid gap-4 rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-paper)] p-5 sm:grid-cols-[7rem_1fr]"
              >
                <time className="text-sm font-semibold text-[var(--color-wine)]">{item.time}</time>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-ink)]">{item.title}</h3>
                  <p className="mt-2 leading-7 text-[var(--color-muted)]">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="rsvp" className="px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="lg:sticky lg:top-8">
            <p className="text-sm font-semibold text-[var(--color-wine)]">Reply by July 31</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-[var(--color-ink)] sm:text-5xl">
              Say yes, no, or not quite sure yet.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[var(--color-muted)]">
              Questions can go to {eventConfig.contactPerson}. The RSVP note is also a good place for dietary needs, travel timing, or a song request with conviction.
            </p>
          </div>
          <RsvpForm />
        </div>
      </section>

      <section className="border-t border-[var(--color-line)] bg-[var(--color-ink)] px-5 py-16 text-white sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold text-[var(--color-celadon)]">Good to know</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight">Small details, fewer loose ends.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {eventConfig.faqs.map((item) => (
              <article key={item.question} className="rounded-[1.5rem] border border-white/14 bg-white/8 p-5">
                <h3 className="text-lg font-semibold">{item.question}</h3>
                <p className="mt-3 text-sm leading-6 text-white/72">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
