import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useGetAllTasksQuery } from '../api/tasksApi';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFolder,  faSync } from '@fortawesome/free-solid-svg-icons';

const CategoriesScreen = () => {
  const { data: tasks, error, isLoading, refetch } = useGetAllTasksQuery();
  const navigation = useNavigation();

  
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  
  const categories = tasks
    ? [...new Set(tasks.map((task) => task.category))].map((category) => ({ name: category }))
    : [];

  return (
    <View style={styles.container}>
   
      <View style={styles.header}>
        <Text style={styles.title}>
          <FontAwesomeIcon icon={faFolder} size={22} color="#fff" /> Categories
        </Text>
        <TouchableOpacity style={styles.refreshButton} onPress={refetch}>
          <FontAwesomeIcon icon={faSync} size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      
      {isLoading && <ActivityIndicator size="large" color="#ff8c00" />}
      {error && <Text style={styles.errorText}>Failed to load categories!</Text>}

     
      <FlatList
        data={categories}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => navigation.navigate('TaskList', { categoryId: item.name, categoryName: item.name })}
          >
            <FontAwesomeIcon icon={faFolder} size={18} color="#fff" />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />



    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 6,
  },

  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10
  },

  categoryCard: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },

  addButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6
  },
});

export default CategoriesScreen;
