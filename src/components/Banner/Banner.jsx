'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bannerSlides } from './BannerStyle';
import styles from './Banner.module.css';

export default function Banner({ slides = bannerSlides, autoPlayInterval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [slides, autoPlayInterval]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];
  const hasMultipleSlides = slides.length > 1;

  return (
    <section className={styles.bannerWrapper} aria-label="Hero Banner">
      <div className={styles.aspectContainer}>
        <AnimatePresence initial={false} mode="wait">
         <motion.div
            key={currentSlide.id || currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.slide}
            /* ADD THIS LINE BELOW: */
            style={{ background: currentSlide.background || 'linear-gradient(135deg, #1f2937, #111827)' }}
            >
                        {/* Native Responsive Picture element */}
            <picture className={styles.picture}>
              <source
                media="(min-width: 1024px)"
                srcSet={currentSlide.images.desktop}
              />
              <source
                media="(min-width: 640px)"
                srcSet={currentSlide.images.tablet}
              />
              <img
                src={currentSlide.images.mobile}
                alt={currentSlide.title || 'Banner Slide'}
                className={styles.bannerImage}
              />
            </picture>

            {/* Dark contrast gradient overlay */}
            <div className={styles.overlay} />

            {/* Slide Text Content (Button Removed) */}
            {(currentSlide.title || currentSlide.subtitle) && (
              <div className={styles.contentContainer}>
                <div className={styles.textContent}>
                  {currentSlide.title && (
                    <motion.h1
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className={styles.title}
                    >
                      {currentSlide.title}
                    </motion.h1>
                  )}
                  {currentSlide.subtitle && (
                    <motion.p
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.35, duration: 0.5 }}
                      className={styles.subtitle}
                    >
                      {currentSlide.subtitle}
                    </motion.p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Indicators */}
        {hasMultipleSlides && (
          <div className={styles.indicators}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`${styles.dot} ${
                  index === currentIndex ? styles.activeDot : ''
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}