import React from 'react';
import HeroCard from './HeroCard';
import CategoryCards from './CategoryCards';
import AppPromoBanner from './AppPromoBanner';

function Home() {
  return (
    <>
      <HeroCard />
      <CategoryCards />
      <AppPromoBanner />
    </>
  );
}

export default Home;
