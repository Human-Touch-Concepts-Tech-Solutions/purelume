'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Heart,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import {
  favoursItems,
  preservationItems,
  mainNavLinks
} from './NavigationStyle';
import styles from './Navigation.module.css';

export default function Navigation({ cartCount = 0, wishlistCount = 0 }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileDropdown, setExpandedMobileDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileDropdown = (title) => {
    setExpandedMobileDropdown(
      expandedMobileDropdown === title ? null : title
    );
  };

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}
    >
      <div className={styles.container}>
        <div className={styles.navWrapper}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Image 
              src="/logo2.png" 
              alt="Purelume Logo" 
              width={140} 
              height={40} 
              priority 
              style={{ objectFit: 'contain', height: 'auto' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            <Link href="/" className={styles.navLink}>
              Home
            </Link>

            {/* Favours & Giveaways Dropdown */}
            <div
              className={styles.dropdownContainer}
              onMouseEnter={() => setActiveDropdown('favours')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={styles.dropdownTrigger}>
                <span>Events Souvenirs</span>
                <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'favours' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className={styles.megaMenuFavours}
                  >
                    <div className={styles.dropdownContent}>
                      <div className={styles.favoursGrid}>
                        {favoursItems.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.href}
                            className={styles.subItem}
                          >
                            <div className={styles.subItemIcon}>
                              <item.icon size={16} />
                            </div>
                            <div>
                              <div className={styles.subItemTitle}>
                                {item.title}
                              </div>
                              <div className={styles.subItemDesc}>
                                {item.desc}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Flower Preservation Dropdown */}
            <div
              className={styles.dropdownContainer}
              onMouseEnter={() => setActiveDropdown('preservation')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={styles.dropdownTrigger}>
                <span>Products</span>
                <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'preservation' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className={styles.megaMenuPreservation}
                  >
                    <div className={styles.dropdownContent}>
                      <div className={styles.preservationList}>
                        {preservationItems.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.href}
                            className={styles.subItem}
                          >
                            <div className={styles.subItemIcon}>
                              <item.icon size={16} />
                            </div>
                            <div>
                              <div className={styles.subItemTitle}>
                                {item.title}
                              </div>
                              <div className={styles.subItemDesc}>
                                {item.desc}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Standard Links */}
            {mainNavLinks.map((link, idx) => (
              <Link key={idx} href={link.href} className={styles.navLink}>
                {link.title}
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className={styles.actions}>
            <button aria-label="Search" className={styles.iconBtn}>
              <Search size={20} />
            </button>

            <Link href="/wishlist" aria-label="Wishlist" className={styles.iconBtn}>
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className={styles.badge}>{wishlistCount}</span>
              )}
            </Link>

            <Link href="/cart" aria-label="Cart" className={styles.iconBtn}>
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className={styles.badge}>{cartCount}</span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${styles.iconBtn} ${styles.mobileToggle}`}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className={styles.mobileMenu}
          >
            <div className={styles.mobileContent}>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={styles.mobileLink}
              >
                Home
              </Link>

              {/* Mobile Favours */}
              <div>
                <button
                  onClick={() => toggleMobileDropdown('favours')}
                  className={styles.mobileAccordionTrigger}
                >
                  <span>Events Souvenirs</span>
                  <ChevronDown size={16} />
                </button>
                {expandedMobileDropdown === 'favours' && (
                  <div className={styles.mobileSubList}>
                    {favoursItems.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={styles.mobileSubItem}
                      >
                        <item.icon size={16} />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Preservation */}
              <div>
                <button
                  onClick={() => toggleMobileDropdown('preservation')}
                  className={styles.mobileAccordionTrigger}
                >
                  <span>Products</span>
                  <ChevronDown size={16} />
                </button>
                {expandedMobileDropdown === 'preservation' && (
                  <div className={styles.mobileSubList}>
                    {preservationItems.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={styles.mobileSubItem}
                      >
                        <item.icon size={16} />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Links */}
              {mainNavLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={styles.mobileLink}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}