import { useMutation } from '@apollo/client/react';
import { CREATE_REVIEW } from '../graphql/mutations';

const useCreateReview = () => {
  const [mutate, result] = useMutation(CREATE_REVIEW);

  const createReview = async ({ ownerName, repositoryName, rating, text }) => {
    // The server expects 'rating' to be an integer, but forms return strings.
    // We must parse it here.
    const { data } = await mutate({
      variables: {
        review: {
          ownerName,
          repositoryName,
          rating: parseInt(rating),
          text,
        },
      },
    });

    return data;
  };

  return [createReview, result];
};

export default useCreateReview;