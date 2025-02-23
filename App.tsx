import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './src/store/store';
import AuthStack from './src/navigation/AuthStack';
import MainTabs from './src/navigation/MainTabs';

const AppContent = () => {
  const user = useSelector((state: RootState) => state.auth.user); 

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
