export const modalStyles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#8e8e8e',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  previewContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  imagePreview: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #dbdbdb',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#000000',
  },
  textInput: {
    padding: '10px 12px',
    border: '1px solid #dbdbdb',
    borderRadius: '6px',
    fontSize: '14px',
  },
  fileInput: {
    fontSize: '14px',
  },
  submitButton: {
    padding: '12px',
    backgroundColor: '#00AA6C', 
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '10px',
  }
};