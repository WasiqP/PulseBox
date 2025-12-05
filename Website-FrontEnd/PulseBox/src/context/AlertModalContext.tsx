import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import AlertModal from '../components/ui/AlertModal';

/**
 * Global Alert Modal Context
 * 
 * Usage example:
 * 
 * import { useAlert } from '../context/AlertModalContext';
 * 
 * const MyComponent = () => {
 *   const { showAlert } = useAlert();
 * 
 *   const handleSubmit = () => {
 *     if (!formData.name) {
 *       showAlert({
 *         title: 'Required Field Missing',
 *         message: 'Please fill in the task name before proceeding.',
 *         buttonText: 'OK'
 *       });
 *       return;
 *     }
 *     // Continue with submission
 *   };
 * 
 *   return <button onClick={handleSubmit}>Submit</button>;
 * };
 */

export interface AlertOptions {
  title: string;
  message: string;
  buttonText?: string;
}

interface AlertModalContextType {
  showAlert: (options: AlertOptions) => void;
}

const AlertModalContext = createContext<AlertModalContextType | undefined>(undefined);

interface AlertModalProviderProps {
  children: ReactNode;
}

export const AlertModalProvider: React.FC<AlertModalProviderProps> = ({ children }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    options: AlertOptions | null;
  }>({
    isOpen: false,
    options: null,
  });

  const showAlert = useCallback((options: AlertOptions) => {
    setModalState({
      isOpen: true,
      options,
    });
  }, []);

  const handleClose = useCallback(() => {
    setModalState({
      isOpen: false,
      options: null,
    });
  }, []);

  return (
    <AlertModalContext.Provider value={{ showAlert }}>
      {children}
      {modalState.options && (
        <AlertModal
          isOpen={modalState.isOpen}
          onClose={handleClose}
          title={modalState.options.title}
          message={modalState.options.message}
          buttonText={modalState.options.buttonText}
        />
      )}
    </AlertModalContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertModalContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertModalProvider');
  }
  return context;
};

