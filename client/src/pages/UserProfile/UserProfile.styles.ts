// Styles
export const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '935px',
    margin: '0 auto',
    padding: '30px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  header: {
    display: 'flex',
    marginBottom: '44px',
    gap: '30px',
  },
  avatar: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #00AA6C',
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  usernameRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    gap: '20px',
  },
  username: {
    fontSize: '28px',
    fontWeight: 300,
    margin: 0,
  },
  editButton: {
    padding: '5px 15px',
    backgroundColor: '#ffffff',
    border: '1px solid #dbdbdb',
    borderRadius: '4px',
    fontWeight: 600,
    cursor: 'pointer',
    color: '#000000',
  },
  statsRow: {
    display: 'flex',
    marginBottom: '15px',
    fontSize: '16px',
  },
  stat: {
    display: 'flex',
    gap: '5px',
  },
  bioSection: {
    fontSize: '14px',
    color: '#4A4A4A',
  },
  email: {
    margin: '0 0 5px 0',
    fontWeight: 500,
  },
  joinDate: {
    margin: 0,
    color: '#8e8e8e',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #dbdbdb',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '20px',
    color: '#00AA6C',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(293px, 1fr))',
    gap: '28px',
  },
  gridItem: {
    position: 'relative',
    aspectRatio: '1 / 1',
    backgroundColor: '#efefef',
    cursor: 'pointer',
    overflow: 'hidden',
    borderRadius: '8px',
  },
  reviewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    color: '#8e8e8e',
    fontSize: '14px',
  },
  reviewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '10px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
    color: '#ffffff',
  },
  rating: {
    fontSize: '12px',
    marginBottom: '4px',
    display: 'block',
  },
  restaurantName: {
    margin: 0,
    fontWeight: 600,
    fontSize: '14px',
  },
  restaurantCity: {
    margin: '2px 0 0 0',
    fontSize: '12px',
    color: '#e0e0e0',
  }
};