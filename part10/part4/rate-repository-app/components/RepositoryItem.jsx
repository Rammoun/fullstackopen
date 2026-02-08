import { View, Image, StyleSheet, Pressable } from 'react-native';
import Text from './Text';
import theme from '../theme';
import * as Linking from 'expo-linking';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
  },
  topContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  contentContainer: {
    flexGrow: 1,
    marginLeft: 15,
  },
  name: {
    marginBottom: 5,
  },
  description: {
    marginBottom: 5,
    flexGrow: 1,
  },
  languageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
  },
  languageText: {
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  // New styles for the GitHub button
  githubButton: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
  },
  githubText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

const StatItem = ({ label, value }) => {
  const formattedValue = value >= 1000 
    ? `${(value / 1000).toFixed(1)}k` 
    : value;

  return (
    <View style={styles.statItem}>
      <Text fontWeight="bold">{formattedValue}</Text>
      <Text color="textSecondary">{label}</Text>
    </View>
  );
};

const RepositoryItem = ({ item, singleView }) => {
  return (
    <View testID="repositoryItem" style={styles.container}>
      <View style={styles.topContainer}>
        <Image style={styles.avatar} source={{ uri: item.ownerAvatarUrl }} />
        <View style={styles.contentContainer}>
          <Text style={styles.name} fontWeight="bold" fontSize="subheading">
            {item.fullName}
          </Text>
          <Text style={styles.description} color="textSecondary">
            {item.description}
          </Text>
          <View style={styles.languageContainer}>
            <Text style={styles.languageText}>{item.language}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <StatItem label="Stars" value={item.stargazersCount} />
        <StatItem label="Forks" value={item.forksCount} />
        <StatItem label="Reviews" value={item.reviewCount} />
        <StatItem label="Rating" value={item.ratingAverage} />
      </View>

      {/* Conditionally render the button only if singleView is true */}
      {singleView && (
        <Pressable 
          style={styles.githubButton} 
          onPress={() => Linking.openURL(item.url)}
        >
          <Text style={styles.githubText}>Open in GitHub</Text>
        </Pressable>
      )}
    </View>
  );
};

export default RepositoryItem;