import React from 'react';
import {render} from 'react-native-testing-library';

import Login from '../../pages/Login';

jest.mock('@react-navigation/native', () => {
    return {
        useNavigation: jest.fn()
    }
})

describe('Login Page', () => {
    it('should contains email/password inputs', () => {
        const { getByPlaceholder } = render(<Login />);

        expect(getByPlaceholder('E-mail')).toBeTruthy();
        expect(getByPlaceholder('Senha')).toBeTruthy();
    });
});