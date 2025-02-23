import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const user = useSelector((state) => state.auth.user);

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
        <Text style={styles.profileTitle}>PROFILE DETAILS</Text>
        <ProfileDetail label="Name" value={user.name} />
        <ProfileDetail label="Username" value={`@${user.username}`} />
        <ProfileDetail label="Email" value={user.email} />
        <ProfileDetail label="Mobile" value={user.mobile} />
      </View>
    </View>
  );
}

const ProfileDetail = ({ label, value }) => (
  <View style={styles.detailContainer}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9d9d9', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imageWrapper: {
    width: 130,
    height: 130,
    borderWidth: 3,
    borderRadius:70,
    borderColor: '#333',
    backgroundColor: '#ccc',
    marginBottom: 20,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius:70,
  },
  profileCard: {
    width: width * 0.9,
    backgroundColor: '#f0f0f0', 
    padding: 20,
    alignItems: 'flex-start',
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'left',
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    width: 100,
  },
  value: {
    fontSize: 16,
    color: '#444',
    flexShrink: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
