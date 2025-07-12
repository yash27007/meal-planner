import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Calendar } from 'lucide-react-native';

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning, Sarah!</Text>
        <Text style={styles.subtitle}>Your meal plan for today is ready</Text>
      </View>

      <View style={styles.mealPlanCard}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?auto=format&fit=crop&w=800' }}
          style={styles.mealImage}
        />
        <View style={styles.mealInfo}>
          <Text style={styles.mealTitle}>Breakfast</Text>
          <Text style={styles.mealName}>Banana Pancakes</Text>
          <Text style={styles.mealTime}>Ready in 20min</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Start cooking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.outlineButton]}>
              <Text style={[styles.buttonText, styles.outlineButtonText]}>See recipe</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weekly Plan</Text>
          <TouchableOpacity>
            <Calendar color="#FF6B6B" size={24} />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weeklyPlan}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <TouchableOpacity
              key={day}
              style={[styles.dayCard, index === 0 && styles.activeDayCard]}
            >
              <Text style={[styles.dayText, index === 0 && styles.activeDayText]}>{day}</Text>
              <Text style={[styles.dateText, index === 0 && styles.activeDateText]}>
                {(index + 1).toString()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Meals</Text>
        {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
          <TouchableOpacity key={meal} style={styles.mealItem}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?auto=format&fit=crop&w=800' }}
              style={styles.mealItemImage}
            />
            <View style={styles.mealItemInfo}>
              <Text style={styles.mealItemTitle}>{meal}</Text>
              <Text style={styles.mealItemName}>Banana Pancake</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 24,
    paddingTop: 48,
  },
  greeting: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#1A1A1A',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  mealPlanCard: {
    margin: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  mealImage: {
    width: '100%',
    height: 200,
  },
  mealInfo: {
    padding: 16,
  },
  mealTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
  },
  mealName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1A1A1A',
    marginTop: 4,
  },
  mealTime: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    fontSize: 14,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  outlineButtonText: {
    color: '#FF6B6B',
  },
  section: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1A1A1A',
  },
  weeklyPlan: {
    flexDirection: 'row',
  },
  dayCard: {
    width: 64,
    height: 80,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDayCard: {
    backgroundColor: '#FF6B6B',
  },
  dayText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
  },
  activeDayText: {
    color: '#FFFFFF',
  },
  dateText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1A1A1A',
    marginTop: 4,
  },
  activeDateText: {
    color: '#FFFFFF',
  },
  mealItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  mealItemImage: {
    width: 80,
    height: 80,
  },
  mealItemInfo: {
    flex: 1,
    padding: 12,
  },
  mealItemTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
  },
  mealItemName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1A1A1A',
    marginTop: 4,
  },
});