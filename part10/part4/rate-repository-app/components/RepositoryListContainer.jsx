import React from 'react';
import { FlatList, View, StyleSheet, Pressable } from 'react-native';
import RepositoryItem from './RepositoryItem';
import RepositoryListHeader from './RepositoryListHeader';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

// Converted to Class Component to maintain focus in the Header
export class RepositoryListContainer extends React.Component {
  renderHeader = () => {
    // Pass the props down to the header
    const { order, setOrder, searchKeyword, setSearchKeyword } = this.props;

    return (
      <RepositoryListHeader
        order={order}
        setOrder={setOrder}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
      />
    );
  };

  render() {
    const { repositories, onPress } = this.props;
    
    const repositoryNodes = repositories
      ? repositories.edges.map((edge) => edge.node)
      : [];

    return (
      <FlatList
        data={repositoryNodes}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({ item }) => (
          <Pressable onPress={() => onPress(item.id)}>
            <RepositoryItem item={item} />
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={this.renderHeader}
      />
    );
  }
}

export default RepositoryListContainer;