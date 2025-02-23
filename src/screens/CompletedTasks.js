import React, { useCallback } from 'react';
import { 
  View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView 
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSync, faTrash, faExclamationCircle, faFolder } from '@fortawesome/free-solid-svg-icons';
import { useGetCompletedTasksQuery, useDeleteTaskMutation } from '../api/tasksApi';
import { useFocusEffect } from '@react-navigation/native';

const CompletedTasksScreen = () => {
  const { data: completedTasks, isLoading, error, refetch } = useGetCompletedTasksQuery();
  const [deleteTask] = useDeleteTaskMutation();

  // ✅ Fetch updated data when screen is focused
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  // ✅ Handle Task Deletion
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      refetch();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading completed tasks. Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Completed Tasks</Text>
        <TouchableOpacity onPress={refetch} style={styles.refreshButton}>
          <FontAwesomeIcon icon={faSync} size={20} color="#007bff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.taskList}>
        {completedTasks && completedTasks.length > 0 ? (
          completedTasks.map((task) => (
            <View key={task._id} style={styles.taskCard}>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskDescription}>{task.description}</Text>
                <View style={styles.metaContainer}>
                  <FontAwesomeIcon icon={faExclamationCircle} size={14} color="#FFA500" />
                  <Text style={styles.taskMeta}> Priority: {task.priority || "N/A"}</Text>
                </View>
                <View style={styles.metaContainer}>
                  <FontAwesomeIcon icon={faFolder} size={14} color="#007bff" />
                  <Text style={styles.taskMeta}> Category: {task.category || "N/A"}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTask(task._id)}>
                <FontAwesomeIcon icon={faTrash} size={20} color="#d32f2f" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noTasksText}>No completed tasks found.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 10,
  },
  taskList: {
    paddingBottom: 20,
  },
  taskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e6f4ea',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  taskMeta: {
    fontSize: 14,
    color: '#777',
    marginLeft: 5,
  },
  deleteButton: {
    padding: 10,
  },
  noTasksText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CompletedTasksScreen;
