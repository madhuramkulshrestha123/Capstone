import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { workerLoginWithJobCard } from '../services/api';

interface LoginScreenProps {
  navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [jobCardNumber, setJobCardNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!jobCardNumber || !aadhaarNumber) {
      Alert.alert('Error', 'Please enter both Job Card Number and Aadhaar Number');
      return;
    }

    // Validate Aadhaar format
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      Alert.alert('Error', 'Aadhaar number must be exactly 12 digits');
      return;
    }

    setLoading(true);
    try {
      await workerLoginWithJobCard(jobCardNumber.toUpperCase(), aadhaarNumber);
      Alert.alert('Success', 'Login successful! Redirecting to dashboard...');
      // Navigation will be handled by AppNavigator automatically
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Smart Rozgar</Text>
        <Text style={styles.subtitle}>Worker Login</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>JOB CARD Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter JOB CARD Number (e.g., UNDX73491080)"
            value={jobCardNumber}
            onChangeText={setJobCardNumber}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Aadhaar Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 12-digit Aadhaar Number"
            value={aadhaarNumber}
            onChangeText={(text) => {
              // Only allow digits
              const cleaned = text.replace(/\D/g, '');
              if (cleaned.length <= 12) {
                setAadhaarNumber(cleaned);
              }
            }}
            keyboardType="number-pad"
            maxLength={12}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have a Job Card? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Register here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  button: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  registerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  registerLink: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },
});
