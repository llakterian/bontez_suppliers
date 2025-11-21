import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

interface UseContactPickerReturn {
  isSupported: boolean;
  isLoading: boolean;
  pickContact: () => Promise<ContactInfo | null>;
}

/**
 * Hook to access device contacts using the Contact Picker API
 * Supported on mobile Chrome (Android 80+) and Safari (iOS 14.5+)
 */
export function useContactPicker(): UseContactPickerReturn {
  const [isLoading, setIsLoading] = useState(false);

  // Check if Contact Picker API is supported
  const isSupported = 'contacts' in navigator && 'ContactsManager' in window;

  const pickContact = useCallback(async (): Promise<ContactInfo | null> => {
    if (!isSupported) {
      toast.error('Contact picker is not supported on this device/browser');
      return null;
    }

    try {
      setIsLoading(true);

      // Request contact properties
      const props = ['name', 'tel', 'email'];
      
      // Check which properties are supported
      const supportedProps = await (navigator as any).contacts.getProperties();
      const requestProps = props.filter(prop => supportedProps.includes(prop));

      if (requestProps.length === 0) {
        toast.error('No contact properties are supported');
        return null;
      }

      // Select contact (single selection)
      const contacts = await (navigator as any).contacts.select(requestProps, { 
        multiple: false 
      });

      if (!contacts || contacts.length === 0) {
        // User cancelled the picker
        return null;
      }

      const contact = contacts[0];
      
      // Extract contact information
      const name = contact.name?.[0] || '';
      const phone = contact.tel?.[0] || '';
      const email = contact.email?.[0] || '';

      if (!name && !phone) {
        toast.error('Selected contact has no name or phone number');
        return null;
      }

      toast.success('Contact imported successfully!');
      
      return { name, phone, email };
      
    } catch (error: any) {
      console.error('Contact picker error:', error);
      
      // Handle different error types
      if (error.name === 'AbortError' || error.name === 'NotAllowedError') {
        // User cancelled - don't show error
        return null;
      } else {
        toast.error('Failed to access contacts');
        return null;
      }
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  return {
    isSupported,
    isLoading,
    pickContact,
  };
}
