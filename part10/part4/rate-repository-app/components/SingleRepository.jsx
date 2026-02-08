import { useParams } from 'react-router-native';
import { useQuery } from '@apollo/client/react';
import { FlatList, View, StyleSheet } from 'react-native';
import RepositoryItem from './RepositoryItem';
import ReviewItem from './ReviewItem';
import Text from './Text';
import { GET_REPOSITORY } from '../graphql/queries';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e4e8',
  },
  separator: {
    height: 10,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryInfo = ({ repository }) => {
  return <RepositoryItem item={repository} singleView={true} />;
};

const SingleRepository = () => {
  const { id } = useParams();
  
  // 1. Fetch with pagination variables
  const { data, loading, error, fetchMore } = useQuery(GET_REPOSITORY, {
    variables: { id, first: 4 }, // Fetch 4 reviews at a time
    fetchPolicy: 'cache-and-network',
  });

  // 2. Define the handler for infinite scrolling
  const onEndReach = () => {
    const canFetchMore = !loading && data?.repository.reviews.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        after: data.repository.reviews.pageInfo.endCursor,
        id, // We must keep the ID variable!
        first: 4,
      },
    });
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const repository = data?.repository;
  
  // 3. Map edges to nodes for the FlatList
  const reviews = repository 
    ? repository.reviews.edges.map(edge => edge.node) 
    : [];

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id }) => id}
      ListHeaderComponent={() => <RepositoryInfo repository={repository} />}
      ItemSeparatorComponent={ItemSeparator}
      style={styles.container}
      
      // 4. Attach the scroll handler
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5} // Trigger when half a screen away from bottom
    />
  );
};

export default SingleRepository;