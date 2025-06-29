// Image constants for consistent image management
export const IMAGES = {
  // Food Categories
  JOLLOF_RICE: 'https://images.pexels.com/photos/5695880/pexels-photo-5695880.jpeg',
  GRILLED_CHICKEN: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
  PEPPER_SOUP: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg',
  AMALA_EWEDU: 'https://images.pexels.com/photos/5835353/pexels-photo-5835353.jpeg',
  POUNDED_YAM_EGUSI: 'https://images.pexels.com/photos/5835350/pexels-photo-5835350.jpeg',
  SUYA_PLATTER: 'https://images.pexels.com/photos/1251198/pexels-photo-1251198.jpeg',
  FRIED_RICE: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg',

  // Restaurant Categories
  PROFESSIONAL_CHEF: 'https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg',
  STREET_FOOD_VENDOR: 'https://images.pexels.com/photos/2454533/pexels-photo-2454533.jpeg',
  DESSERT_DISPLAY: 'https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg',
  BAKERY_ITEMS: 'https://images.pexels.com/photos/1070946/pexels-photo-1070946.jpeg',
  HEALTHY_SALAD: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
  BUDGET_MEALS: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',

  // Specific Food Items
  TRUFFLE_RISOTTO: 'https://images.pexels.com/photos/6287525/pexels-photo-6287525.jpeg',
  WAGYU_STEAK: 'https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg',
  LOBSTER_THERMIDOR: 'https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg',
  AKARA_BREAD: 'https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg',
  ARTISAN_SOURDOUGH: 'https://images.pexels.com/photos/1387070/pexels-photo-1387070.jpeg',
  CHIN_CHIN: 'https://images.pexels.com/photos/1546039/pexels-photo-1546039.jpeg',
  PUFF_PUFF: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg',
  COCONUT_CANDY: 'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg',
  FRUIT_SALAD: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg',
  GRILLED_FISH_SALAD: 'https://images.pexels.com/photos/842142/pexels-photo-842142.jpeg',
  EBA_SOUP: 'https://images.pexels.com/photos/5835358/pexels-photo-5835358.jpeg',

  // Chef Images
  AFRICAN_CHEF_WOMAN: 'https://images.pexels.com/photos/3771120/pexels-photo-3771120.jpeg',
  NIGERIAN_CHEF_TRADITIONAL: 'https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg',
  NIGERIAN_MALE_CHEF: 'https://images.pexels.com/photos/3298687/pexels-photo-3298687.jpeg',
  AFRICAN_FEMALE_CHEF_SOUP: 'https://images.pexels.com/photos/3771106/pexels-photo-3771106.jpeg',
  SUYA_CHEF: 'https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg',
  AFRICAN_CHEF_FRIED_RICE: 'https://images.pexels.com/photos/3771120/pexels-photo-3771120.jpeg',
  DEFAULT_CHEF: 'https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg',

  // Supermarket Items
  RICE_BAG: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg',
  FRESH_BREAD: 'https://images.pexels.com/photos/1387070/pexels-photo-1387070.jpeg',
  MILK_BOTTLE: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg',
  EGGS_CARTON: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg',
  COOKING_OIL: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg',
  SOFT_DRINK: 'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg',
  BISCUITS_PACK: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg',
  DETERGENT: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg',
  TOOTHPASTE: 'https://images.pexels.com/photos/3785927/pexels-photo-3785927.jpeg',
  SOAP_BAR: 'https://images.pexels.com/photos/3997309/pexels-photo-3997309.jpeg',
  INSTANT_NOODLES: 'https://images.pexels.com/photos/1907227/pexels-photo-1907227.jpeg',
  TISSUE_PAPER: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg',

  // Onboarding Images
  DELICIOUS_FOOD_TABLE: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
  CHEF_COOKING: 'https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg',
  SHOPPING_BASKET: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg',
  INTERNATIONAL_CUISINE: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',

  // Default/Fallback Images
  DEFAULT_FOOD: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
  DEFAULT_RESTAURANT: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg',
};

// Image utility functions
export const getImageWithFallback = (imageUrl: string | null | undefined, fallback: string = IMAGES.DEFAULT_FOOD): string => {
  return imageUrl && imageUrl.trim() !== '' ? imageUrl : fallback;
};

export const validateImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};