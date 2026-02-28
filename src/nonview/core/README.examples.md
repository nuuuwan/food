# Food Data Model Examples

## Create a new food analysis with single photo

```javascript
import { FoodAnalysis, Photo } from "./nonview/core";

const food = FoodAnalysis.fromJSON({
  id: "food-001",
  productName: "Organic Peanut Butter",
  timestamp: Date.now(),
  servingSize: "32g (2 tbsp)",
  nutrients: { calories: 190, protein: 8 },
  ingredients: [
    { name: "Organic Peanuts", quantity: "30g" },
    { name: "Sea Salt", quantity: "2g" },
  ],
  warnings: ["Contains Peanuts"],
  photos: [{ id: "photo-001", timestamp: Date.now(), imageUri: "/food/peanut-butter.jpg" }],
});
```

## Add additional photos

```javascript
const newPhoto = new Photo({
  id: "photo-002",
  timestamp: Date.now(),
  imageUri: "/food/peanut-butter-back.jpg",
});
food.addPhoto(newPhoto);
```

## Backwards Compatibility

```javascript
const food = FoodAnalysis.fromJSON({
  id: "food-001",
  productName: "Peanut Butter",
  imageUri: "/food/pb.jpg",
  nutrients: { calories: 190 },
  ingredients: [],
});
console.log(food.photos.length); // 1
```
