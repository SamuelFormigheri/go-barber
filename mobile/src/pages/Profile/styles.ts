import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    justify-content:center;
    padding: 0 30px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 32px;
`; 

export const LogoutButton = styled.TouchableOpacity`
  position: absolute;
  right: 12px;
  top: 36px;
`; 

export const BackToLoginText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-family: 'RobotoSlab-Regular';
  margin-left: 12px;
`; 


export const UserAvatarButton = styled.TouchableOpacity`

`;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  align-self: center;
  background-color: #3e3b47;
`;