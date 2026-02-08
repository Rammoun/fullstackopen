import { View, StyleSheet, Alert, Pressable } from 'react-native';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-native';
import { useMutation } from '@apollo/client/react';

import Text from './Text';
import theme from '../theme';
import { DELETE_REVIEW } from '../graphql/mutations';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
  },
  topContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  ratingContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
  },
  ratingText: {
    color: theme.colors.primary,
  },
  username: {
    marginBottom: 2,
  },
  date: {
    marginBottom: 5,
  },
  text: {
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    padding: 15,
    borderRadius: 5,
    flex: 1, // Make buttons share width equally
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: theme.colors.primary,
    marginRight: 10, // Spacing between buttons
  },
  deleteButton: {
    backgroundColor: '#d73a4a', // Red color
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

const ReviewItem = ({ review, refetch }) => {
  const navigate = useNavigate();
  const [deleteReviewMutation] = useMutation(DELETE_REVIEW);

  const formattedDate = format(new Date(review.createdAt), 'dd.MM.yyyy');
  
  // Decide what to show in the header (Repo name or Username)
  const header = review.repository 
    ? review.repository.fullName 
    : review.user?.username;

  // Handler for the Delete button
  const handleDelete = () => {
    Alert.alert(
      "Delete review",
      "Are you sure you want to delete this review?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              await deleteReviewMutation({ variables: { id: review.id } });
              refetch(); // Refresh the list after deletion
            } catch (e) {
              console.log(e);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.ratingContainer}>
          <Text fontWeight="bold" fontSize="subheading" style={styles.ratingText}>
            {review.rating}
          </Text>
        </View>
        <View style={styles.contentContainer}>
          <Text fontWeight="bold" fontSize="subheading" style={styles.username}>
            {header}
          </Text>
          <Text color="textSecondary" style={styles.date}>
            {formattedDate}
          </Text>
          <Text style={styles.text}>{review.text}</Text>
        </View>
      </View>

      {refetch && (
        <View style={styles.actionsContainer}>
          <Pressable 
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => navigate(`/repository/${review.repository.id}`)}
          >
            <Text style={styles.buttonText}>View repository</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>Delete review</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default ReviewItem;