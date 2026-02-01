import Constants from 'expo-constants';
import { Platform, StyleSheet, View } from 'react-native';
import RepositoryList from './RepositoryList';
import RepositoryItem from './RepositoryItem';
import { Route, Routes, Navigate } from 'react-router-native';
import SignIn from './SignIn';
import AppBar from './AppBar';

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor:'#e1e4e8',
    width:'100%',
  },
});

const Main = () => {
  return (
    <View style={styles.container}>
      <AppBar />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/repositories" element={<RepositoryList ItemComponent={RepositoryItem} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </View>
  );
};

export default Main;