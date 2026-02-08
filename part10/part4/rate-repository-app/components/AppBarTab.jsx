import { Text, Pressable, StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  tab: {
    color: '#fff',
    padding: 10,  
    fontFamily: Platform.select({
      android: 'Roboto',
      ios: 'Arial',
      default: 'System',
    }),
  },
  
});

const AppBarTab = ({ onPress, children }) => {
  return (
    <Pressable onPress={onPress}>
      <Text style={styles.tab}>{children}</Text>
    </Pressable>
  );
};

export default AppBarTab;