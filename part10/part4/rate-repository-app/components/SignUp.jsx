import { View, Pressable, StyleSheet, TextInput} from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-native';

import Text from './Text';
import theme from '../theme';
import useSignUp from '../hooks/useSignUp';
import useSignIn from '../hooks/useSignIn';

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
});

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(5, 'Username must be at least 5 characters')
    .max(30, 'Username must be at most 30 characters')
    .required('Username is required'),
  password: yup
    .string()
    .min(5, 'Password must be at least 5 characters')
    .max(50, 'Password must be at most 50 characters')
    .required('Password is required'),
  passwordConfirmation: yup
    .string()
    // This is the magic line that checks if it matches the 'password' field
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Password confirmation is required'),
});

const SignUp = () => {
  const [signUp] = useSignUp();
  const [signIn] = useSignIn(); // Reuse the sign-in hook
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      // 1. Create the user
      await signUp({ username, password });

      // 2. Automatically sign them in
      await signIn({ username, password });

      // 3. Redirect to home
      navigate('/');
    } catch (e) {
      console.log('Error registering', e);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema,
    onSubmit,
  });

  const getInputStyle = (error) => {
    return error ? [styles.input, styles.errorInput] : styles.input;
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username"
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
        style={getInputStyle(formik.touched.username && formik.errors.username)}
      />
      {formik.touched.username && formik.errors.username && (
        <Text style={{ color: '#d73a4a', marginBottom: 10 }}>{formik.errors.username}</Text>
      )}

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        style={getInputStyle(formik.touched.password && formik.errors.password)}
      />
      {formik.touched.password && formik.errors.password && (
        <Text style={{ color: '#d73a4a', marginBottom: 10 }}>{formik.errors.password}</Text>
      )}

      <TextInput
        placeholder="Password confirmation"
        secureTextEntry
        value={formik.values.passwordConfirmation}
        onChangeText={formik.handleChange('passwordConfirmation')}
        style={getInputStyle(formik.touched.passwordConfirmation && formik.errors.passwordConfirmation)}
      />
      {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && (
        <Text style={{ color: '#d73a4a', marginBottom: 10 }}>{formik.errors.passwordConfirmation}</Text>
      )}

      <Pressable onPress={formik.handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Sign up</Text>
      </Pressable>
    </View>
  );
};

export default SignUp;