import { Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Copyright */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>
              &copy; {currentYear} Bontez Suppliers. All rights reserved.
            </p>
          </div>

          {/* Center - Attribution */}
          <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            <p>
              Built by{' '}
              <a
                href="mailto:llakterian@gmail.com?subject=Bontez Suppliers - Inquiry"
                className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
              >
                Llakterian
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>

          {/* Right side - Contact */}
          <div>
            <a
              href="mailto:llakterian@gmail.com?subject=Bontez Suppliers - Support Request"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Mail className="h-4 w-4" />
              Contact Developer
            </a>
          </div>
        </div>

        {/* Additional info - Mobile stacked */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Gas Distribution Management System for Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}
