import React, {useEffect, useRef, useImperativeHandle, forwardRef, useState, useCallback} from 'react';
import { TextInputProps } from 'react-native';
import {useField} from '@unform/core';

import { Container, TextInput, Icon } from './styles';

interface IInputProps extends TextInputProps {
    name: string;
    icon: string;
    containerStyle?: {};
}

interface IInputValueReference {
    value: string;
}

interface IInputRef{
    focus(): void;
}

const Input: React.RefForwardingComponent<IInputRef,IInputProps> = ({name, icon, containerStyle = {}, ...rest}, ref) => {
    const inputElementRef = useRef<any>(null);

    const {registerField, defaultValue = '', fieldName, error} = useField(name);
    const inputValueRef = useRef<IInputValueReference>({value: defaultValue});

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const handleInputFocused = useCallback(()=>{
        setIsFocused(true);
    },[]);
    const handleInputBlur = useCallback(()=>{
        setIsFocused(false);
        setIsFilled(Boolean(inputValueRef.current.value));
    },[]);

    useImperativeHandle(ref,()=>({
        focus() {
            inputElementRef.current.focus();
        }
    }));

  useEffect(()=>{
    registerField({
        name: fieldName,
        ref: inputValueRef.current,
        path: 'value',
        setValue(ref: any, value: string){
            inputValueRef.current.value = value;
            inputElementRef.current.setNativeProps({text: value});
        },
        clearValue(){
            inputValueRef.current.value = '';
            inputElementRef.current.clear();
        }
    })
  },[fieldName, registerField]);

  return (
      <Container style={containerStyle} isFocused={isFocused} isError={Boolean(error)}>
          <Icon name={icon} size={20} color={isFocused || isFilled ? '#ff9000' : '#666360'} />
          <TextInput ref={inputElementRef} placeholderTextColor="#666360"  defaultValue={defaultValue} onChangeText={(value) => {inputValueRef.current.value = value;}} onFocus={handleInputFocused} onBlur={handleInputBlur} {...rest}></TextInput>
      </Container>
  );
}

export default forwardRef(Input);