import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

const commonAllergies = [
  { id: 'peanuts', label: 'Peanuts' },
  { id: 'tree-nuts', label: 'Tree Nuts' },
  { id: 'milk', label: 'Milk' },
  { id: 'egg', label: 'Egg' },
  { id: 'soy', label: 'Soy' },
  { id: 'wheat', label: 'Wheat' },
  { id: 'fish', label: 'Fish' },
  { id: 'shellfish', label: 'Shellfish' },
  { id: 'none', label: 'No Allergies' },
];

export default function AllergiesScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const toggleSelection = (id: string) => {
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
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Food Allergies</Text>
        <Text style={styles.subtitle}>
          Let us know about any food allergies you have so we can help you avoid them
        </Text>
        
        <View style={styles.allergiesGrid}>
          {commonAllergies.map(allergy => (
            <TouchableOpacity
              key={allergy.id}
              style={[
                styles.allergyButton,
                selected.includes(allergy.id) && styles.allergyButtonSelected
              ]}
              onPress={() => toggleSelection(allergy.id)}
            >
              <Text style={[
                styles.allergyText,
                selected.includes(allergy.id) && styles.allergyTextSelected
              ]}>
                {allergy.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push('/onboarding/goals')}
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
  allergiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  allergyButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#F5F5F5',
  },
  allergyButtonSelected: {
    backgroundColor: '#FFE5E5',
    borderColor: '#FF6B6B',
  },
  allergyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666666',
  },
  allergyTextSelected: {
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
});