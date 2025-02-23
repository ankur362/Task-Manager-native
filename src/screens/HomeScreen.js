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
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faEdit, faTrash, faCheck, faClock, faTasks, faUndo } from '@fortawesome/free-solid-svg-icons';

const HomeScreen = () => {
  const { data: tasks, error, isLoading, refetch } = useGetAllTasksQuery();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const navigation = useNavigation();

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const handleCompleteTask = async (task) => {
    try {
      await updateTask({ id: task._id, Completed_task: !task.Completed_task }).unwrap();
      refetch();
    } catch (error) {
      Alert.alert("Error", "Failed to update task.");
    }
  };

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

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
  };

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
        <Text style={styles.title}>
          <FontAwesomeIcon icon={faTasks} size={24} color="#333" /> Task Manager
        </Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateTask')}
        >
          <FontAwesomeIcon icon={faPlus} size={16} color="#fff" />
          <Text style={styles.createButtonText}> Add Task</Text>
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
          <Text style={styles.dueDate}>
            <FontAwesomeIcon icon={faClock} size={14} color="#ff8c00" /> Due: {task.due_date}
          </Text>
          <Text style={styles.taskStatus}>
            {task.Completed_task ? (
              <>
                <FontAwesomeIcon icon={faCheck} size={14} color="green" /> Completed
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faClock} size={14} color="red" /> Pending
              </>
            )}
          </Text>
        </>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, task.Completed_task ? styles.undoButton : styles.doneButton]}
          onPress={() => onComplete(task)}
        >
          <FontAwesomeIcon icon={task.Completed_task ? faUndo : faCheck} size={14} color="#fff" />
          <Text style={styles.buttonText}> {task.Completed_task ? 'Undo' : 'Done'}</Text>
        </TouchableOpacity>

        {isEditing ? (
          <TouchableOpacity style={[styles.button, styles.editButton]} onPress={onUpdate}>
            <FontAwesomeIcon icon={faEdit} size={14} color="#fff" />
            <Text style={styles.buttonText}> Update</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => onEdit(task)}>
            <FontAwesomeIcon icon={faEdit} size={14} color="#fff" />
            <Text style={styles.buttonText}> Edit</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => onDelete(task._id)}>
          <FontAwesomeIcon icon={faTrash} size={14} color="#fff" />
          <Text style={styles.buttonText}> Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  createButton: {
    backgroundColor: '#007bff'
    , flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5
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
    elevation: 3
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8
  },
  doneButton: { backgroundColor: 'green' },
  undoButton: { backgroundColor: 'orange' },
  editButton: { backgroundColor: '#007bff' },
  deleteButton: { backgroundColor: 'red' },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5
  },
});

export default HomeScreen;
