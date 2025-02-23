import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRegisterMutation } from '../api/authApi';
import * as ImagePicker from 'react-native-image-picker';

const RegisterScreen = ({ navigation }) => {
  const [registerUser, { isLoading, error }] = useRegisterMutation();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImagePick = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', includeBase64: false },
      (response) => {
        if (!response.didCancel && response.assets && response.assets.length > 0) {
          setSelectedImage(response.assets[0]);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ name: '', username: '', mobile: '', email: '', password: '' }}
        validationSchema={Yup.object({
          name: Yup.string().required('Name is required'),
          username: Yup.string().required('Username is required'),
          mobile: Yup.string().matches(/^\d+$/, 'Must be a valid number').required('Mobile is required'),
          email: Yup.string().email('Invalid email').required('Email is required'),
          password: Yup.string().min(6, 'Too short').required('Password is required'),
        })}
        onSubmit={async (values) => {
          try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('username', values.username);
            formData.append('mobile', values.mobile);
            formData.append('email', values.email);
            formData.append('password', values.password);

            if (selectedImage) {
              formData.append('img', {
                uri: selectedImage.uri,
                type: selectedImage.type,
                name: selectedImage.fileName || 'profile.jpg',
              });
            }

            await registerUser(formData).unwrap();
            navigation.navigate('Login'); // Redirect to login after successful registration
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <>
            {/* Profile Image Picker */}
            <TouchableOpacity onPress={handleImagePick} style={styles.imageContainer}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage.uri }} style={styles.profileImage} />
              ) : (
                <Text style={styles.imagePlaceholder}>Pick Image</Text>
              )}
            </TouchableOpacity>

            {/* Input Fields with Placeholders */}
            <TextInput
              placeholder="Enter your full name"
              placeholderTextColor="#555" 
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              style={styles.input}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <TextInput
              placeholder="Choose a username"
              placeholderTextColor="#555" 
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
              style={styles.input}
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

            <TextInput
              placeholder="Enter your mobile number"
              placeholderTextColor="#555" 
              keyboardType="numeric"
              onChangeText={handleChange('mobile')}
              onBlur={handleBlur('mobile')}
              value={values.mobile}
              style={styles.input}
            />
            {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}

            <TextInput
              placeholder="Enter your email address"
              placeholderTextColor="#555" 
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              style={styles.input}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
              placeholder="Create a strong password"
              secureTextEntry
              placeholderTextColor="#555" 
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              style={styles.input}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            {/* Register Button */}
            <TouchableOpacity onPress={handleSubmit} disabled={isLoading} style={styles.registerButton}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error.message}</Text>}

            {/* Navigate to Login */}
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginButton}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    flex: 1,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ff8c00',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 15,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  imagePlaceholder: {
    color: '#aaa',
    fontSize: 16,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  registerButton: {
    width: '70%',
    padding: 12,
    backgroundColor: '#ff8c00',
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButton: {
    width: '70%',
    padding: 10,
    backgroundColor: '#0080ff',
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeholderText: {
    color: '#555', 
  },
});

export default RegisterScreen;
