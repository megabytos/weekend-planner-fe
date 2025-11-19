'use client';

import Container from '@/components/layout/container';
import Section from '@/components/layout/section';

export default function FavoritesPage() {
  return (
    <Section>
      <Container className="py-4 md:py-5 lg:py-8">
        <h1 className="text-center text-3xl font-bold">Favorites</h1>
      </Container>
    </Section>
  );
}
