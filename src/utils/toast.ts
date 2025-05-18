import { toast } from 'react-toastify';
import type { ToastOptions } from 'react-toastify';

interface ToastConfig {
  position?: ToastOptions['position'];
  autoClose?: ToastOptions['autoClose'];
  hideProgressBar?: ToastOptions['hideProgressBar'];
  closeOnClick?: ToastOptions['closeOnClick'];
  pauseOnHover?: ToastOptions['pauseOnHover'];
  draggable?: ToastOptions['draggable'];
}

const defaultConfig: ToastConfig = {
  position: 'bottom-center',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showToast = {
  success: (message: string, config: ToastConfig = {}) => {
    toast.success(message, { ...defaultConfig, ...config });
  },
  error: (message: string, config: ToastConfig = {}) => {
    toast.error(message, { ...defaultConfig, ...config });
  },
  info: (message: string, config: ToastConfig = {}) => {
    toast.info(message, { ...defaultConfig, ...config });
  },
  warning: (message: string, config: ToastConfig = {}) => {
    toast.warning(message, { ...defaultConfig, ...config });
  },
};
