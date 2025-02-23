import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform,
  Modal,
  SafeAreaView
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useCreateTaskMutation } from '../api/tasksApi';

const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];
const CATEGORY_OPTIONS = [
  'Work',
  'Personal',
  'Health & Fitness',
  'Finance',
  'Education',
  'Home & Family',
  'Shopping',
  'Social & Entertainment',
  'Urgent',
  'Miscellaneous'
];

const CustomPicker = ({ selectedValue, onValueChange, options, placeholder, error }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <View style={styles.pickerWrapper}>
      <TouchableOpacity
        style={[
          styles.pickerButton,
          error && styles.pickerError,
          !selectedValue && styles.placeholderContainer
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[
          styles.pickerButtonText,
          !selectedValue && styles.placeholderText
        ]}>
          {selectedValue || `${placeholder} *`}
        </Text>
        <View style={styles.pickerArrow} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{placeholder}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsList}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionItem,
                    selectedValue === option && styles.selectedOption
                  ]}
                  onPress={() => handleSelect(option)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedValue === option && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                  {selectedValue === option && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const CreateTaskScreen = ({ navigation }) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  
  const taskSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    due_date: Yup.string().required('Due Date is required'),
    priority: Yup.string().oneOf(PRIORITY_OPTIONS, 'Invalid priority').required('Priority is required'),
    category: Yup.string().oneOf(CATEGORY_OPTIONS, 'Invalid category').required('Category is required'),
  });

  const handleSubmitTask = async (values) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        due_date: values.due_date,
        priority: values.priority,
        category: values.category,
      };

      console.log("Submitting Task:", payload);

      await createTask(payload).unwrap();
      Alert.alert('Success', 'Task created successfully!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to create task');
      console.error('Create Task Error:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Task</Text>

        <Formik
          initialValues={{
            title: '',
            description: '',
            due_date: '',
            priority: '',
            category: ''
          }}
          validationSchema={taskSchema}
          onSubmit={handleSubmitTask}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue, touched }) => (
            <>
              <TextInput
                style={[styles.input, errors.title && touched.title && styles.inputError]}
                placeholder="Title *"
                placeholderTextColor="#aaa"
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
              />
              {errors.title && touched.title && <Text style={styles.errorText}>{errors.title}</Text>}

              <TextInput
                style={[styles.input, errors.description && touched.description && styles.inputError]}
                placeholder="Description *"
                placeholderTextColor="#aaa"
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                multiline
                numberOfLines={3}
              />
              {errors.description && touched.description && <Text style={styles.errorText}>{errors.description}</Text>}

              <TextInput
                style={[styles.input, errors.due_date && touched.due_date && styles.inputError]}
                placeholder="Due Date (YYYY-MM-DD) *"
                placeholderTextColor="#aaa"
                onChangeText={handleChange('due_date')}
                onBlur={handleBlur('due_date')}
                value={values.due_date}
              />
              {errors.due_date && touched.due_date && <Text style={styles.errorText}>{errors.due_date}</Text>}

              <CustomPicker
                selectedValue={values.priority}
                onValueChange={(value) => setFieldValue('priority', value)}
                options={PRIORITY_OPTIONS}
                placeholder="Select Priority"
                error={touched.priority && errors.priority}
              />

              <CustomPicker
                selectedValue={values.category}
                onValueChange={(value) => setFieldValue('category', value)}
                options={CATEGORY_OPTIONS}
                placeholder="Select Category"
                error={touched.category && errors.category}
              />

              <TouchableOpacity 
                style={[styles.button, isLoading && styles.buttonDisabled]} 
                onPress={handleSubmit} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Create Task</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
  },
  inputError: {
    borderColor: 'red',
  },
  pickerWrapper: {
    marginBottom: 10,
  },
  pickerButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  pickerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  optionsList: {
    padding: 10,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  selectedOption: {
    backgroundColor: '#007bff15',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#007bff',
    fontWeight: '600',
  },
  checkmark: {
    color: '#007bff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholderText: {
    color: '#aaa',
  },
  placeholderContainer: {
    borderColor: '#ddd',
  },
  pickerError: {
    borderColor: 'red',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#99c5ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5,
  }
});

export default CreateTaskScreen;