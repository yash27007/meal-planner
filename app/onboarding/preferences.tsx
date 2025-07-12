import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

const dietaryPreferences = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'pescatarian', label: 'Pescatarian' },
  { id: 'keto', label: 'Keto' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'gluten-free', label: 'Gluten Free' },
  { id: 'dairy-free', label: 'Dairy Free' },
  { id: 'none', label: 'No Restrictions' },
];

export default function DietaryPreferences() {
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const toggleSelection = (id: string) => {
    try {
      if (id === 'none') {
        setSelected(['none']);
      } else {
        setSelected(prev => {
          const newSelection = prev.includes(id)
            ? prev.filter(item => item !== id)
            : [...prev.filter(item => item !== 'none'), id];
          return newSelection;
        });
      }
      setError(null);
    } catch (error) {
      console.error('Selection error:', error);
      setError('Failed to update selection');
    }
  };

  const handleNavigation = async () => {
    try {
      await router.push('/onboarding/allergies');
      setError(null);
    } catch (error) {
      console.error('Navigation error:', error);
      setError('Failed to navigate to allergies');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Dietary Preferences</Text>
        <Text style={styles.subtitle}>
          Select your dietary preferences to help us personalize your recipe recommendations
        </Text>
        
        <View style={styles.preferencesGrid}>
          {dietaryPreferences.map(preference => (
            <TouchableOpacity
              key={preference.id}
              style={[
                styles.preferenceButton,
                selected.includes(preference.id) && styles.preferenceButtonSelected
              ]}
              onPress={() => toggleSelection(preference.id)}
            >
              <Text style={[
                styles.preferenceText,
                selected.includes(preference.id) && styles.preferenceTextSelected
              ]}>
                {preference.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleNavigation}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#1A1A1A',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
  },
  preferencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  preferenceButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#F5F5F5',
  },
  preferenceButtonSelected: {
    backgroundColor: '#FFE5E5',
    borderColor: '#FF6B6B',
  },
  preferenceText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666666',
  },
  preferenceTextSelected: {
    color: '#FF6B6B',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  continueButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    fontSize: 18,
  },
  error: {
    color: '#FF4444',
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});