import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

type IButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<IButtonProps> = ({children, loading, ...rest}) => {
  return (
    <Container {...rest}>{ loading ? 'Carregando...' : children}</Container>
  );
}

export default Button;