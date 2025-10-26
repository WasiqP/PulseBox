import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App.tsx';
import OnboardingCard from './../components/OnboardingCard';
import { Image } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding01'>;

const Onboarding1Illustration = ({ width, height }: { width: number; height: number }) => (
  <Image 
    source={require('../../assets/images/onboarding-01.png')} 
    style={{ width, height }} 
    resizeMode="contain"
  />
);

const Onboarding01: React.FC<Props> = ({ navigation }) => {
  return (
    <OnboardingCard
      Illustration={Onboarding1Illustration}
      title="Welcome to PulseBox!"
      description="Transform your business with powerful feedback collection tools. Create custom forms and gather valuable insights from your clients."
      step={1}
      total={3}
      onNext={() => navigation.navigate('Onboarding02')}
      onSkip={() => navigation.replace('Login')}
    />
  );
};

export default Onboarding01;
