import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { syllabusAPI } from '../services/api';

type RootStackParamList = {
  SyllabusDetail: { syllabusId: number };
};

type SyllabusListScreenNavigationProp = NavigationProp<RootStackParamList>;

interface Syllabus {
  id: number;
  courseCode: string;
  courseName: string;
  department: string;
  credits: number;
  semester: string;
  academicYear: string;
  createdBy: string;
}

export default function SyllabusListScreen() {
  const navigation = useNavigation<SyllabusListScreenNavigationProp>();
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [filteredSyllabi, setFilteredSyllabi] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSyllabi();
  }, []);

  useEffect(() => {
    filterSyllabi();
  }, [syllabi, searchQuery]);

  const fetchSyllabi = async () => {
    try {
      const response = await syllabusAPI.getAll('PUBLISHED');
      setSyllabi(response.data);
    } catch (error) {
      console.error('Error fetching syllabi:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterSyllabi = () => {
    if (!searchQuery.trim()) {
      setFilteredSyllabi(syllabi);
      return;
    }

    const filtered = syllabi.filter(syllabus =>
      syllabus.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      syllabus.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      syllabus.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSyllabi(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSyllabi();
  };

  const navigateToDetail = (syllabusId: number) => {
    navigation.navigate('SyllabusDetail', { syllabusId });
  };

  const renderSyllabusItem = ({ item }: { item: Syllabus }) => (
    <TouchableOpacity
      style={styles.syllabusCard}
      onPress={() => navigateToDetail(item.id)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.courseCodeContainer}>
          <Text style={styles.courseCode}>{item.courseCode}</Text>
        </View>
        <Text style={styles.credits}>{item.credits} Credits</Text>
      </View>
      
      <Text style={styles.courseName} numberOfLines={2}>
        {item.courseName}
      </Text>
      
      <View style={styles.cardFooter}>
        <Text style={styles.department}>{item.department}</Text>
        <Text style={styles.semester}>
          {item.semester} {item.academicYear}
        </Text>
      </View>
      
      <Text style={styles.instructor}>
        Instructor: {item.createdBy}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading syllabi...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredSyllabi.length} course{filteredSyllabi.length !== 1 ? 's' : ''} available
        </Text>
      </View>

      {/* Syllabi List */}
      <FlatList
        data={filteredSyllabi}
        renderItem={renderSyllabusItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No courses found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'No published syllabi available'}
            </Text>
          </View>
        }
      />
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
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  searchContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  resultsHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  listContainer: {
    padding: 20,
  },
  syllabusCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseCodeContainer: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  courseCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  credits: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  courseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  department: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  semester: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  instructor: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});