import { useQuery } from '@apollo/client/react';
import { GET_REPOSITORIES } from '../graphql/queries';

const useRepositories = () => {
  const { data, loading, refetch } = useQuery(GET_REPOSITORIES, {
    fetchPolicy: 'cache-and-network',
  });
  console.log("Loading:", loading);
  console.log("Data:", data);
  return { repositories: data ? data.repositories : undefined, loading, refetch };
};

export default useRepositories;