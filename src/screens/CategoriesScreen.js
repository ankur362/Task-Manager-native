import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useGetAllTasksQuery } from '../api/tasksApi';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const CategoriesScreen = () => {
  const { data: tasks, error, isLoading, refetch } = useGetAllTasksQuery();
  const navigation = useNavigation();

  // 🔄 Refetch latest tasks when screen is focused
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  // ✅ Extract unique categories dynamically
  const categories = tasks
    ? [...new Set(tasks.map((task) => task.category))].map((category) => ({ name: category }))
    : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📂 Categories</Text>

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
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
  categoryCard: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  categoryText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
});

export default CategoriesScreen;
