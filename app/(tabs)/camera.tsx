import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera as CameraIcon, Image as ImageIcon } from 'lucide-react-native';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import * as ImagePicker from 'expo-image-picker';
import { Camera, CameraType } from 'expo-camera';
import { analyzeImage, getRecipeDetails } from '../utils/gemini';
import { router } from 'expo-router';
import LoadingAnimation from '../components/LoadingAnimation';
import * as ImageManipulator from 'expo-image-manipulator';

interface AnalysisResult {
  type: 'ingredients' | 'dish';
  identified: string[];
  suggestedRecipes: string[];
}

export default function CameraScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleCameraPress = async () => {
    if (!permission?.granted) {
      const newPermission = await requestPermission();
      if (!newPermission.granted) {
        setError('Camera permission is required');
        return;
      }
    }
    setShowCamera(true);
  };

  const processImage = async (uri: string): Promise<string> => {
    try {
      // Resize and compress the image
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      
      if (!manipResult.base64) {
        throw new Error('Failed to process image');
      }
      
      return manipResult.base64;
    } catch (error) {
      console.error('Image processing error:', error);
      throw new Error('Failed to process image');
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
        });
        setImage(photo.uri);
        setShowCamera(false);
        
        const base64Image = await processImage(photo.uri);
        await analyzePhoto(base64Image);
      } catch (error) {
        console.error('Camera error:', error);
        setError('Failed to take picture');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
        const base64Image = await processImage(result.assets[0].uri);
        await analyzePhoto(base64Image);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      setError('Failed to pick image');
    }
  };

  const analyzePhoto = async (base64Image: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!base64Image) {
        throw new Error('No image data available');
      }
      
      const result = await analyzeImage(base64Image);
      setAnalysisResult(result);
    } catch (error: any) {
      console.error('Analysis error:', error);
      setError(error.message || 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  const getRecipe = async (recipeName: string) => {
    setLoading(true);
    try {
      const recipe = await getRecipeDetails(recipeName);
      router.push({
        pathname: '/(tabs)/search',
        params: { recipe: JSON.stringify(recipe) }
      });
    } catch (error) {
      console.error('Recipe error:', error);
      setError('Failed to get recipe details');
    } finally {
      setLoading(false);
    }
  };

  if (showCamera) {
    return (
      <View style={styles.container}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={CameraType.back}
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!image ? (
        <>
          <View style={styles.content}>
            <Text style={styles.title}>Scan Ingredients</Text>
            <Text style={styles.subtitle}>
              Take a photo of your ingredients or upload from gallery to get recipe suggestions
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCameraPress}>
              <CameraIcon size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={pickImage}>
              <ImageIcon size={24} color="#FF6B6B" />
              <Text style={[styles.buttonText, styles.outlineButtonText]}>Upload Photo</Text>
            </TouchableOpacity>
          </View>
          {error && <Text style={styles.error}>{error}</Text>}
        </>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.preview} />
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <LoadingAnimation text="Analyzing your image..." />
            </View>
          ) : analysisResult ? (
            <View style={styles.analysisContainer}>
              <Text style={styles.analysisTitle}>
                {analysisResult.type === 'ingredients' ? 'Identified Ingredients:' : 'Identified Dish:'}
              </Text>
              {analysisResult.identified.map((item, index) => (
                <Text key={index} style={styles.identifiedItem}>• {item}</Text>
              ))}
              
              <Text style={styles.suggestedTitle}>Suggested Recipes:</Text>
              {analysisResult.suggestedRecipes.map((recipe, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recipeButton}
                  onPress={() => getRecipe(recipe)}
                >
                  <Text style={styles.recipeButtonText}>{recipe}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.button, styles.retakeButton]}
            onPress={() => {
              setImage(null);
              setAnalysisResult(null);
              setError(null);
            }}
          >
            <Text style={[styles.buttonText, styles.retakeButtonText]}>Take Another Photo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  buttonContainer: {
    padding: 24,
    gap: 16,
  },
  button: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  outlineButtonText: {
    color: '#FF6B6B',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 24,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    padding: 12,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  previewContainer: {
    flex: 1,
    padding: 24,
  },
  preview: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 24,
  },
  analysisContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  analysisTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  identifiedItem: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  suggestedTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  recipeButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  recipeButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#FF6B6B',
  },
  retakeButton: {
    backgroundColor: '#F5F5F5',
    marginTop: 'auto',
  },
  retakeButtonText: {
    color: '#666666',
  },
  error: {
    color: '#FF4444',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 24,
  },
});