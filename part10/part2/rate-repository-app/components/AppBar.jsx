import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigate } from 'react-router-native';
import Constants from 'expo-constants';
import AppBarTab from './AppBarTab';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#1645ab',
    flexDirection: 'row',
  },
});

const AppBar = () => {
  const navigate = useNavigate();

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <AppBarTab onPress={() => navigate('/')}>Sign In</AppBarTab>
        <AppBarTab onPress={() => navigate('/repositories')}>Repositories</AppBarTab>
      </ScrollView>
    </View>
  );
};

export default AppBar; 