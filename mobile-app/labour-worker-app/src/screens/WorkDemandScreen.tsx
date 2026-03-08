import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';
import { getMyRequests, createWorkDemandRequest } from '../services/api';

interface WorkDemandScreenProps {
  navigation: any;
}

interface WorkDemandRequest {
  id: string;
  project_id: string;
  demand_date: string;
  status: string;
  remarks?: string;
  created_at: string;
}

export default function WorkDemandScreen({ navigation }: WorkDemandScreenProps) {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<WorkDemandRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form fields
  const [projectId, setProjectId] = useState('');
  const [demandDate, setDemandDate] = useState('');
  const [workerIds, setWorkerIds] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await getMyRequests(1, 20);
      setRequests(response.data || []);
    } catch (error: any) {
      console.error('Failed to load work requests:', error);
    }
  };

  const handleSubmitRequest = async () => {
    if (!projectId || !demandDate || !workerIds) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const workerIdArray = workerIds.split(',').map(id => id.trim()).filter(id => id);
      
      const requestData = {
        project_id: projectId,
        demand_date: new Date(demandDate).toISOString(),
        worker_ids: workerIdArray,
        remarks: remarks || undefined,
      };

      await createWorkDemandRequest(requestData);
      Alert.alert('Success', 'Work demand request submitted successfully!');
      
      // Reset form
      setProjectId('');
      setDemandDate('');
      setWorkerIds('');
      setRemarks('');
      setShowForm(false);
      loadRequests();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Request Work</Text>

      <View style={styles.section}>
        <Button
          title={showForm ? 'Cancel' : 'New Work Demand Request'}
          onPress={() => setShowForm(!showForm)}
        />
      </View>

      {showForm && (
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Create Work Demand Request</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Project ID"
            value={projectId}
            onChangeText={setProjectId}
          />

          <TextInput
            style={styles.input}
            placeholder="Demand Date (YYYY-MM-DD)"
            value={demandDate}
            onChangeText={setDemandDate}
          />

          <TextInput
            style={styles.input}
            placeholder="Worker IDs (comma-separated)"
            value={workerIds}
            onChangeText={setWorkerIds}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Remarks (optional)"
            value={remarks}
            onChangeText={setRemarks}
            multiline
            numberOfLines={3}
          />

          <Button
            title="Submit Request"
            onPress={handleSubmitRequest}
            disabled={loading}
          />

          {loading && <ActivityIndicator style={styles.loader} size="large" />}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Requests</Text>
        
        {requests.length === 0 ? (
          <Text style={styles.noData}>No work demand requests found</Text>
        ) : (
          requests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <Text style={styles.cardText}>
                <Text style={styles.bold}>Project ID: </Text>
                {request.project_id}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.bold}>Demand Date: </Text>
                {formatDate(request.demand_date)}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.bold}>Status: </Text>
                <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                  {request.status.toUpperCase()}
                </Text>
              </Text>
              {request.remarks && (
                <Text style={styles.cardText}>
                  <Text style={styles.bold}>Remarks: </Text>
                  {request.remarks}
                </Text>
              )}
              <Text style={styles.cardText}>
                <Text style={styles.bold}>Created: </Text>
                {formatDate(request.created_at)}
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
  loader: {
    marginTop: 15,
  },
  noData: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginVertical: 20,
  },
  requestCard: {
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
  statusBadge: {
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    overflow: 'hidden',
  },
});
