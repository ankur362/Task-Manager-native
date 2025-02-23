import React, { useState, useCallback } from 'react';
import { 
  View, Text, FlatList, ActivityIndicator, StyleSheet, 
  TouchableOpacity, Alert, TextInput 
} from 'react-native';
import { 
  useGetAllTasksQuery, 
  useUpdateTaskMutation, 
  useDeleteTaskMutation 
} from '../api/tasksApi';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = () => {
  const { data: tasks, error, isLoading, refetch } = useGetAllTasksQuery();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const navigation = useNavigation();

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  // 🔄 Refetch data when screen is focused
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  // ✅ Handle Task Completion
  const handleCompleteTask = async (task) => {
    try {
      await updateTask({ id: task._id, Completed_task: !task.Completed_task }).unwrap();
      refetch();
    } catch (error) {
      Alert.alert("Error", "Failed to update task.");
    }
  };

  // ✅ Handle Task Deletion
  const handleDeleteTask = async (taskId) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteTask(taskId);
              refetch();
            } catch (error) {
              Alert.alert("Error", "Failed to delete task.");
            }
          },
        },
      ]
    );
  };

  // ✅ Enable Editing Mode
  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
  };

  // ✅ Update Task & Refresh UI
  const handleUpdateTask = async () => {
    try {
      await updateTask({ id: editingTaskId, title: editedTitle, description: editedDescription }).unwrap();
      refetch();
      setEditingTaskId(null);
    } catch (error) {
      Alert.alert("Error", "Failed to update task.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📌 Task Manager</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateTask')}
        >
          <Text style={styles.createButtonText}>+ Add Task</Text>
        </TouchableOpacity>
      </View>

      {isLoading && <ActivityIndicator size="large" color="#ff8c00" />}
      {error && <Text style={styles.errorText}>Failed to load tasks!</Text>}

      <FlatList
        data={tasks || []}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
            onEdit={startEditing}
            isEditing={editingTaskId === item._id}
            editedTitle={editedTitle}
            setEditedTitle={setEditedTitle}
            editedDescription={editedDescription}
            setEditedDescription={setEditedDescription}
            onUpdate={handleUpdateTask}
          />
        )}
      />
    </View>
  );
};

// ✅ Task Item Component (Handles Inline Editing)
const TaskItem = ({
  task,
  onComplete,
  onDelete,
  onEdit,
  isEditing,
  editedTitle,
  setEditedTitle,
  editedDescription,
  setEditedDescription,
  onUpdate,
}) => {
  return (
    <View style={styles.taskCard}>
      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={editedTitle}
            onChangeText={setEditedTitle}
            placeholder="Edit Title"
          />
          <TextInput
            style={styles.input}
            value={editedDescription}
            onChangeText={setEditedDescription}
            placeholder="Edit Description"
            multiline
          />
        </>
      ) : (
        <>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskDescription}>{task.description}</Text>
          <Text style={styles.dueDate}>🕒 Due: {task.due_date}</Text>
          <Text style={styles.taskStatus}>
            {task.Completed_task ? '✅ Completed' : '⏳ Pending'}
          </Text>
        </>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.completeButton, task.Completed_task && styles.completed]}
          onPress={() => onComplete(task)}
        >
          <Text style={styles.completeButtonText}>
            {task.Completed_task ? '✔' : '✔ Done'}
          </Text>
        </TouchableOpacity>

        {isEditing ? (
          <TouchableOpacity style={styles.updateButton} onPress={onUpdate}>
            <Text style={styles.buttonText}>🔄 Update</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={() => onEdit(task)}>
            <Text style={styles.buttonText}>✏ Edit</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(task._id)}>
          <Text style={styles.buttonText}>🗑 Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 3,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDescription: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  dueDate: {
    fontSize: 14,
    color: '#ff8c00',
    marginTop: 5,
  },
  taskStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#ff8c00',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 6,
    borderRadius: 8,
  },
  updateButton: {
    backgroundColor: '#28a745',
    padding: 6,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 6,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    marginBottom: 5,
  },
});

export default HomeScreen;
