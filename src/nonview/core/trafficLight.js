export const getTrafficLightPanelColor = (key, valuePer100g, theme) => {
  if (valuePer100g === null || valuePer100g === undefined) {
    return theme.palette.grey[500];
  }

  if (key === "sugar") {
    if (valuePer100g > 22) return theme.palette.error.main;
    if (valuePer100g >= 5) return theme.palette.warning.main;
    return theme.palette.success.main;
  }

  if (key === "salt") {
    if (valuePer100g > 1.25) return theme.palette.error.main;
    if (valuePer100g >= 0.25) return theme.palette.warning.main;
    return theme.palette.success.main;
  }

  if (key === "fat") {
    if (valuePer100g > 17.5) return theme.palette.error.main;
    if (valuePer100g >= 3) return theme.palette.warning.main;
    return theme.palette.success.main;
  }

  return theme.palette.grey[500];
};

export const buildWarningBadges = (
  sugarPer100g,
  saltPer100g,
  fatPer100g,
  theme,
) => [
  {
    key: "sugar",
    label: "Sugar",
    sinhalaLabel: "සීනි",
    tamilLabel: "சர்க்கரை",
    value: sugarPer100g,
    unit: "g",
    panelColor: getTrafficLightPanelColor("sugar", sugarPer100g, theme),
  },
  {
    key: "salt",
    label: "Salt",
    sinhalaLabel: "ලුණු",
    tamilLabel: "உப்பு",
    value:
      saltPer100g === null || saltPer100g === undefined
        ? null
        : saltPer100g * 1000,
    unit: "mg",
    panelColor: getTrafficLightPanelColor("salt", saltPer100g, theme),
  },
  {
    key: "fat",
    label: "Fat",
    sinhalaLabel: "මේද",
    tamilLabel: "கொழுப்பு",
    value: fatPer100g,
    unit: "g",
    panelColor: getTrafficLightPanelColor("fat", fatPer100g, theme),
  },
];
