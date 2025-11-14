import React from 'react';
import './button-styles.css';

interface JobCardButtonProps {
  variant?: 'minimal' | 'gradient' | 'gov';
  type: 'apply' | 'track' | 'download';
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

const JobCardButton: React.FC<JobCardButtonProps> = ({ 
  variant = 'gov', 
  type, 
  children, 
  href, 
  onClick 
}) => {
  const getButtonTypeClass = () => {
    switch (type) {
      case 'apply': return 'apply';
      case 'track': return 'track';
      case 'download': return 'download';
      default: return '';
    }
  };

  const buttonClasses = `btn btn-${variant} ${getButtonTypeClass()}`;

  if (href) {
    return (
      <a href={href} className={buttonClasses}>
        {children}
      </a>
    );
  }

  return (
    <button className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
};

export default JobCardButton;