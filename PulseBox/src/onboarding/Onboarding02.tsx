import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App.tsx';
import OnboardingCard from './../components/OnboardingCard';
import { Image } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding02'>;

const Onboarding2Illustration = ({ width, height }: { width: number; height: number }) => (
  <Image 
    source={require('../../assets/images/onboarding-02.png')} 
    style={{ width, height }} 
    resizeMode="contain"
  />
);

const Onboarding02: React.FC<Props> = ({ navigation }) => {
  return (
    <OnboardingCard
      Illustration={Onboarding2Illustration}
      title="Create Custom Forms"
      description="Build beautiful feedback forms tailored to your business needs. Choose from multiple field types and customize everything to match your brand."
      step={2}
      total={3}
      onNext={() => navigation.navigate('Onboarding03')}
      onSkip={() => navigation.replace('Login')}
    />
  );
};

export default Onboarding02;
