'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { categoryStyles as styles } from './CategoryStyles';

export default function Category({ categoryName, products = [] }) {
  const [visibleCount, setVisibleCount] = useState(10);
  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  const handleLoadMore = () => {
    if (hasMore) setVisibleCount((prev) => prev + 5);
  };

  return (
    <section style={styles.container}>
      {/* Header */}
      <div style={styles.headerSection}>
        <h1 style={styles.title}>{categoryName}</h1>
        <p style={styles.subText}>
          Showing {Math.min(visibleCount, products.length)} of {products.length} Products
        </p>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No products found in this category.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {visibleProducts.map((product) => (
            <ProductCard key={product._id || product.product_id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination Button */}
      {products.length > 0 && (
        <div style={styles.loadMoreWrapper}>
          <button
            onClick={handleLoadMore}
            disabled={!hasMore}
            style={{
              ...styles.loadMoreBtn,
              ...(hasMore ? styles.loadMoreActive : styles.loadMoreDisabled),
            }}
          >
            {hasMore ? 'Load More Products' : 'No More Products'}
          </button>
          <span style={styles.countText}>
            {Math.min(visibleCount, products.length)} / {products.length} Items Displayed
          </span>
        </div>
      )}
    </section>
  );
}

function ProductCard({ product }) {
  const images = product.images && product.images.length > 0 ? product.images : ['/placeholder.jpg'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  // Cycle images on hover
  useEffect(() => {
    if (isHovered && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 1200);
    } else {
      clearInterval(intervalRef.current);
      setCurrentImageIndex(0);
    }

    return () => clearInterval(intervalRef.current);
  }, [isHovered, images.length]);

  return (
    <div
      style={{
        ...styles.card,
        transform: isHovered ? 'translateY(-4px)' : 'none',
        boxShadow: isHovered ? '0 12px 20px rgba(0,0,0,0.12)' : styles.card.boxShadow,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`} style={styles.cardLink}>
        {/* Image Container */}
        <div style={styles.imageWrapper}>
          <span
            style={{
              ...styles.badge,
              ...(product.available_quantity > 0
                ? styles.inStockBadge
                : styles.outOfStockBadge),
            }}
          >
            {product.available_quantity > 0 ? 'In Stock' : 'Sold Out'}
          </span>

          <img
            src={images[currentImageIndex]}
            alt={product.name}
            style={{
              ...styles.image,
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
            loading="lazy"
          />

          {/* Dots Indicator */}
          {images.length > 1 && (
            <div
              style={{
                ...styles.dotsContainer,
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              {images.map((_, idx) => (
                <span
                  key={idx}
                  style={{
                    ...styles.dot,
                    ...(idx === currentImageIndex ? styles.dotActive : {}),
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={styles.content}>
          <div>
            <span style={styles.categoryLabel}>{product.category}</span>
            <h3 style={styles.productName}>{product.name}</h3>
          </div>
          <p style={styles.price}>${product.price}</p>
        </div>
      </Link>
    </div>
  );
}