import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WorkerCardProps {
  name: string;
  phone: string;
  role?: string;
  status?: 'active' | 'inactive' | 'pending';
  onPress?: () => void;
}

export default function WorkerCard({ 
  name, 
  phone, 
  role = 'Worker',
  status = 'active',
  onPress 
}: WorkerCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'inactive':
        return '#999';
      case 'pending':
        return '#FFA500';
      default:
        return '#4CAF50';
    }
  };

  return (
    <View style={styles.card} onTouchEnd={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.phone}>{phone}</Text>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.role}>{role}</Text>
        <View 
          style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor() }
          ]}
        >
          <Text style={styles.statusText}>
            {status.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  role: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
