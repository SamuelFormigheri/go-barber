import styled from 'styled-components';

export const Container = styled.ul`
  padding: 0;
  margin: 0;
  .slick-prev,
  .slick-next {
    z-index: 50;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 50px;
    height: 146px;
    background: var(--color-main-grey-dark);
    transform: initial;
    &:before {
      font-size: 30px;
    }
    opacity:0;
    transition:400ms;
    &:hover{
      opacity:1;
    }
  }
  
  .slick-prev {
    left: 0;
  }
  .slick-next {
    right: 0;
  }
`;