import React from 'react';

interface AlertBannerProps {
  type: 'alerta' | 'erro' | 'sucesso';
  message: string;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ type, message }) => {
  const alertStyles = {
    alerta: {
      bg: 'bg-blue-500',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    erro: {
      bg: 'bg-gray-700',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    sucesso: {
      bg: 'bg-green-500',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
  };

  const { bg, icon } = alertStyles[type];

  return (
    <div className="w-full max-w-md mx-auto my-2">
      <div className={`${bg} rounded-md px-4 py-3 flex items-center`}>
        <div className="flex-shrink-0 mr-3">{icon}</div>
        <p className="text-white">{message}</p>
      </div>
    </div>
  );
};

const AlertsBanner: React.FC = () => {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center">
        <span className="w-16 mr-4 text-right text-gray-700">alerta</span>
        <AlertBanner type="alerta" message="Mensagem de alerta" />
      </div>

      <div className="flex items-center">
        <span className="w-16 mr-4 text-right text-gray-700">erro</span>
        <AlertBanner type="erro" message="Mensagem de erro" />
      </div>

      <div className="flex items-center">
        <span className="w-16 mr-4 text-right text-gray-700">sucesso</span>
        <AlertBanner type="sucesso" message="Mensagem de sucesso" />
      </div>
    </div>
  );
};

export { AlertBanner, AlertsBanner };
export default AlertsBanner;
