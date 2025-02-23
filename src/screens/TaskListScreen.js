import React, { useCallback } from 'react';
import {
  View, Text, ActivityIndicator, StyleSheet, ScrollView
} from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faListCheck } from '@fortawesome/free-solid-svg-icons';
import { useGetAllTasksQuery } from '../api/tasksApi';

const TaskListScreen = () => {
  const route = useRoute();
  const { categoryId, categoryName } = route.params;

 
  const { data: allTasks, isLoading, error, refetch } = useGetAllTasksQuery();

  
  const filteredTasks = allTasks?.filter(task => task.category === categoryId) || [];

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

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
        <Text style={styles.errorText}>Error loading tasks. Please try again later.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <FontAwesomeIcon icon={faListCheck} size={22} color="#fff" />
        <Text style={styles.headerText}>{categoryName} Tasks</Text>
      </View>

      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <View key={task._id} style={styles.taskCard}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskDescription}>{task.description}</Text>
            <Text style={styles.taskMeta}>Priority: {task.priority || "N/A"}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noTasksText}>No tasks found for this category.</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  taskCard: {
    backgroundColor: '#e6f4ea',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  taskMeta: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
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

export default TaskListScreen;
