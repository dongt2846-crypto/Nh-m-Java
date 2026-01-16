import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { syllabusAPI } from '../services/api';

type RootStackParamList = {
  SyllabusDetail: { syllabusId: number };
};

type SyllabusDetailScreenRouteProp = RouteProp<RootStackParamList, 'SyllabusDetail'>;
type SyllabusDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SyllabusDetail'>;

interface Syllabus {
  id: number;
  courseCode: string;
  courseName: string;
  department: string;
  credits: number;
  semester: string;
  academicYear: string;
  description: string;
  objectives: string;
  prerequisites: string;
  assessmentMethods: string;
  textbooks: string;
  references: string;
  createdBy: string;
}

export default function SyllabusDetailScreen() {
  const route = useRoute<SyllabusDetailScreenRouteProp>();
  const navigation = useNavigation<SyllabusDetailScreenNavigationProp>();
  const { syllabusId } = route.params;
  
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchSyllabus();
  }, [syllabusId]);

  const fetchSyllabus = async () => {
    try {
      const response = await syllabusAPI.getById(syllabusId);
      setSyllabus(response.data);
    } catch (error) {
      console.error('Error fetching syllabus:', error);
      Alert.alert('Error', 'Failed to load syllabus details');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📋' },
    { id: 'objectives', name: 'Objectives', icon: '🎯' },
    { id: 'assessment', name: 'Assessment', icon: '📊' },
    { id: 'resources', name: 'Resources', icon: '📚' },
  ];

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading syllabus...</Text>
      </View>
    );
  }

  if (!syllabus) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Syllabus Not Found</Text>
        <Text style={styles.errorSubtitle}>
          The requested syllabus could not be loaded.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Course Description</Text>
              <Text style={styles.sectionContent}>
                {syllabus.description || 'No description available.'}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Prerequisites</Text>
              <Text style={styles.sectionContent}>
                {syllabus.prerequisites || 'No prerequisites specified.'}
              </Text>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Course Code</Text>
                <Text style={styles.infoValue}>{syllabus.courseCode}</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Credits</Text>
                <Text style={styles.infoValue}>{syllabus.credits}</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>{syllabus.department}</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Semester</Text>
                <Text style={styles.infoValue}>
                  {syllabus.semester} {syllabus.academicYear}
                </Text>
              </View>
            </View>
          </View>
        );

      case 'objectives':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Learning Objectives</Text>
              <Text style={styles.sectionContent}>
                {syllabus.objectives || 'No learning objectives specified.'}
              </Text>
            </View>
          </View>
        );

      case 'assessment':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Assessment Methods</Text>
              <Text style={styles.sectionContent}>
                {syllabus.assessmentMethods || 'No assessment methods specified.'}
              </Text>
            </View>
          </View>
        );

      case 'resources':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Required Textbooks</Text>
              <Text style={styles.sectionContent}>
                {syllabus.textbooks || 'No textbooks specified.'}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional References</Text>
              <Text style={styles.sectionContent}>
                {syllabus.references || 'No additional references specified.'}
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.courseInfo}>
          <View style={styles.courseBadge}>
            <Text style={styles.courseCode}>{syllabus.courseCode}</Text>
          </View>
          <Text style={styles.courseName}>{syllabus.courseName}</Text>
          <Text style={styles.instructor}>👨‍🏫 {syllabus.createdBy}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollView}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>
    </View>
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
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  courseInfo: {
    alignItems: 'center',
  },
  courseBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  courseCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  courseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructor: {
    fontSize: 14,
    color: '#6B7280',
  },
  tabsContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabsScrollView: {
    paddingHorizontal: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeTab: {
    backgroundColor: '#4F46E5',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  infoCard: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
  },
});