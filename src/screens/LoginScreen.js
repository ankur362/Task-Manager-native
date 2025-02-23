import React from 'react';
import { 
  View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator 
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { useLoginMutation } from '../api/authApi';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loginUser, { isLoading, error }] = useLoginMutation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Formik
        initialValues={{ emailOrusername: '', password: '' }}
        validationSchema={Yup.object({
          emailOrusername: Yup.string().required('Email or Username is required'),
          password: Yup.string().required('Password is required'),
        })}
        onSubmit={async (values) => {
          try {
            const payload = { emailOrusername: values.emailOrusername, password: values.password };
            const user = await loginUser(payload).unwrap();
            console.log('Login action:', login);
            dispatch(login(user));
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <>
            {/* Email / Username Input */}
            <TextInput
              style={styles.input}
              placeholder="Email or Username"
              placeholderTextColor="#aaa"
              onChangeText={handleChange('emailOrusername')}
              onBlur={handleBlur('emailOrusername')}
              value={values.emailOrusername}
            />
            {errors.emailOrusername && <Text style={styles.errorText}>{errors.emailOrusername}</Text>}

            {/* Password Input (Showing Dots) */}
            <TextInput
              style={[styles.input, { color: '#ff0000' }]} 
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry={true}  // 👈 Shows dots (••••) instead of text
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            {/* Login Button */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error?.data?.message || 'An error occurred'}</Text>}

            {/* Register Navigation */}
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>Don't have an account? Register</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 8,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#007bff',
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  },
});

export default LoginScreen;
