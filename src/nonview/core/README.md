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

## Examples

See [README.examples.md](./README.examples.md) for complete usage examples.

## Backwards Compatibility

The `FoodAnalysis` class maintains backwards compatibility with legacy formats:

- The `imageUri` property returns the primary photo URI
- The `nutrients` getter returns nutritionInfo
- `fromJSON()` handles legacy data format with imageUri at top level
