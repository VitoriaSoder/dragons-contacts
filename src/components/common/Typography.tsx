import React from 'react';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption';
type TextAlign = 'left' | 'center' | 'right' | 'justify';

interface TypographyProps {
  children: React.ReactNode;
  variant?: TypographyVariant;
  component?: React.ElementType;
  className?: string;
  color?: string;
  align?: TextAlign;
  gutterBottom?: boolean;
  htmlFor?: string;
}

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body1',
  component,
  className = '',
  color,
  align = 'left',
  gutterBottom = false,
  htmlFor,
  ...rest
}) => {
  const variantStyles = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-bold',
    h3: 'text-2xl font-bold',
    h4: 'text-xl font-semibold',
    subtitle1: 'text-lg font-medium',
    subtitle2: 'text-base font-medium',
    body1: 'text-base',
    body2: 'text-sm',
    caption: 'text-xs',
  };

  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  const colorStyle = color ? `text-${color}` : '';
  const marginBottom = gutterBottom ? 'mb-4' : '';

  const Component = component || getDefaultComponent(variant);

  return (
    <Component
      className={`
        ${variantStyles[variant]}
        ${alignStyles[align]}
        ${colorStyle}
        ${marginBottom}
        ${className}
      `}
      htmlFor={htmlFor}
      {...rest}
    >
      {children}
    </Component>
  );
};

const getDefaultComponent = (variant: TypographyVariant): React.ElementType => {
  switch (variant) {
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    case 'h4':
      return 'h4';
    case 'subtitle1':
      return 'h5';
    case 'subtitle2':
      return 'h6';
    case 'body1':
      return 'p';
    case 'body2':
      return 'p';
    case 'caption':
      return 'span';
    default:
      return 'p';
  }
};

export default Typography;
