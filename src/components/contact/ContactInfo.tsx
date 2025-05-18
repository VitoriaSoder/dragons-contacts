import React from 'react';

interface ContactInfoProps {
  icon: React.ReactNode;
  text: string;
  className?: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ icon, text, className = '' }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
};

export default ContactInfo;
