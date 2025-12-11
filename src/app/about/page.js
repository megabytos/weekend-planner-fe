'use client';

import Link from 'next/link';

import Container from '@/components/layout/container';
import Section from '@/components/layout/section';

const highlights = [
  {
    title: "Who it's for",
    text: 'For city dwellers who want meaningful weekends without extra planning hassle or endless searching.',
  },
  {
    title: 'What it is',
    text: 'WeekendPlanner is an intelligent web assistant for end-to-end weekend planning with personalized suggestions.',
  },
  {
    title: 'How it works',
    text: 'It generates ready-to-use routes—from local coffee spots to out-of-town trips—blending your preferences with geolocation, the city event base, and live weather.',
  },
  {
    title: 'Why it is different',
    text: 'Unlike static listings or scattered tips, it builds cohesive, dynamic leisure scenarios that adapt to your mood and budget.',
  },
];

export default function AboutPage() {
  return (
    <Section>
      <Container className="py-8 md:py-10 lg:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 md:gap-10">
          <header className="space-y-3 text-center">
            <h1 className="text-[28px] font-bold leading-8 md:text-4xl">
              Every weekend can be unique
            </h1>
            <p className="mx-auto max-w-3xl text-base text-gray md:text-lg">
              WeekendPlanner is built for people who value their time and want
              leisure recommendations that adapt to their mood, budget, and
              location.
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {highlights.map(({ title, text }) => (
              <div
                key={title}
                className="flex flex-col gap-2 rounded-2xl border border-white-dark bg-white-dark p-4 md:p-6"
              >
                <h2 className="text-lg font-semibold md:text-xl">{title}</h2>
                <p className="text-sm text-gray md:text-base">{text}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white-dark bg-white p-5 md:p-6">
            <div className="flex flex-col gap-3 md:gap-4">
              <h2 className="text-lg font-semibold md:text-xl">What is next</h2>
              <p className="text-sm text-gray md:text-base">
                The project is in active development: we are adding an ML
                feature for faster planning and preparing a cloud release so
                WeekendPlanner runs instantly anywhere.
              </p>
              <p className="text-sm text-gray md:text-base">
                Like WeekendPlanner? Join in—open an issue or a pull request on{' '}
                <Link
                  href="https://github.com/megabytos/weekend-planner-fe"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue hover:underline"
                >
                  GitHub
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
