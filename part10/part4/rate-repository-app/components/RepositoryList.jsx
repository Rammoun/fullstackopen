import { useState } from 'react';
import { useNavigate } from 'react-router-native';
import { useDebounce } from 'use-debounce'; // Import debounce hook

import useRepositories from '../hooks/useRepositories';
import { RepositoryListContainer } from './RepositoryListContainer';

const RepositoryList = () => {
  const [order, setOrder] = useState('latest');
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // Debounce the search keyword by 500ms
  const [debouncedSearchKeyword] = useDebounce(searchKeyword, 500);
  
  const navigate = useNavigate();

  // Helper to get variables based on selected order
  const getOrderVariables = (order) => {
    switch (order) {
      case 'highest':
        return { orderBy: 'RATING_AVERAGE', orderDirection: 'DESC' };
      case 'lowest':
        return { orderBy: 'RATING_AVERAGE', orderDirection: 'ASC' };
      default: // 'latest'
        return { orderBy: 'CREATED_AT', orderDirection: 'DESC' };
    }
  };

  // Combine variables
  const variables = {
    ...getOrderVariables(order),
    searchKeyword: debouncedSearchKeyword,
  };

  const { repositories } = useRepositories(variables);

  return (
    <RepositoryListContainer
      repositories={repositories}
      onPress={(id) => navigate(`/repository/${id}`)}
      // Pass state down
      order={order}
      setOrder={setOrder}
      searchKeyword={searchKeyword}
      setSearchKeyword={setSearchKeyword}
    />
  );
};

export default RepositoryList;