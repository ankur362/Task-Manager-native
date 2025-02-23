import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window'); // Get device width

export default function ProfileScreen() {
  const user = useSelector((state) => state.auth.user); // Get user data from Redux

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user data found. Please log in.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: user.image }} style={styles.profileImage} />
      </View>

      {/* Profile Details */}
      <View style={styles.profileCard}>
        <ProfileDetail label="Name" value={user.name} />
        <ProfileDetail label="Username" value={`@${user.username}`} />
        <ProfileDetail label="Email" value={user.email} />
        <ProfileDetail label="Mobile" value={user.mobile} />
      </View>
    </View>
  );
}

// Component for profile details
const ProfileDetail = ({ label, value }) => (
  <View style={styles.detailContainer}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // Light gray background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imageWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#ff8c00',
    marginBottom: 20,
    backgroundColor: '#fff', // White background for the image wrapper
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileCard: {
    width: width * 0.9, // 90% of screen width
    backgroundColor: '#ffffff', // White card background
    padding: 20,
    borderRadius: 15,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5, // Shadow for Android
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Darker text for readability
    marginRight: 10,
  },
  value: {
    fontSize: 18,
    color: '#555', // Slightly darker gray for contrast
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
