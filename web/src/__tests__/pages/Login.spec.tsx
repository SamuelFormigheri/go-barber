import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../pages/Login';

const mockedHistoryPush = jest.fn();
jest.mock('react-router-dom', ()=>{
    return{
        useHistory: () => ({
            push: mockedHistoryPush
        }),
        Link: ({ children }: {children: React.ReactNode}) => children
    };
});

const mockedSignIn = jest.fn();
jest.mock('../../hooks/AuthContext', ()=>{
    return {
        useAuth: () => ({
            signIn: mockedSignIn
        })
    }; 
});

const mockedAddToast = jest.fn();
jest.mock('../../hooks/ToastContext', ()=>{
    return {
        useToast: () => ({
            addToast: mockedAddToast
        })
    };  
  });

  
describe('Login Page', ()=>{
    beforeEach(()=>{
        mockedHistoryPush.mockClear();
        mockedAddToast.mockClear();
        mockedSignIn.mockClear();
    });

    it('should be able to sign in', async ()=>{
        const { getByPlaceholderText, getByText } = render(<Login />);

        const emailField = getByPlaceholderText('E-mail');
        const passwordField = getByPlaceholderText('Senha');
        const buttonElement = getByText('Entrar');
        fireEvent.change(emailField, { target: { value: 'johndoe@example.com'} });
        fireEvent.change(passwordField, { target: { value: '123456'} });
        fireEvent.click(buttonElement);

        await waitFor(()=> expect(mockedHistoryPush).toHaveBeenCalledWith('/'));
    });

    it('should not be able to sign in with invalid credentials', async ()=>{
        const { getByPlaceholderText, getByText } = render(<Login />);

        const emailField = getByPlaceholderText('E-mail');
        const passwordField = getByPlaceholderText('Senha');
        const buttonElement = getByText('Entrar');
        fireEvent.change(emailField, { target: { value: 'invalid-mail'} });
        fireEvent.change(passwordField, { target: { value: '123456'} });
        fireEvent.click(buttonElement);

        await waitFor(()=> expect(mockedHistoryPush).not.toHaveBeenCalled());
    });

    it('should display an error if login fail', async ()=>{
        mockedSignIn.mockImplementation(()=>{
            throw new Error();
        });

        const { getByPlaceholderText, getByText } = render(<Login />);

        const emailField = getByPlaceholderText('E-mail');
        const passwordField = getByPlaceholderText('Senha');
        const buttonElement = getByText('Entrar');
        fireEvent.change(emailField, { target: { value: 'johndoe@example.com'} });
        fireEvent.change(passwordField, { target: { value: '123456'} });
        fireEvent.click(buttonElement);

        await waitFor(()=> expect(mockedAddToast).toHaveBeenCalledWith(expect.objectContaining({
            type: 'danger'
        })));
    });
})