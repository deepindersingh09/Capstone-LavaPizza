// data/menuData.ts
// Complete Lava Pizza YYC Menu - No Images, Emoji Placeholders Only

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  sizes?: { size: string; price: number }[];
  category: string;
  popular?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  icon: string; // Emoji for category
}

export const menuCategories: MenuCategory[] = [
  { id: 'pasta', name: 'Pasta', icon: '🍝' },
  { id: 'gourmet-pizza', name: 'Gourmet Pizza', icon: '🍕' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'double-pizza-deals', name: 'Double Pizza Deals', icon: '🍕🍕' },
  { id: 'appetizers', name: 'Appetizers', icon: '🥟' },
  { id: 'drinks-dips', name: 'Drinks & Dips', icon: '🥤' },
  { id: 'chicken-wings', name: 'Chicken Wings', icon: '🍗' },
  { id: 'poutines', name: 'Poutines', icon: '🍟' },
  { id: 'pizza-subs', name: 'Pizza Subs', icon: '🥪' },
  { id: 'shawarma-wraps', name: 'Shawarma Wraps', icon: '🌯' },
  { id: 'sides', name: 'Sides', icon: '🍟' },
  { id: 'walk-in-specials', name: 'Walk-In Specials', icon: '⭐' },
  { id: 'meals', name: 'Meals', icon: '🍽️' },
  { id: 'salads', name: 'Salads', icon: '🥗' },
  { id: 'cakes', name: 'Cakes', icon: '🍰' },
];

