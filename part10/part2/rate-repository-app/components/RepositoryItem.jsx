import Constants from 'expo-constants';
import { StyleSheet, View, Image } from 'react-native';
import Text from './Text';
import theme from '../theme';


const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1,
    flexShrink: 1,
    padding:10,
    backgroundColor:'#ffffff',
    // marginBottom:1
  },
  row1:{
    flexDirection: 'row'
  },
  row1Header:{
    marginLeft:10,
    flexShrink:1,
  },
  row1Items:{
    marginLeft:10,
    flexShrink:1,
  },
  languageBadge:{
    backgroundColor: theme.colors.primary,
    color:'#ffffff',
    marginLeft:10,
    borderRadius:5,
    padding:5,
    alignSelf:'flex-start',
    marginTop:5
  },
  row2:{
    flexDirection:'row',
    justifyContent:'space-around',
    marginTop:10
  },
  row2Text:{
    textAlign:'center'
  }
});

const RepositoryItem = ({item}) => {

  return (
    <View style={styles.container}>
      <View style={styles.row1}>
        <Image source={{uri: item.ownerAvatarUrl}} style={{width:50, height:50}} />
        <View>
          <Text fontWeight="bold" fontSize="subheading" color="textPrimary" style={styles.row1Header}>{item.fullName}</Text>
          <Text color="textSecondary" style={styles.row1Items}>{item.description}</Text>
          <Text style={styles.languageBadge}>{item.language}</Text>
        </View>
      </View>
      <View style={styles.row2}>
        <View><Text fontWeight="bold" style={styles.row2Text}> {item.stargazersCount >= 1000 ? (item.stargazersCount / 1000).toFixed(1) + 'k' : item.stargazersCount} </Text><Text fontWeight="normal" fontSize="body" color="textSecondary" style={styles.row2Text}>Stars</Text></View>
        <View><Text fontWeight="bold" style={styles.row2Text}> {item.forksCount >= 1000 ? (item.forksCount / 1000).toFixed(1) + 'k' : item.forksCount} </Text><Text fontWeight="normal" fontSize="body" color="textSecondary" style={styles.row2Text}>Forks</Text></View>
        <View><Text fontWeight="bold" style={styles.row2Text}> {item.reviewCount>=1000?(item.reviewCount/1000).toFixed(1)+'k':item.reviewCount} </Text><Text fontWeight="normal" fontSize="body" color="textSecondary" style={styles.row2Text}>Reviews</Text></View>
        <View><Text fontWeight="bold" style={styles.row2Text}> {item.ratingAverage} </Text><Text fontWeight="normal" fontSize="body" color="textSecondary" style={styles.row2Text}>Rating</Text></View>
      </View>
    </View>
  );
};

export default RepositoryItem;