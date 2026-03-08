import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { submitJobCardApplication, trackApplication } from '../services/api';

interface RegisterScreenProps {
  navigation: any;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [showTrack, setShowTrack] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmitApplication = async () => {
    if (!name || !phone || !aadharNumber || !address) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Note: For file upload, you'll need to use FormData
      // This is a simplified version - you'll need to implement image picker
      const formData = new FormData();
      formData.append('name' as any, name);
      formData.append('phone' as any, phone);
      formData.append('aadhar_number' as any, aadharNumber);
      formData.append('address' as any, address);

      await submitJobCardApplication(formData);
      Alert.alert(
        'Success',
        'Job card application submitted successfully! Your tracking ID will be sent to your phone.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackApplication = async () => {
    if (!trackingId) {
      Alert.alert('Error', 'Please enter tracking ID');
      return;
    }

    setLoading(true);
    try {
      const response = await trackApplication(trackingId);
      setApplicationData(response.data || response);
      setShowTrack(true);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Application not found');
      setShowTrack(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Job Card Registration</Text>

      <View style={styles.section}>
        <Button
          title={showTrack ? 'New Application' : 'Track Application'}
          onPress={() => {
            setShowTrack(!showTrack);
            setTrackingId('');
            setApplicationData(null);
          }}
        />
      </View>

      {!showTrack ? (
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Submit New Application</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <TextInput
            style={styles.input}
            placeholder="Aadhar Number"
            keyboardType="number-pad"
            value={aadharNumber}
            onChangeText={setAadharNumber}
            maxLength={12}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.infoText}>
            Note: You will need to upload a photo. This feature will be available in the next update.
          </Text>

          <Button
            title="Submit Application"
            onPress={handleSubmitApplication}
            disabled={loading}
          />

          {loading && <ActivityIndicator style={styles.loader} size="large" />}
        </View>
      ) : (
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Track Your Application</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter Tracking ID"
            value={trackingId}
            onChangeText={setTrackingId}
          />

          <Button
            title="Track"
            onPress={handleTrackApplication}
            disabled={loading}
          />

          {loading && <ActivityIndicator style={styles.loader} size="large" />}

          {applicationData && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Application Details</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.label}>Tracking ID:</Text>
                <Text style={styles.value}>{applicationData.tracking_id}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{applicationData.name}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>{applicationData.phone}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Status:</Text>
                <Text style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(applicationData.status) }
                ]}>
                  {applicationData.status.toUpperCase()}
                </Text>
              </View>

              {applicationData.remarks && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Remarks:</Text>
                  <Text style={styles.value}>{applicationData.remarks}</Text>
                </View>
              )}

              <View style={styles.infoRow}>
                <Text style={styles.label}>Submitted:</Text>
                <Text style={styles.value}>
                  {new Date(applicationData.created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return '#FFA500';
    case 'approved':
      return '#4CAF50';
    case 'rejected':
      return '#F44336';
    default:
      return '#666';
  }
};

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
  formSection: {
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  infoText: {
    fontSize: 14,
    color: '#FF9800',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  loader: {
    marginTop: 15,
  },
  resultCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 2,
  },
  statusBadge: {
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    overflow: 'hidden',
  },
});
