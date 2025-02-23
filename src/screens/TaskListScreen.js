import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useGetCompletedTasksQuery, useDeleteTaskMutation } from '../api/tasksApi';

const CompletedTasksScreen = () => {
  const { data: completedTasks, isLoading, error } = useGetCompletedTasksQuery();
  const [deleteTask] = useDeleteTaskMutation();

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Completed Tasks</Text>

      {completedTasks?.length === 0 ? (
        <Text style={styles.noTasksText}>No completed tasks found.</Text>
      ) : (
        completedTasks?.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDescription}>{task.description}</Text>
              
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTask(task.id)}>
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  noTasksText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  taskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e6f4ea',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
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
  taskDate: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
  deleteButton: {
    padding: 10,
  },
  deleteText: {
    fontSize: 20,
    color: '#d32f2f',
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
