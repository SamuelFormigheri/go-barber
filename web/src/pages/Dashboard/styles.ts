import styled from 'styled-components';
import {shade} from 'polished';

export const Container = styled.div`
  
`;

export const Header = styled.header`
    padding: 32px 0 32px 0;
    background: var(--color-main-grey-dark);
`;

export const  HeaderContent = styled.div`
    max-width: 1120px;
    margin: 0 auto;
    display: flex;
    align-items: center;

    > img{
        height: 80px;
    }

    button {
        margin-left: auto;
        background: transparent;
        border: 0;

        svg{
            color: var(--color-black-light);
            width: 20px;
            height: 20px;
        }
    }
`;

export const  Profile = styled.div`
    display: flex;
    align-items: center;
    margin-left: 80px;

    img{
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color:  var(--color-gray-light);
    }

    div{
        display:flex;
        flex-direction: column;
        margin-left: 16px;
        line-height: 24px;
    }
    span{
        color: var(--color-white-light);
    }

    strong{
        color: var(--color-primary);
        transition: 200ms;
        &:hover{
            color: ${shade(0.2, '#FF9000')}
        }
    }
    a{
        text-decoration:none;
    }
`;

export const  Content = styled.main`
    max-width: 1120px;
    margin: 64px auto;
    display: flex;
`;

export const  Schedule = styled.div`
    flex: 1;
    margin-right: 120px;

    h1 {
        font-size: 36px;
    }
    p{
        margin-top: 8px;
        color: var(--color-primary);
        display:flex;
        align-items:center;

        span{
            display:flex;
            align-items:center;
        }

        span + span::before{
            content: '';
            width: 1px;
            height: 12px;
            background: var(--color-primary);
            margin: 0 8px;
            font-weight: 500;
        }
    }
`;

export const  Calendar = styled.aside`
    width: 380px;

    .DayPicker {
    border-radius: 10px;
  }

  .DayPicker-wrapper {
    padding-bottom: 0;
    background: #3e3b47;
    border-radius: 10px;
  }

  .DayPicker,
  .DayPicker-Month {
    width: 100%;
  }

  .DayPicker-NavButton {
    color: #999591 !important;
  }

  .DayPicker-NavButton--prev {
    right: auto;
    left: 1.5em;
    margin-right: 0;
  }

  .DayPicker-Month {
    border-collapse: separate;
    border-spacing: 8px;
    margin: 16px 0 0 0;
    padding: 16px;
    background-color: #28262e;
    border-radius: 0 0 10px 10px;
  }

  .DayPicker-Caption {
    margin-bottom: 1em;
    padding: 0 1em;
    color: #f4ede8;

    > div {
      text-align: center;
    }
  }

  .DayPicker-Day {
    width: 40px;
    height: 40px;
  }

  .DayPicker-Day--available:not(.DayPicker-Day--outside) {
    background: #3e3b47;
    border-radius: 10px;
    color: #fff;
  }

  .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    background: ${shade(0.2, '#3e3b47')};
  }

  .DayPicker-Day--today {
    font-weight: normal;
  }

  .DayPicker-Day--disabled {
    color: #666360 !important;
    background: transparent !important;
  }

  .DayPicker-Day--selected {
    background: #ff9000 !important;
    border-radius: 10px;
    color: #232129 !important;
  }
`;

export const NextAppointment = styled.div`
    margin-top: 64px;

    > strong{
        color: var(--color-black-light);
        font-size: 20px;
        font-weight: 400;
    }

    div{
        background: var(--color-gray-light);
        display:flex;
        align-items:center;
        padding: 16px 24px;
        border-radius: 10px;
        margin-top: 24px;
        position: relative;

        &::before{
            position: absolute;
            height: 80%;
            width: 2px;
            left: 0;
            top: 10%;
            content: '';
            background: var(--color-primary);
        }

        img{
            width: 80px;
            height: 80px;
            border-radius: 50%;
        }
        > svg{
            width: 80px;
            height: 80px;
            border-radius: 50%;
            color: var(--color-black-light);
        }
        strong{
            margin-left: 24px;
            color: var(--color-white);
        }
        span{
            margin-left: auto;
            display: flex;
            align-items:center;
            color: var(--color-black-light);
            svg{
                color: var(--color-primary);
                margin-right: 8px;
            }
        }
    }
`;

export const Section = styled.section`
    margin-top: 48px;

    > strong{
        color: var(--color-black-light);
        font-size: 20px;
        line-height: 26px;
        border-bottom: 1px solid var(--color-gray-light);
        display: block;
        padding-bottom: 16px;
        margin-bottom: 16px;
    }
    > p{
        color: var(--color-black-light);
    }
`;

export const Appointment = styled.div`
    display:flex;
    align-items:center;
    & + div {
        margin-top: 16px;
    }
    span{
        margin-left: auto;
        display: flex;
        align-items:center;
        color: var(--color-white-light);
        svg{
            color: var(--color-primary);
            margin-right: 8px;
        }
    }
    div{
        flex: 1;
        background: var(--color-gray-light);
        display:flex;
        align-items:center;
        padding: 16px 24px;
        border-radius: 10px;
        margin-left: 24px;
        img{
            width: 56px;
            height: 56px;
            border-radius: 50%;
        }
        > svg{
            width: 56px;
            height: 56px;
            border-radius: 50%;
            color: var(--color-black-light);
        }
        strong{
            margin-left: 24px;
            color: var(--color-white);
            font-weight: 400;
        }
    }
`;