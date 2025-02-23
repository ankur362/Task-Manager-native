import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faList, faCheckCircle, faUser } from '@fortawesome/free-solid-svg-icons';

import HomeScreen from '../screens/HomeScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CompletedTasks from '../screens/CompletedTasks';
import ProfileScreen from '../screens/ProfileScreen';
import TaskListScreen from '../screens/TaskListScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ✅ Home Stack Navigator (Hide Headers Inside)
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>  
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
    </Stack.Navigator>
  );
}

// ✅ Categories Stack Navigator (Hide Headers Inside)
function CategoriesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Tasks' }} />
    </Stack.Navigator>
  );
}

// ✅ Main Bottom Tab Navigator (Keep Only Main Tab Headers)
export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          let icon;

          if (route.name === 'Home') {
            icon = faHome;
          } else if (route.name === 'Categories') {
            icon = faList;
          } else if (route.name === 'Completed') {
            icon = faCheckCircle;
          } else if (route.name === 'Profile') {
            icon = faUser;
          }

          return <FontAwesomeIcon icon={icon} size={size} color={color} />;
        },
      })}
    >  
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Categories" component={CategoriesStack} />
      <Tab.Screen name="Completed" component={CompletedTasks} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
