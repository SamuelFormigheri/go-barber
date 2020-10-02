import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../../assets/icons/logo.svg';
import { FiArrowLeft } from 'react-icons/fi';
import { Container, ErrorContent } from './styles';

const Page404: React.FC = () => {
  return (
  <Container>
      <ErrorContent>
            <img src={Logo} alt="GoBarber"/>
            <span>
                <h1>Erro 404</h1> 
                A página que você está tentando acessar não existe.
            </span>
            <Link to="/"> <FiArrowLeft /> </Link>
      </ErrorContent>
  </Container>);
}

export default Page404;