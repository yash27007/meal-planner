import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);

export async function getRecipeDetails(query: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `Generate a detailed recipe for "${query}" in the following JSON format:
    {
      "name": "Recipe Name",
      "description": "Brief description",
      "prepTime": "Preparation time",
      "cookTime": "Cooking time",
      "servings": "Number of servings",
      "ingredients": ["List of ingredients"],
      "instructions": ["Step by step instructions"],
      "nutritionInfo": {
        "calories": "per serving",
        "protein": "in grams",
        "carbs": "in grams",
        "fat": "in grams"
      }
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to get recipe details');
  }
}

export async function analyzeImage(base64Image: string) {
  try {
    // Validate base64 input
    if (!base64Image || typeof base64Image !== 'string') {
      throw new Error('Invalid image data provided');
    }

    // Remove data URL prefix if present
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

    // Validate base64 format
    if (!/^[A-Za-z0-9+/=]+$/.test(cleanBase64)) {
      throw new Error('Invalid base64 format');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `Analyze this image and identify the ingredients or dish shown. 
    If it's ingredients, list them and suggest possible recipes.
    If it's a prepared dish, identify it and suggest similar recipes.
    Format the response as JSON:
    {
      "type": "ingredients|dish",
      "identified": ["list of identified items"],
      "suggestedRecipes": ["list of recipe names"]
    }`;

    // Create parts array for the model
    const parts = [
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64
        }
      }
    ];

    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error: any) {
    console.error('Image Analysis Error:', {
      message: error.message,
      stack: error.stack,
      details: error
    });
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}