import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import ConfirmModal from '../components/ui/ConfirmModal';

/**
 * Global Confirm Modal Context
 * 
 * Usage example:
 * 
 * import { useConfirm } from '../context/ConfirmModalContext';
 * 
 * const MyComponent = () => {
 *   const { confirm } = useConfirm();
 * 
 *   const handleDelete = () => {
 *     confirm({
 *       title: 'Delete Item',
 *       message: 'Are you sure you want to delete this item?',
 *       confirmText: 'Delete',
 *       cancelText: 'Cancel',
 *       type: 'danger',
 *       onConfirm: () => {
 *         // Perform delete action
 *         deleteItem();
 *       },
 *     });
 *   };
 * 
 *   return <button onClick={handleDelete}>Delete</button>;
 * };
 */

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmModalContextType {
  confirm: (options: ConfirmOptions) => void;
}

const ConfirmModalContext = createContext<ConfirmModalContextType | undefined>(undefined);

interface ConfirmModalProviderProps {
  children: ReactNode;
}

export const ConfirmModalProvider: React.FC<ConfirmModalProviderProps> = ({ children }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions | null;
  }>({
    isOpen: false,
    options: null,
  });

  const confirm = useCallback((options: ConfirmOptions) => {
    setModalState({
      isOpen: true,
      options,
    });
  }, []);

  const handleClose = useCallback(() => {
    if (modalState.options?.onCancel) {
      modalState.options.onCancel();
    }
    setModalState({
      isOpen: false,
      options: null,
    });
  }, [modalState.options]);

  const handleConfirm = useCallback(async () => {
    if (modalState.options?.onConfirm) {
      await modalState.options.onConfirm();
    }
    setModalState({
      isOpen: false,
      options: null,
    });
  }, [modalState.options]);

  return (
    <ConfirmModalContext.Provider value={{ confirm }}>
      {children}
      {modalState.options && (
        <ConfirmModal
          isOpen={modalState.isOpen}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title={modalState.options.title}
          message={modalState.options.message}
          confirmText={modalState.options.confirmText}
          cancelText={modalState.options.cancelText}
          type={modalState.options.type}
        />
      )}
    </ConfirmModalContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmModalContext);
  if (context === undefined) {
    throw new Error('useConfirm must be used within a ConfirmModalProvider');
  }
  return context;
};

