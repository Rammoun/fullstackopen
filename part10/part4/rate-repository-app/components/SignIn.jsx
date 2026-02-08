import useSignIn from '../hooks/useSignIn';
import { useNavigate } from 'react-router-native';
import { SignInContainer } from './SignInContainer';

const initialValues = {
  username: '',
  password: '',
};

const SignIn = () => {  
  const [signIn] = useSignIn();
  const navigate = useNavigate();
  const login = async (values) => {
    console.log(values);
    const { username, password } = values;
    try {
      // const { data } = await signIn({ username, password });
      // console.log('Access Token:', data.authenticate.accessToken);
      await signIn({ username, password });
      navigate("/repositories");
    } catch (e) {
      console.log('Error logging in:', e);
    }
  };
  return <SignInContainer onSubmit={login} />;
}

export default SignIn;