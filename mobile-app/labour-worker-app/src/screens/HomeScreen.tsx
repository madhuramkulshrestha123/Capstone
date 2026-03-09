import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMyAttendances, verifyWorker, demandWork } from '../services/api';

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [workerData, setWorkerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [attendancePercentage, setAttendancePercentage] = useState<number | null>(null);

  useEffect(() => {
    loadWorkerData();
  }, []);

  const loadWorkerData = async () => {
    try {
      const workerDataStr = await AsyncStorage.getItem('workerData');
      if (workerDataStr) {
        const data = JSON.parse(workerDataStr);
        setWorkerData(data);
        fetchAttendanceData(data.id);
      }
    } catch (error) {
      console.error('Error loading worker data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceData = async (workerId: string) => {
    try {
      const response = await getMyAttendances(1, 100, workerId);
      const attendanceRecords = response.data || [];
      
      if (attendanceRecords.length > 0) {
        const totalDays = attendanceRecords.length;
        const presentDays = attendanceRecords.filter(
          (record: any) => record.status?.toUpperCase() === 'PRESENT'
        ).length;
        const percentage = Math.round((presentDays / totalDays) * 100);
        setAttendancePercentage(percentage);
      } else {
        setAttendancePercentage(0);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setAttendancePercentage(0);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWorkerData();
    setRefreshing(false);
  };

  const handleDemandWork = () => {
    // Pre-populate with worker's own data
    navigation.navigate('WorkDemand', {
      jobId: workerData?.job_card_id || workerData?.job_card_number,
      aadhaarNumber: workerData?.aadhaar_number,
    });
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('workerData');
            await AsyncStorage.removeItem('isWorker');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome, {workerData?.name || 'Worker'} 👋</Text>
          <Text style={styles.jobCardText}>
            Job Card: {workerData?.job_card_number || workerData?.job_card_id || 'N/A'}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#DBEAFE' }]}>
            <Text style={styles.statEmoji}>🏗</Text>
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Total Projects</Text>
            <Text style={styles.statValue}>{workerData?.work_history?.length || 0}</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#D1FAE5' }]}>
            <Text style={styles.statEmoji}>🟢</Text>
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Status</Text>
            <Text style={styles.statValue}>
              {workerData?.current_status === 'assigned' ? 'Assigned' : 'Available'}
            </Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.statEmoji}>💰</Text>
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Total Earned</Text>
            <Text style={styles.statValue}>₹{workerData?.total_amount || 0}</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#DDD6FE' }]}>
            <Text style={styles.statEmoji}>📅</Text>
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Attendance</Text>
            <Text style={styles.statValue}>
              {attendancePercentage !== null ? `${attendancePercentage}%` : '—'}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#10B981' }]}
            onPress={() => navigation.navigate('Attendance')}
          >
            <Text style={styles.actionEmoji}>📅</Text>
            <Text style={styles.actionText}>Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#F59E0B' }]}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.actionEmoji}>👤</Text>
            <Text style={styles.actionText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#3B82F6' }]}
            onPress={handleDemandWork}
          >
            <Text style={styles.actionEmoji}>🛠</Text>
            <Text style={styles.actionText}>Demand Work</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#8B5CF6' }]}
            onPress={() => navigation.navigate('WorkDemand')}
          >
            <Text style={styles.actionEmoji}>📂</Text>
            <Text style={styles.actionText}>Work History</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name:</Text>
            <Text style={styles.infoValue}>{workerData?.name || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Aadhaar:</Text>
            <Text style={styles.infoValue}>{workerData?.aadhaar_number || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{workerData?.phone_number || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Village:</Text>
            <Text style={styles.infoValue}>{workerData?.village || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>District:</Text>
            <Text style={styles.infoValue}>{workerData?.district || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Recent Work */}
      {workerData?.work_history && workerData.work_history.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Work</Text>
          <View style={styles.recentWorkCard}>
            <Text style={styles.recentWorkName}>
              {workerData.work_history[0]?.name || workerData.work_history[0]?.project_name || 'Unnamed Project'}
            </Text>
            <Text style={styles.recentWorkWage}>
              Wage Earned: ₹{workerData.work_history[0]?.wage_per_worker || workerData.work_history[0]?.wage || 0}
            </Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: workerData.work_history[0]?.status === 'completed' ? '#D1FAE5' : '#DBEAFE' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: workerData.work_history[0]?.status === 'completed' ? '#065F46' : '#1E40AF' }
              ]}>
                {workerData.work_history[0]?.status === 'completed' ? 'Completed' : 'In Progress'}
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  jobCardText: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutButton: {
    padding: 8,
  },
  logoutButtonText: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statEmoji: {
    fontSize: 20,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  recentWorkCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentWorkName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  recentWorkWage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
