import * as yup from 'yup';
import Text from './Text';
import { View, Pressable, TextInput, StyleSheet, Platform } from 'react-native';
import { useFormik } from 'formik';

const initialValues = {
  username: '',
  password: '',
};

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required'),
  password: yup
    .string()
    .required('Password is required'),
});

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 10,
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
    borderRadius: 5,
  },
  inputError: {
    borderColor: '#d73a4a',
  },
  errorText: {
    color: '#d73a4a',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },  
  text: {
    fontFamily: Platform.select({
      android: 'Roboto',
      ios: 'Arial',
      default: 'System',
    }),
  },
});

const SignInForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, formik.touched.username && formik.errors.username && styles.inputError]}
        placeholder="Username" 
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
        onBlur={formik.handleBlur('username')}
      />
      {formik.touched.username && formik.errors.username && (
        <Text style={styles.errorText}>{formik.errors.username}</Text>
      )}
      <TextInput
        style={[styles.input, formik.touched.password && formik.errors.password && styles.inputError]}
        placeholder="Password" secureTextEntry 
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
      />
      {formik.touched.password && formik.errors.password && (
        <Text style={styles.errorText}>{formik.errors.password}</Text>
      )}
      <Pressable style={styles.button} onPress={formik.handleSubmit}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>
    </View>  
  );
};

const SignIn = () => {
  const login = (values) => {
    console.log(values);
  };
  return <SignInForm onSubmit={login} />;
}

export default SignIn;