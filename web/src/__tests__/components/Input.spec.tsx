import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Input from '../../components/Input';

jest.mock('@unform/core', ()=>{
    return {
        useField() {
            return {
                fieldName: 'email',
                defaultValue: '',
                error: '',
                registerField: jest.fn()
            }
        }
    }
});

// const mockedSignIn = jest.fn();
// jest.mock('../../hooks/AuthContext', ()=>{

// });


  
describe('Input Component', ()=>{
    beforeEach(()=>{
    });

    it('should be able to render an input', ()=>{
        const { getByPlaceholderText } = render(<Input name="email" placeholder="E-mail" />);

        expect(getByPlaceholderText('E-mail')).toBeTruthy();
    }); 

    it('should be highlight input on focus', async ()=>{
        const { getByPlaceholderText, getByTestId } = render(<Input name="email" placeholder="E-mail" />);

        const inputElement = getByPlaceholderText('E-mail');
        const inputContainer = getByTestId("input-container");

        fireEvent.focus(inputElement);

        await waitFor(()=>expect(inputContainer).toHaveStyle('border-color: var(--color-primary)'));

        // fireEvent.blur(inputElement);

        // await waitFor(()=>expect(inputContainer).not.toHaveStyle('border-color: var(--color-primary)'));
    });  

    it('should be highlighted on blur if input has value', async ()=>{
        const { getByPlaceholderText, getByTestId } = render(<Input name="email" placeholder="E-mail" />);

        const inputElement = getByPlaceholderText('E-mail');
        const inputContainer = getByTestId("input-container");

        fireEvent.change(inputElement,{
            target: { value: 'johndoe@example.com' }
        });

        await waitFor(()=>expect(inputContainer).toHaveStyle('border-color: var(--color-primary)'));

        fireEvent.blur(inputElement);

        await waitFor(()=>expect(inputContainer).toHaveStyle('border-color: var(--color-primary)'));
    });  
});