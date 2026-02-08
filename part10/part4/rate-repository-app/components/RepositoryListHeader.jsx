import { View, StyleSheet, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#e1e4e8',
  },
  searchContainer: {
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
  },
  picker: {
    backgroundColor: 'white', // Ensure picker has a background
    borderWidth: 0,
  },
});

const RepositoryListHeader = ({ 
  order, 
  setOrder, 
  searchKeyword, 
  setSearchKeyword 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search repositories..."
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          style={{ padding: 5 }} // Simple inline style for the input
        />
      </View>
      
      <Picker
        selectedValue={order}
        onValueChange={(itemValue) => setOrder(itemValue)}
        style={styles.picker}
        prompt="Select an item..." // Android prompt title
      >
        <Picker.Item label="Latest repositories" value="latest" />
        <Picker.Item label="Highest rated repositories" value="highest" />
        <Picker.Item label="Lowest rated repositories" value="lowest" />
      </Picker>
    </View>
  );
};

export default RepositoryListHeader;