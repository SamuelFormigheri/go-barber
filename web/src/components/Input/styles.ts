import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface IContainerProps{
    isFocused: boolean;
    isFilled: boolean;
    isErrored: boolean;
}

export const Container = styled.div<IContainerProps>`
    background: var(--color-main-grey-darker);
    border-radius: 10px;
    border: 2px solid var(--color-main-grey-darker);
    padding: 16px;
    width: 100%;
    color: var(--color-grey-darker);
    display:flex;
    align-items:center;

    ${props => props.isErrored && css`
        color: var(--color-red);
        border-color: var(--color-red);
    `}

    ${props => props.isFocused && css`
        color: var(--color-primary);
        border-color: var(--color-primary);
    `}

    ${props => props.isFilled && css`
        color: var(--color-primary);
        border-color: var(--color-primary);
    `}


    input{
        background: transparent;
        flex: 1;
        border: 0;
        color: var(--color-grey-light);

        &::placeholder{
            color: var(--color-grey-darker);
        }
    }

    & + div{
            margin-top: 8px;
    }
    
    svg{
        margin-right: 16px;
    }
`;

export const Error = styled(Tooltip)`
    height: 20px;
    margin-left: 16px;
    svg{
        margin: 0;
    }
    span{
        background: var(--color-red);

        &::before{
            border-color: var(--color-red) transparent;   
        }
    }
`;