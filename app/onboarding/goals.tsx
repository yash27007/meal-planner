import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

const nutritionalGoals = [
  {
    id: 'weight-loss',
    label: 'Weight Loss',
    description: 'Healthy recipes to help you achieve your weight loss goals',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800'
  },
  {
    id: 'muscle-gain',
    label: 'Muscle Gain',
    description: 'High-protein meals to support muscle growth',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800'
  },
  {
    id: 'balanced',
    label: 'Balanced Nutrition',
    description: 'Well-rounded meals for overall health',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800'
  },
  {
    id: 'energy',
    label: 'Energy Boost',
    description: 'Nutrient-rich recipes to keep you energized',
    image: 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=800'
  }
];

export default function GoalsScreen() {
  const [selected, setSelected] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleFinish = async () => {
    if (!selected) {
      setError('Please select a nutritional goal');
      return;
    }

    try {
      await router.replace('/(tabs)');
      setError(null);
    } catch (error) {
      console.error('Navigation error:', error);
      setError('Failed to complete setup');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Nutritional Goals</Text>
        <Text style={styles.subtitle}>
          Choose your primary nutritional goal to help us suggest the most relevant recipes
        </Text>
        
        <View style={styles.goalsGrid}>
          {nutritionalGoals.map(goal => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalCard,
                selected === goal.id && styles.goalCardSelected
              ]}
              onPress={() => {
                setSelected(goal.id);
                setError(null);
              }}
            >
              <Image
                source={{ uri: goal.image }}
                style={styles.goalImage}
              />
              <View style={styles.goalContent}>
                <Text style={styles.goalTitle}>{goal.label}</Text>
                <Text style={styles.goalDescription}>{goal.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.finishButton, !selected && styles.finishButtonDisabled]}
          disabled={!selected}
          onPress={handleFinish}
        >
          <Text style={styles.finishButtonText}>Finish Setup</Text>
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
  goalsGrid: {
    gap: 16,
  },
  goalCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F5F5F5',
    overflow: 'hidden',
  },
  goalCardSelected: {
    borderColor: '#FF6B6B',
  },
  goalImage: {
    width: '100%',
    height: 160,
  },
  goalContent: {
    padding: 16,
  },
  goalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  goalDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  finishButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  finishButtonDisabled: {
    backgroundColor: '#FFB5B5',
  },
  finishButtonText: {
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