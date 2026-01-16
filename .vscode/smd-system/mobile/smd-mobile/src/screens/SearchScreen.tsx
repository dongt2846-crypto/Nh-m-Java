import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabParamList, RootStackParamList } from '../../App';
import { syllabusAPI } from '../services/api';

interface Syllabus {
  id: number;
  courseCode: string;
  courseName: string;
  department: string;
  credits: number;
  semester: string;
  academicYear: string;
  description: string;
  createdBy: string;
}

export default function SearchScreen() {
  type SearchScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Search'>,
    StackNavigationProp<RootStackParamList>
  >;
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Computer Science',
    'Mathematics',
    'Physics',
    'Programming'
  ]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await syllabusAPI.search(query);
      setSearchResults(response.data);
      
      // Add to recent searches if not already present
      if (!recentSearches.includes(query)) {
        setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Error searching syllabi:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const navigateToDetail = (syllabusId: number) => {
    navigation.navigate('SyllabusDetail', { syllabusId });
  };

  const renderSearchResult = ({ item }: { item: Syllabus }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => navigateToDetail(item.id)}
    >
      <View style={styles.resultHeader}>
        <View style={styles.courseCodeBadge}>
          <Text style={styles.courseCode}>{item.courseCode}</Text>
        </View>
        <Text style={styles.credits}>{item.credits} Credits</Text>
      </View>
      
      <Text style={styles.courseName} numberOfLines={2}>
        {item.courseName}
      </Text>
      
      <Text style={styles.description} numberOfLines={3}>
        {item.description || 'No description available'}
      </Text>
      
      <View style={styles.resultFooter}>
        <Text style={styles.department}>{item.department}</Text>
        <Text style={styles.semester}>
          {item.semester} {item.academicYear}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderRecentSearch = (search: string, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.recentSearchItem}
      onPress={() => {
        setSearchQuery(search);
        handleSearch(search);
      }}
    >
      <Text style={styles.recentSearchIcon}>🔍</Text>
      <Text style={styles.recentSearchText}>{search}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses, departments, or keywords..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
        
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleSearch(searchQuery)}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {!hasSearched ? (
        // Recent Searches
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <View style={styles.recentSearches}>
            {recentSearches.map(renderRecentSearch)}
          </View>
          
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <View style={styles.categoriesGrid}>
            {[
              { name: 'Computer Science', icon: '💻', color: '#3B82F6' },
              { name: 'Mathematics', icon: '📐', color: '#10B981' },
              { name: 'Physics', icon: '⚛️', color: '#8B5CF6' },
              { name: 'Chemistry', icon: '🧪', color: '#F59E0B' },
            ].map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.categoryCard, { borderColor: category.color }]}
                onPress={() => {
                  setSearchQuery(category.name);
                  handleSearch(category.name);
                }}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        // Search Results
        <View style={styles.resultsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : (
            <>
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                </Text>
              </View>
              
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.resultsList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>🔍</Text>
                    <Text style={styles.emptyTitle}>No results found</Text>
                    <Text style={styles.emptySubtitle}>
                      Try different keywords or check your spelling
                    </Text>
                  </View>
                }
              />
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchHeader: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  searchButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  recentContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 15,
    marginTop: 10,
  },
  recentSearches: {
    marginBottom: 30,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recentSearchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  recentSearchText: {
    fontSize: 16,
    color: '#1F2937',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  resultsHeader: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  resultsList: {
    padding: 20,
  },
  resultCard: {
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
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseCodeBadge: {
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
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
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