export const categoryStyles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '40px 16px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  headerSection: {
    marginBottom: '40px',
    borderBottom: '1px solid #f3f4f6',
    paddingBottom: '24px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#111827',
    textTransform: 'capitalize',
    letterSpacing: '-0.025em',
    margin: 0,
  },
  subText: {
    marginTop: '8px',
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '500',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 16px',
    backgroundColor: '#f9fafb',
    borderRadius: '16px',
    border: '2px dashed #e5e7eb',
    color: '#6b7280',
  },

  // Product Card
  card: {
    position: 'relative',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #f3f4f6',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  cardLink: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    textDecoration: 'none',
    color: 'inherit',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: '1 / 1',
    backgroundColor: '#f9fafb',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    transition: 'transform 0.5s ease',
  },
  badge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    zIndex: 10,
   padding: '3px 8px', // Slightly smaller badge
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    borderRadius: '9999px',
    color: '#ffffff',
  },
  inStockBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
  },
  outOfStockBadge: {
    backgroundColor: 'rgba(244, 63, 94, 0.9)',
  },

  // Content
  content: {
    padding: '12px 14px', // 20px
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  categoryLabel: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.1em',
    color: '#059669',
    textTransform: 'uppercase',
    marginBottom: '4px',
    display: 'block',
  },
  productName: {
    fontSize: '0.875rem', // Reduced from 1rem (14px)
    fontWeight: '700',
    color: '#111827',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  price: {
   fontSize: '1rem', // Reduced from 1.125rem (16px)
    fontWeight: '900',
    color: '#111827',
    marginTop: '4px', // Reduced spacing from 8px
    marginBottom: 0,
  },

  // Carousel Indicators
  dotsContainer: {
    position: 'absolute',
    bottom: '12px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    display: 'flex',
    gap: '6px',
    padding: '4px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: '9999px',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '9999px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transition: 'all 0.3s ease',
  },
  dotActive: {
    backgroundColor: '#ffffff',
    width: '12px',
  },

  // Pagination Button
  loadMoreWrapper: {
    marginTop: '56px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  loadMoreBtn: {
    padding: '14px 32px',
    borderRadius: '9999px',
    fontWeight: '700',
    fontSize: '0.875rem',
    letterSpacing: '0.025em',
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer',
  },
  loadMoreActive: {
    backgroundColor: '#111827',
    color: '#ffffff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  loadMoreDisabled: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
    cursor: 'not-allowed',
    border: '1px solid #e5e7eb',
  },
  countText: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    fontWeight: '500',
  },
};