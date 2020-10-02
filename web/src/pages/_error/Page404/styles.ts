import styled from 'styled-components';
import {shade} from 'polished';

export const Container = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  place-content: center;
  height: 80vh;
`;


export const ErrorContent = styled.div`
  display:flex;
  align-items:center;
  flex-direction:column;

  img{
      margin-bottom: 100px;
  }
  span{
      padding-bottom: 20px;
  }
  a{
      align-self: flex-start;
      text-decoration: none;
      svg{
          width: 40px;
          height: 40px;
          color: var(--color-black-light);
          transition: 200ms;
          &:hover{
            color: ${shade(0.2,"#ddd")};
          }
      }
  }
`;