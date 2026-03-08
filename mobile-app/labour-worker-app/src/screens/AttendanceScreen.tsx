import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { markAttendance, getMyAttendances } from '../services/api';

interface AttendanceScreenProps {
  navigation: any;
}

interface Attendance {
  id: string;
  project_id: string;
  worker_id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  marked_by: string;
}

export default function AttendanceScreen({ navigation }: AttendanceScreenProps) {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    loadAttendances();
  }, []);

  const loadAttendances = async () => {
    try {
      const response = await getMyAttendances(1, 20);
      setAttendances(response.data || []);
    } catch (error: any) {
      console.error('Failed to load attendances:', error);
    }
  };

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Location permission is required to mark attendance. Please enable it in settings.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation.coords);
      return currentLocation.coords;
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location');
      return null;
    }
  };

  const handleMarkAttendance = async () => {
    // For now, using a default project ID - you can make this dynamic
    const defaultProjectId = projectId || 'default-project-id';
    
    if (!defaultProjectId) {
      Alert.alert('Error', 'Please enter a project ID');
      return;
    }

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const coords = await getCurrentLocation();
      
      if (!coords) {
        setLoading(false);
        return;
      }

      const attendanceData = {
        project_id: defaultProjectId,
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp: new Date().toISOString(),
      };

      await markAttendance(attendanceData);
      Alert.alert('Success', 'Attendance marked successfully!');
      loadAttendances();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Attendance</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mark Attendance</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Project ID"
          value={projectId}
          onChangeText={setProjectId}
        />

        {location && (
          <View style={styles.locationInfo}>
            <Text style={styles.locationText}>
              Latitude: {location.latitude.toFixed(6)}
            </Text>
            <Text style={styles.locationText}>
              Longitude: {location.longitude.toFixed(6)}
            </Text>
          </View>
        )}

        <Button
          title="Mark Attendance"
          onPress={handleMarkAttendance}
          disabled={loading}
        />

        {loading && <ActivityIndicator style={styles.loader} size="large" />}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Attendance History</Text>
        
        {attendances.length === 0 ? (
          <Text style={styles.noData}>No attendance records found</Text>
        ) : (
          attendances.map((attendance) => (
            <View key={attendance.id} style={styles.attendanceCard}>
              <Text style={styles.cardText}>
                <Text style={styles.bold}>Date: </Text>
                {formatDate(attendance.timestamp)}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.bold}>Project ID: </Text>
                {attendance.project_id}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.bold}>Location: </Text>
                {attendance.latitude.toFixed(4)}, {attendance.longitude.toFixed(4)}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.bold}>Marked By: </Text>
                {attendance.marked_by}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  locationInfo: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  loader: {
    marginTop: 15,
  },
  noData: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginVertical: 20,
  },
  attendanceCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardText: {
    fontSize: 14,
    marginVertical: 3,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
});

// Add TextInput import
import { TextInput } from 'react-native';
