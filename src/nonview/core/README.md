# Food Data Model

## Overview

The food data model consists of two main classes: `FoodAnalysis` and `Photo`. A single food analysis can have multiple photos.

## Class Structure

### `Photo`

Represents a single photo with metadata.

```javascript
{
  id: "photo-001",
  timestamp: 1707523200000,
  imageUri: "/path/to/image.jpg"
}
```

### `Ingredient`

Represents a single ingredient with optional quantity.

```javascript
{
  name: "Organic Peanuts",
  quantity: "30g"
}
```

### `NutritionInfo`

Contains all nutritional data.

```javascript
{
  calories: 190,
  protein: 8,
  carbs: 7,
  fat: 16,
  fiber: 2,
  sodium: 65,
  sugar: 2
}
```

### `FoodAnalysis`

The main class representing a food item with its complete analysis including multiple photos.

```javascript
{
  id: "food-001",
  productName: "Organic Peanut Butter",
  timestamp: 1707523200000,
  nutritionInfo: NutritionInfo,
  ingredients: [Ingredient],
  warnings: ["Contains Peanuts"],
  servingSize: "32g (2 tbsp)",
  photos: [Photo]
}
```

## Usage Examples

### Create a new food analysis with single photo

```javascript
import { FoodAnalysis, Photo } from "./nonview/core";

const food = FoodAnalysis.fromJSON({
  id: "food-001",
  productName: "Organic Peanut Butter",
  timestamp: Date.now(),
  servingSize: "32g (2 tbsp)",
  nutrients: {
    calories: 190,
    protein: 8,
    // ...
  },
  ingredients: [
    { name: "Organic Peanuts", quantity: "30g" },
    { name: "Sea Salt", quantity: "2g" },
  ],
  warnings: ["Contains Peanuts"],
  photos: [
    {
      id: "photo-001",
      timestamp: Date.now(),
      imageUri: "/food/peanut-butter.jpg",
    },
  ],
});
```

### Add additional photos to existing food analysis

```javascript
const newPhoto = new Photo({
  id: "photo-002",
  timestamp: Date.now(),
  imageUri: "/food/peanut-butter-back.jpg",
});

food.addPhoto(newPhoto);
```

### Access photos

```javascript
// Get all photos
const allPhotos = food.photos;

// Get primary (first) photo
const primaryPhoto = food.primaryPhoto;
const primaryImageUri = food.imageUri; // convenience getter
```

### Backwards Compatibility

The `FoodAnalysis` class maintains backwards compatibility with legacy formats:

- The `imageUri` property returns the primary photo URI
- The `nutrients` getter returns nutritionInfo
- `fromJSON()` handles legacy data format with imageUri at top level

```javascript
// Legacy format still works
const food = FoodAnalysis.fromJSON({
  id: "food-001",
  productName: "Peanut Butter",
  imageUri: "/food/pb.jpg",
  nutrients: { calories: 190, ... },
  ingredients: [...]
});

// Automatically creates a photo from the imageUri
console.log(food.photos.length); // 1
```
