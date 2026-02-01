import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigate } from 'react-router-native';
import Constants from 'expo-constants';
import { useQuery, useApolloClient } from '@apollo/client/react';

import AppBarTab from './AppBarTab';
import { ME } from '../graphql/queries';
import useAuthStorage from '../hooks/useAuthStorage';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#1645ab',
    flexDirection: 'row',
  },
});

const AppBar = () => {
  const navigate = useNavigate();
  
  const { data } = useQuery(ME);

  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();

  const signOut = async () => {
    await authStorage.removeAccessToken();
    apolloClient.resetStore();
    navigate('/');
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <AppBarTab onPress={() => navigate('/repositories')}>Repositories</AppBarTab>
        {data?.me ? (
          <AppBarTab onPress={signOut}>Sign out</AppBarTab>
        ) : (
          <AppBarTab onPress={() => navigate('/')}>Sign in</AppBarTab>
        )}
      </ScrollView>
    </View>
  );
};

export default AppBar;