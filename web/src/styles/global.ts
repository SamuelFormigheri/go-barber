import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  *{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      outline: 0;
  }

  body{
      background: var(--color-main-grey);
      color: var(--color-white);
      -webkit-font-smoothing: antialiased;
  }

  body, input, button{
      font-family: 'Roboto Slab', serif;
      font-size: 16px;
  }

  h1,h2,h3,h4,h5,h6,strong {
      font-weight: 500;
  }

  button{
      cursor: pointer;
  }

  :root{
    --color-primary: #FF9000;
    --color-white: #FFF;
    --color-white-light: #f4ede8;
    --color-main-grey: #312E38;
    --color-main-grey-dark: #28262e;
    --color-main-grey-darker : #232129;
    --color-gray-light: #3e3b47;
    --color-black-light: #999591;
    --color-grey-darker: #666360;
    --color-grey-light: #F4EDE8;
    --color-red: #C53030;
    --toast-color-background: rgba(0,0,0,0.75);
    --toast-info-color: #3172b7;
    --toast-success-color: #2E656A;
    --toast-danger-color: #C53030;
  }
`;
