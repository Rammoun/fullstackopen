import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SignInContainer } from './SignInContainer';

describe('SignIn', () => {
  describe('SignInContainer', () => {
    it('calls onSubmit function with correct arguments when a valid form is submitted', async () => {
      // 1. Create a mock function to spy on the onSubmit call
      const onSubmit = jest.fn();

      // 2. Render the form
      render(<SignInContainer onSubmit={onSubmit} />);

      // 3. Fill the fields
      // NOTE: Ensure your TextInputs have placeholder="Username" and "Password"
      fireEvent.changeText(screen.getByPlaceholderText('Username'), 'kalle');
      fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password');

      // 4. Press the button
      // NOTE: Ensure your button contains the text "Sign In"
      fireEvent.press(screen.getByText('Sign In'));

      // 5. Wait for the Formik async submission
      await waitFor(() => {
        // Expect the mock to have been called once
        expect(onSubmit).toHaveBeenCalledTimes(1);

        // Expect the mock to have been called with the correct object
        expect(onSubmit.mock.calls[0][0]).toEqual({
          username: 'kalle',
          password: 'password',
        });
      });
    });
  });
});