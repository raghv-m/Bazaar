import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-secondary-400" />
          </div>
        )}
        
        <input
          ref={ref}
          className={cn(
            'input-field w-full',
            Icon && 'pl-10',
            error && 'border-error-500 focus:ring-error-500/50 focus:border-error-500',
            className
          )}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-error-600 dark:text-error-400">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 