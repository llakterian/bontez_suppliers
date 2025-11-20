import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ 
  children, 
  title, 
  subtitle, 
  className = '', 
  hover = false,
  onClick 
}: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-all duration-200 ${
        hover ? 'hover:-translate-y-1 hover:shadow-xl' : ''
      } ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
          {title && (
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
