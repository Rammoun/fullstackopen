import { View, Pressable, StyleSheet, TextInput} from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-native';

import Text from './Text';
// import TextInput from './TextInput'; // Ensure you have this reusable component from SignIn exercises
import theme from '../theme';
import useCreateReview from '../hooks/useCreateReview';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  errorInput: {
    borderColor: '#d73a4a',
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  multilineInput: {
    textAlignVertical: 'top', // Fixes text alignment for multiline on Android
  },
});

const validationSchema = yup.object().shape({
  ownerName: yup
    .string()
    .required('Repository owner name is required'),
  repositoryName: yup
    .string()
    .required('Repository name is required'),
  rating: yup
    .number()
    .required('Rating is required')
    .min(0, 'Rating must be between 0 and 100')
    .max(100, 'Rating must be between 0 and 100'),
  text: yup
    .string()
    .optional(),
});

const CreateReview = () => {
  const [createReview] = useCreateReview();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { ownerName, repositoryName, rating, text } = values;

    try {
      const data = await createReview({ ownerName, repositoryName, rating, text });
      // Redirect to the repository view using the returned repositoryId
      if (data?.createReview?.repositoryId) {
        navigate(`/repository/${data.createReview.repositoryId}`);
      }
    } catch (e) {
      console.log('Error creating review', e);
    }
  };

  const formik = useFormik({
    initialValues: {
      ownerName: '',
      repositoryName: '',
      rating: '',
      text: '',
    },
    validationSchema,
    onSubmit,
  });

  // Helper to handle styles for error states
  const getInputStyle = (error) => {
    return error ? [styles.input, styles.errorInput] : styles.input;
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Repository owner name"
        value={formik.values.ownerName}
        onChangeText={formik.handleChange('ownerName')}
        style={getInputStyle(formik.touched.ownerName && formik.errors.ownerName)}
      />
      {formik.touched.ownerName && formik.errors.ownerName && (
        <Text style={{ color: '#d73a4a', marginBottom: 10 }}>{formik.errors.ownerName}</Text>
      )}

      <TextInput
        placeholder="Repository name"
        value={formik.values.repositoryName}
        onChangeText={formik.handleChange('repositoryName')}
        style={getInputStyle(formik.touched.repositoryName && formik.errors.repositoryName)}
      />
      {formik.touched.repositoryName && formik.errors.repositoryName && (
        <Text style={{ color: '#d73a4a', marginBottom: 10 }}>{formik.errors.repositoryName}</Text>
      )}

      <TextInput
        placeholder="Rating between 0 and 100"
        value={formik.values.rating}
        onChangeText={formik.handleChange('rating')}
        keyboardType="numeric"
        style={getInputStyle(formik.touched.rating && formik.errors.rating)}
      />
      {formik.touched.rating && formik.errors.rating && (
        <Text style={{ color: '#d73a4a', marginBottom: 10 }}>{formik.errors.rating}</Text>
      )}

      <TextInput
        placeholder="Review"
        value={formik.values.text}
        onChangeText={formik.handleChange('text')}
        multiline
        style={[styles.input, styles.multilineInput]}
      />

      <Pressable onPress={formik.handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Create a review</Text>
      </Pressable>
    </View>
  );
};

export default CreateReview;