export const menuItems: MenuItem[] = [
  // PASTA
  {
    id: 'penne-alfredo',
    name: 'Penne Alfredo',
    description: 'Penne in creamy alfredo sauce',
    price: 12.99,
    category: 'pasta',
  },
  {
    id: 'penne-marinara',
    name: 'Penne Marinara',
    description: 'Penne with marinara sauce',
    price: 12.99,
    category: 'pasta',
  },
  {
    id: 'penne-meat-sauce',
    name: 'Penne with Meat Sauce',
    description: 'Penne with savory meat sauce',
    price: 13.99,
    category: 'pasta',
  },
  {
    id: 'baked-lasagna',
    name: 'Baked Lasagna',
    description: 'Layers of pasta with meat sauce and cheese',
    price: 14.99,
    category: 'pasta',
  },

  // GOURMET PIZZA
  {
      id: 'bbq-chicken',
      name: 'BBQ Chicken Pizza',
      description: 'BBQ sauce, chicken, onions, bacon',
      sizes: [
          { size: 'Small 10"', price: 14.99 },
          { size: 'Medium 12"', price: 18.99 },
          { size: 'Large 14"', price: 22.99 },
          { size: 'X-Large 16"', price: 26.99 },
      ],
      category: 'gourmet-pizza',
      popular: true,
      price: 0
  },
  {
      id: 'chicken-ranch',
      name: 'Chicken Ranch Pizza',
      description: 'Ranch sauce, chicken, bacon, tomatoes',
      sizes: [
          { size: 'Small 10"', price: 14.99 },
          { size: 'Medium 12"', price: 18.99 },
          { size: 'Large 14"', price: 22.99 },
          { size: 'X-Large 16"', price: 26.99 },
      ],
      category: 'gourmet-pizza',
      popular: true,
      price: 0
  },
  {
      id: 'butter-chicken',
      name: 'Butter Chicken Pizza',
      description: 'Butter chicken sauce, chicken, onions, peppers',
      sizes: [
          { size: 'Small 10"', price: 14.99 },
          { size: 'Medium 12"', price: 18.99 },
          { size: 'Large 14"', price: 22.99 },
          { size: 'X-Large 16"', price: 26.99 },
      ],
      category: 'gourmet-pizza',
      popular: true,
      price: 0
  },
  {
      id: 'tandoori-chicken',
      name: 'Tandoori Chicken Pizza',
      description: 'Tandoori sauce, chicken, onions, peppers',
      sizes: [
          { size: 'Small 10"', price: 14.99 },
          { size: 'Medium 12"', price: 18.99 },
          { size: 'Large 14"', price: 22.99 },
          { size: 'X-Large 16"', price: 26.99 },
      ],
      category: 'gourmet-pizza',
      price: 0
  },
  {
      id: 'achari-chicken',
      name: 'Achari Chicken Pizza',
      description: 'Achari sauce, chicken, onions, peppers',
      sizes: [
          { size: 'Small 10"', price: 14.99 },
          { size: 'Medium 12"', price: 18.99 },
          { size: 'Large 14"', price: 22.99 },
          { size: 'X-Large 16"', price: 26.99 },
      ],
      category: 'gourmet-pizza',
      price: 0
  },

  // CLASSIC PIZZA
  {
      id: 'pepperoni',
      name: 'Pepperoni Pizza',
      description: 'Classic pepperoni pizza',
      sizes: [
          { size: 'Small 10"', price: 11.99 },
          { size: 'Medium 12"', price: 15.99 },
          { size: 'Large 14"', price: 19.99 },
          { size: 'X-Large 16"', price: 23.99 },
      ],
      category: 'pizza',
      popular: true,
      price: 0
  },
  {
      id: 'cheese',
      name: 'Cheese Pizza',
      description: 'Classic cheese pizza',
      sizes: [
          { size: 'Small 10"', price: 9.99 },
          { size: 'Medium 12"', price: 13.99 },
          { size: 'Large 14"', price: 17.99 },
          { size: 'X-Large 16"', price: 21.99 },
      ],
      category: 'pizza',
      price: 0
  },
  {
      id: 'hawaiian',
      name: 'Hawaiian Pizza',
      description: 'Ham and pineapple',
      sizes: [
          { size: 'Small 10"', price: 12.99 },
          { size: 'Medium 12"', price: 16.99 },
          { size: 'Large 14"', price: 20.99 },
          { size: 'X-Large 16"', price: 24.99 },
      ],
      category: 'pizza',
      popular: true,
      price: 0
  },
  {
      id: 'veggie',
      name: 'Veggie Pizza',
      description: 'Mushrooms, peppers, onions, tomatoes, olives',
      sizes: [
          { size: 'Small 10"', price: 12.99 },
          { size: 'Medium 12"', price: 16.99 },
          { size: 'Large 14"', price: 20.99 },
          { size: 'X-Large 16"', price: 24.99 },
      ],
      category: 'pizza',
      price: 0
  },
  {
      id: 'meat-lovers',
      name: 'Meat Lovers Pizza',
      description: 'Pepperoni, ham, bacon, sausage, ground beef',
      sizes: [
          { size: 'Small 10"', price: 14.99 },
          { size: 'Medium 12"', price: 18.99 },
          { size: 'Large 14"', price: 22.99 },
          { size: 'X-Large 16"', price: 26.99 },
      ],
      category: 'pizza',
      popular: true,
      price: 0
  },
  {
      id: 'canadian',
      name: 'Canadian Pizza',
      description: 'Pepperoni, mushrooms, bacon',
      sizes: [
          { size: 'Small 10"', price: 13.99 },
          { size: 'Medium 12"', price: 17.99 },
          { size: 'Large 14"', price: 21.99 },
          { size: 'X-Large 16"', price: 25.99 },
      ],
      category: 'pizza',
      price: 0
  },

  // DOUBLE PIZZA DEALS
  {
    id: 'double-medium',
    name: '2 Medium Pizzas',
    description: 'Any 2 medium pizzas with 3 toppings each',
    price: 29.99,
    category: 'double-pizza-deals',
    popular: true,
  },
  {
    id: 'double-large',
    name: '2 Large Pizzas',
    description: 'Any 2 large pizzas with 3 toppings each',
    price: 36.99,
    category: 'double-pizza-deals',
    popular: true,
  },
  {
    id: 'double-xlarge',
    name: '2 X-Large Pizzas',
    description: 'Any 2 x-large pizzas with 3 toppings each',
    price: 44.99,
    category: 'double-pizza-deals',
    popular: true,
  },

  // APPETIZERS
  {
    id: 'garlic-bread',
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter',
    price: 5.99,
    category: 'appetizers',
  },
  {
    id: 'garlic-bread-cheese',
    name: 'Garlic Bread with Cheese',
    description: 'Toasted bread with garlic butter and melted cheese',
    price: 7.99,
    category: 'appetizers',
    popular: true,
  },
  {
    id: 'breadsticks',
    name: 'Breadsticks',
    description: 'Served with marinara sauce',
    price: 6.99,
    category: 'appetizers',
  },
  {
    id: 'mozzarella-sticks',
    name: 'Mozzarella Sticks (8 pcs)',
    description: 'Breaded mozzarella sticks',
    price: 8.99,
    category: 'appetizers',
  },
  {
    id: 'jalapeno-poppers',
    name: 'Jalapeño Poppers (8 pcs)',
    description: 'Cream cheese filled jalapeños',
    price: 8.99,
    category: 'appetizers',
  },
  {
    id: 'onion-rings',
    name: 'Onion Rings',
    description: 'Crispy golden onion rings',
    price: 7.99,
    category: 'appetizers',
  },

  // CHICKEN WINGS
  {
    id: 'wings-1lb',
    name: 'Chicken Wings (1 lb)',
    description: 'Choice of sauce: Hot, Honey Garlic, BBQ, Salt & Pepper',
    price: 12.99,
    category: 'chicken-wings',
    popular: true,
  },
  {
    id: 'wings-2lb',
    name: 'Chicken Wings (2 lbs)',
    description: 'Choice of sauce: Hot, Honey Garlic, BBQ, Salt & Pepper',
    price: 22.99,
    category: 'chicken-wings',
    popular: true,
  },
  {
    id: 'wings-3lb',
    name: 'Chicken Wings (3 lbs)',
    description: 'Choice of sauce: Hot, Honey Garlic, BBQ, Salt & Pepper',
    price: 32.99,
    category: 'chicken-wings',
  },

  // POUTINES
  {
    id: 'classic-poutine',
    name: 'Classic Poutine',
    description: 'Fries, gravy, and cheese curds',
    price: 9.99,
    category: 'poutines',
    popular: true,
  },
  {
    id: 'chicken-poutine',
    name: 'Chicken Poutine',
    description: 'Fries, gravy, cheese curds, and chicken',
    price: 12.99,
    category: 'poutines',
  },
  {
    id: 'donair-poutine',
    name: 'Donair Poutine',
    description: 'Fries, gravy, cheese curds, and donair meat',
    price: 13.99,
    category: 'poutines',
  },

  // PIZZA SUBS
  {
    id: 'pizza-sub-meatball',
    name: 'Meatball Pizza Sub',
    description: 'Meatballs, marinara sauce, cheese',
    price: 10.99,
    category: 'pizza-subs',
  },
  {
    id: 'pizza-sub-chicken',
    name: 'Chicken Pizza Sub',
    description: 'Chicken, marinara sauce, cheese',
    price: 11.99,
    category: 'pizza-subs',
  },
  {
    id: 'pizza-sub-veggie',
    name: 'Veggie Pizza Sub',
    description: 'Veggies, marinara sauce, cheese',
    price: 9.99,
    category: 'pizza-subs',
  },

  // SHAWARMA WRAPS
  {
    id: 'chicken-shawarma',
    name: 'Chicken Shawarma',
    description: 'Marinated chicken with garlic sauce, veggies',
    price: 10.99,
    category: 'shawarma-wraps',
    popular: true,
  },
  {
    id: 'beef-shawarma',
    name: 'Beef Shawarma',
    description: 'Marinated beef with tahini sauce, veggies',
    price: 11.99,
    category: 'shawarma-wraps',
  },
  {
    id: 'mixed-shawarma',
    name: 'Mixed Shawarma',
    description: 'Chicken and beef with sauces, veggies',
    price: 12.99,
    category: 'shawarma-wraps',
  },
  {
    id: 'falafel-wrap',
    name: 'Falafel Wrap',
    description: 'Crispy falafel with tahini sauce, veggies',
    price: 9.99,
    category: 'shawarma-wraps',
  },

  // SIDES
  {
    id: 'fries',
    name: 'French Fries',
    description: 'Crispy golden fries',
    price: 5.99,
    category: 'sides',
  },
  {
    id: 'wedges',
    name: 'Potato Wedges',
    description: 'Seasoned potato wedges',
    price: 6.99,
    category: 'sides',
  },
  {
    id: 'caesar-salad',
    name: 'Caesar Salad (Side)',
    description: 'Small caesar salad',
    price: 5.99,
    category: 'sides',
  },
  {
    id: 'garden-salad',
    name: 'Garden Salad (Side)',
    description: 'Small garden salad',
    price: 5.99,
    category: 'sides',
  },

  // SALADS
  {
    id: 'caesar-salad-large',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, parmesan, croutons, caesar dressing',
    price: 9.99,
    category: 'salads',
  },
  {
    id: 'garden-salad-large',
    name: 'Garden Salad',
    description: 'Mixed greens, tomatoes, cucumbers, onions',
    price: 9.99,
    category: 'salads',
  },
  {
    id: 'greek-salad',
    name: 'Greek Salad',
    description: 'Lettuce, tomatoes, cucumbers, olives, feta cheese',
    price: 10.99,
    category: 'salads',
  },
  {
    id: 'chicken-caesar',
    name: 'Chicken Caesar Salad',
    description: 'Caesar salad with grilled chicken',
    price: 12.99,
    category: 'salads',
    popular: true,
  },

  // DRINKS & DIPS
  {
    id: 'pop-can',
    name: 'Pop (Can)',
    description: 'Coke, Pepsi, Sprite, etc.',
    price: 1.99,
    category: 'drinks-dips',
  },
  {
    id: 'pop-2l',
    name: 'Pop (2L Bottle)',
    description: 'Coke, Pepsi, Sprite, etc.',
    price: 3.99,
    category: 'drinks-dips',
  },
  {
    id: 'water',
    name: 'Bottled Water',
    description: '500ml bottle',
    price: 1.99,
    category: 'drinks-dips',
  },
  {
    id: 'dip-ranch',
    name: 'Ranch Dip',
    description: 'Creamy ranch dipping sauce',
    price: 1.49,
    category: 'drinks-dips',
  },
  {
    id: 'dip-garlic',
    name: 'Garlic Dip',
    description: 'Creamy garlic dipping sauce',
    price: 1.49,
    category: 'drinks-dips',
  },
  {
    id: 'dip-marinara',
    name: 'Marinara Sauce',
    description: 'Tomato marinara dipping sauce',
    price: 1.49,
    category: 'drinks-dips',
  },

  // WALK-IN SPECIALS
  {
    id: 'slice-special',
    name: 'Pizza Slice + Pop',
    description: 'One slice of pizza with a can of pop',
    price: 5.99,
    category: 'walk-in-specials',
    popular: true,
  },
  {
    id: 'small-pizza-special',
    name: 'Small Pizza Special',
    description: 'Small 10" pizza with 3 toppings',
    price: 9.99,
    category: 'walk-in-specials',
  },

  // MEALS
  {
    id: 'family-meal-1',
    name: 'Family Meal Deal',
    description: '2 large pizzas, 10 wings, 2L pop',
    price: 49.99,
    category: 'meals',
    popular: true,
  },
  {
    id: 'party-pack',
    name: 'Party Pack',
    description: '3 large pizzas, 20 wings, 2L pop',
    price: 69.99,
    category: 'meals',
  },

  // CAKES
  {
    id: 'chocolate-cake',
    name: 'Chocolate Cake Slice',
    description: 'Rich chocolate cake',
    price: 4.99,
    category: 'cakes',
  },
  {
    id: 'cheesecake',
    name: 'Cheesecake Slice',
    description: 'New York style cheesecake',
    price: 5.99,
    category: 'cakes',
  },
];

// Helper function to get items by category
export const getItemsByCategory = (categoryId: string): MenuItem[] => {
  return menuItems.filter(item => item.category === categoryId);
};

// Helper function to get popular items
export const getPopularItems = (): MenuItem[] => {
  return menuItems.filter(item => item.popular);
};