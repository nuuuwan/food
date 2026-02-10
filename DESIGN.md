# Food App - Design

This application empowers users by providing deep insights into the food they consume through AI-powered label analysis.

## 🚀 Workflow

1. **Capture:** User takes or uploads photos of food nutrition labels.
2. **Process:** The app displays a loading state while Gemini AI parses the image.
3. **Analyze:** Data is structured and compared against health benchmarks.
4. **Review:** User views a detailed breakdown and saves the item to their history.

---

## 🏗 Component Architecture

### Pages

* **CameraPage:** Interface for capturing or selecting photos. Includes the `ScanOverlay`.
* **ProcessingPage:** A transition state showing analysis progress (crucial for M1/M2).
* **FoodPage:** Displays structured data from `DataContext`.
* **HistoryPage (`/foods`):** A list view of all previously scanned items.

### Molecules (Complex Components)

* **ScanOverlay:** A viewfinder UI with alignment guides for food labels.
* **NutrientSummaryCard:** A visual breakdown of macros (Fats, Carbs, Protein) using charts or bars.
* **InsightList:** A list of "Green Flags" (e.g., High Fiber) and "Red Flags" (e.g., High Sodium).
* **FoodListItem:** A preview row for the history page featuring a thumbnail and date.

### Atoms (UI Elements)

* **ScannerLine:** An animated line across the camera view to indicate active scanning.
* **Badge:** Color-coded tags for dietary labels (Vegan, Gluten-Free, Keto).
* **CircularProgress:** Feedback for AI processing.
* **ActionButton:** Standardized triggers for "Scan," "Retake," or "Save."

---

## 🧠 Data & State Management

### DataContext

The `DataContext` acts as the single source of truth. It manages:

* **CurrentScan:** The base64 or Blob of the current image.
* **AnalysisState:** `idle` | `scanning` | `success` | `error`.
* **FoodHistory:** An array of previously analyzed food objects.

---

## 🛣 Routing

* `/camera` — **CameraPage** (Entry point)
* `/processing` — **ProcessingPage** (AI loading state)
* `/food/:foodId` — **FoodPage** (Results)
* `/foods` — **HistoryPage** (List of user scans)

---

## 🏁 Milestones

### M0: Static Prototype

* [ ] UI Shell with `BrowserRouter`.
* [ ] Dummy data injection in `FoodPage`.
* [ ] Navigation flow from Camera -> Processing -> Food.

### M1: The AI Engine (MVP)

* [ ] Integrate **Gemini 1.5 Flash** for fast OCR and analysis.
* [ ] Vercel Serverless Functions to handle API keys securely.
* [ ] Basic error handling for "No text detected."

### M2: Sophisticated Insights

* [ ] **Persistence:** Save history to local storage or a database (Supabase/Vercel Postgres).
* [ ] **Personalization:** Compare food data against user-defined goals (e.g., "Low Sodium").
* [ ] **Visualizations:** Add macro-nutrient charts.
