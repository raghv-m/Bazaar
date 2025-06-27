import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../../utils/cn';
import { TOAST_TYPES } from '../../utils/constants';

const Toast = ({ 
  message, 
  type = TOAST_TYPES.INFO, 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    [TOAST_TYPES.SUCCESS]: CheckCircle,
    [TOAST_TYPES.ERROR]: AlertCircle,
    [TOAST_TYPES.WARNING]: AlertTriangle,
    [TOAST_TYPES.INFO]: Info
  };

  const Icon = icons[type];

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'toast',
            `toast-${type}`
          )}
        >
          <div className="flex items-start gap-3">
            <Icon className={cn(
              'h-5 w-5 mt-0.5 flex-shrink-0',
              type === TOAST_TYPES.SUCCESS && 'text-success-500',
              type === TOAST_TYPES.ERROR && 'text-error-500',
              type === TOAST_TYPES.WARNING && 'text-warning-500',
              type === TOAST_TYPES.INFO && 'text-primary-500'
            )} />
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                {message}
              </p>
            </div>
            
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              <X className="h-4 w-4 text-secondary-500" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast; 