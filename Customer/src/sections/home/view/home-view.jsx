import Stack from '@mui/material/Stack';
import { BackToTop } from 'src/components/animate/back-to-top';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { HomeHero } from '../home-hero';
import { HomeFAQs } from '../home-faqs';
import { HomeZoneUI } from '../home-zone-ui';
import { HomePricing } from '../home-pricing';
import { HomeTestimonials } from '../home-testimonials';
import { HomeAdvertisement } from '../home-advertisement';

export function HomeView() {
  // Hook to track page scroll progress for scroll indicator
  const pageProgress = useScrollProgress();

  return (
    <>
      {/* Scroll progress bar for visual feedback on page scroll */}
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={{ position: 'fixed', top: 0, zIndex: 9999 }}
      />

      {/* Button to quickly scroll back to top */}
      <BackToTop />

      {/* Main Hero Section */}
      <HomeHero />

      {/* Content stack for homepage sections */}
      <Stack sx={{ position: 'relative', bgcolor: 'background.default' }}>
        {/* Pricing section for e-commerce plans, deals, or products */}
        <HomePricing />

        {/* Customer testimonials section */}
        <HomeTestimonials />

        {/* Frequently Asked Questions (FAQs) section */}
        <HomeFAQs />

        {/* Interactive UI/UX section for user engagement */}
        <HomeZoneUI />

        {/* Advertisement or promotional banner section */}
        <HomeAdvertisement />
      </Stack>
    </>
  );
}
