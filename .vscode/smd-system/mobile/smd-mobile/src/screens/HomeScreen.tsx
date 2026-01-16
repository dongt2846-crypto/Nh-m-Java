import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, TabParamList } from '../../App';
import { syllabusAPI } from '../services/api';

interface Syllabus {
  id: number;
  courseCode: string;
  courseName: string;
  department: string;
  status: string;
  createdAt: string;
}

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [recentSyllabi, setRecentSyllabi] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRecentSyllabi();
  }, []);

  const fetchRecentSyllabi = async () => {
    try {
      const response = await syllabusAPI.getAll();
      // Get the 5 most recent syllabi
      const recent = response.data.slice(0, 5);
      setRecentSyllabi(recent);
    } catch (error) {
      console.error('Error fetching syllabi:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecentSyllabi();
  };

  const navigateToSyllabus = (syllabusId: number) => {
    navigation.navigate('SyllabusDetail', { syllabusId });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
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
      <View style={styles.header}>
        <Text style={styles.title}>SMD Mobile</Text>
        <Text style={styles.subtitle}>Syllabus Management System</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Syllabi')}
          >
            <Text style={styles.actionTitle}>Browse Syllabi</Text>
            <Text style={styles.actionSubtitle}>View all available syllabi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Search')}
          >
            <Text style={styles.actionTitle}>Search</Text>
            <Text style={styles.actionSubtitle}>Find specific courses</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Syllabi</Text>
        {recentSyllabi.map((syllabus) => (
          <TouchableOpacity
            key={syllabus.id}
            style={styles.syllabusCard}
            onPress={() => navigateToSyllabus(syllabus.id)}
          >
            <View style={styles.syllabusHeader}>
              <Text style={styles.courseCode}>{syllabus.courseCode}</Text>
              <Text style={styles.status}>{syllabus.status}</Text>
            </View>
            <Text style={styles.courseName}>{syllabus.courseName}</Text>
            <Text style={styles.department}>{syllabus.department}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#4F46E5',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E7FF',
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1F2937',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    flex: 0.48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  syllabusCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  syllabusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  courseCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  status: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 5,
  },
  department: {
    fontSize: 14,
    color: '#6B7280',
  },
});