import styled from 'styled-components/native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { RectButton } from 'react-native-gesture-handler';

interface IProviderContainer{
    userEqualsUser: boolean; 
}

export const Container = styled.View`
  height: 100%;
`;

export const Header = styled.View`
    padding: 24px;
    padding-top: ${getStatusBarHeight() + 24}px;
    background: #28262e;

    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const  BackButton = styled.TouchableOpacity`
`;

export const  HeaderTitle = styled.Text`
    color: #f4ede8;
    font-family: 'RobotoSlab-Medium';
    font-size: 20px;
    margin-left: 16px;
`;

export const  UserAvatar = styled.Image`
    width: 56px;
    height: 56px;
    border-radius: 28px;
    margin-left: auto;
    background-color: #3e3b47;
`;
export const Content = styled.ScrollView`
`;

export const Calendar = styled.View``;

export const  CalendarTitle = styled.Text`
    color: #f4ede8;
    font-family: 'RobotoSlab-Medium';
    font-size: 24px;
    margin: 0 24px 24px;
`;


export const OpenDatePickerButton = styled(RectButton)`
    height: 46px;
    background: #ff9000;
    border-radius: 10px;
    align-items:center;
    justify-content:center;
    margin: 0 24px;
`;

export const  OpenDatePickerButtonText  = styled.Text`
    color: #232129;
    font-family: 'RobotoSlab-Medium';
    font-size: 16px;
`;


export const Schedule = styled.View`
    padding: 24px 0 16px;
`;

export const ScheduleTitle = styled.Text`
    color: #f4ede8;
    font-family: 'RobotoSlab-Medium';
    font-size: 24px;
    margin: 0 24px 24px;
`;

export const  Section = styled.View`
    margin: 0 24px 24px;
`;

export const  SectionTitle = styled.Text`
    color: #999591;
    font-family: 'RobotoSlab-Regular';
    font-size: 18px;
    margin: 0 0 12px;
`;

export const ProviderContainer = styled(RectButton)<IProviderContainer>`
    background: ${props => props.userEqualsUser ? "#28262e" : "#3e3b47" };
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 16px;
    flex-direction: row;
    align-items: center;
`;

export const ProviderAvatar = styled.Image`
    width: 72px;
    height: 72px;
    border-radius: 36px;
`;

export const ProviderInfo = styled.View`
    flex: 1;
    margin-left: 20px;
`;

export const ProviderName = styled.Text`
    font-family: 'RobotoSlab-Medium';
    font-size: 18px;
    color: #f4ede8;
`;

export const ProviderMeta = styled.View`
    flex-direction: row;
    align-items: center;
    margin-top: 8px;
`;

export const ProviderMetaText = styled.Text`
    margin-left: 8px;
    color: #999591;
    font-family: 'RobotoSlab-Regular';
`;
