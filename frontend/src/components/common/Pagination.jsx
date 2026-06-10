import { motion } from 'framer-motion';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn"
        style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
      >
        ← Назад
      </button>
      
      {pages.map((page, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          style={{
            padding: '8px 16px',
            background: currentPage === page ? 'var(--primary-color)' : 'transparent',
            color: currentPage === page ? 'white' : 'var(--text-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            cursor: typeof page === 'number' ? 'pointer' : 'default'
          }}
        >
          {page}
        </motion.button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn"
        style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
      >
        Вперёд →
      </button>
    </div>
  );
}