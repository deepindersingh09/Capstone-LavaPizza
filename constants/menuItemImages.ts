import type { ImageSourcePropType } from "react-native";

// ✅ Fallback image (make sure this file exists)
const placeholder = require("@/assets/menu-images/placeholder.png");

/**
 * IMPORTANT:
 * - Each key must match Firestore/menu item `id` exactly
 * - Each image file should exist at: assets/menu-images/items/<id>.png
 */
export const menuItemImages: Record<string, ImageSourcePropType> = {
  // ===== PIZZA =====
  "cheese-pizza": require("@/assets/menu-images/items/cheese-pizza.png"),
  "pepperoni-pizza": require("@/assets/menu-images/items/pepperoni-pizza.png"),
  "hawaiian-pizza": require("@/assets/menu-images/items/hawaiian-pizza.png"),
  "veggie-pizza": require("@/assets/menu-images/items/veggie-pizza.png"),
  "meat-lovers-pizza": require("@/assets/menu-images/items/meat-lovers-pizza.png"),
  "deluxe-pizza": require("@/assets/menu-images/items/deluxe-pizza.png"),
  "canadian-pizza": require("@/assets/menu-images/items/canadian-pizza.png"),
  "greek-pizza": require("@/assets/menu-images/items/greek-pizza.png"),
  "chicken-pizza": require("@/assets/menu-images/items/chicken-pizza.png"),
  "mexicana-pizza": require("@/assets/menu-images/items/mexicana-pizza.png"),
  "bacon-cheeseburger-pizza": require("@/assets/menu-images/items/bacon-cheeseburger-pizza.png"),
  "supreme-pizza": require("@/assets/menu-images/items/supreme-pizza.png"),
  "tropical-hawaiian-pizza": require("@/assets/menu-images/items/tropical-hawaiian-pizza.png"),

  // ===== GOURMET PIZZA =====
  "bbq-chicken-pizza": require("@/assets/menu-images/items/bbq-chicken-pizza.png"),
  "chicken-ranch-pizza": require("@/assets/menu-images/items/chicken-ranch-pizza.png"),
  "butter-chicken-pizza": require("@/assets/menu-images/items/butter-chicken-pizza.png"),
  "tandoori-chicken-pizza": require("@/assets/menu-images/items/tandoori-chicken-pizza.png"),
  "achari-chicken-pizza": require("@/assets/menu-images/items/achari-chicken-pizza.png"),
  "buffalo-chicken-pizza": require("@/assets/menu-images/items/buffalo-chicken-pizza.png"),
  "pesto-chicken-pizza": require("@/assets/menu-images/items/pesto-chicken-pizza.png"),
  "veggie-supreme-pizza": require("@/assets/menu-images/items/veggie-supreme-pizza.png"),
  "mediterranean-pizza": require("@/assets/menu-images/items/mediterranean-pizza.png"),
  "white-pizza": require("@/assets/menu-images/items/white-pizza.png"),

  // ===== PASTA =====
  "spaghetti-marinara": require("@/assets/menu-images/items/spaghetti-marinara.png"),
  "spaghetti-meatballs": require("@/assets/menu-images/items/spaghetti-meatballs.png"),
  "spaghetti-meat-sauce": require("@/assets/menu-images/items/spaghetti-meat-sauce.png"),
  "penne-alfredo": require("@/assets/menu-images/items/penne-alfredo.png"),
  "penne-marinara": require("@/assets/menu-images/items/penne-marinara.png"),
  "penne-meat-sauce": require("@/assets/menu-images/items/penne-meat-sauce.png"),
  "penne-arrabbiata": require("@/assets/menu-images/items/penne-arrabbiata.png"),
  "fettuccine-alfredo": require("@/assets/menu-images/items/fettuccine-alfredo.png"),
  "fettuccine-carbonara": require("@/assets/menu-images/items/fettuccine-carbonara.png"),
  "chicken-alfredo": require("@/assets/menu-images/items/chicken-alfredo.png"),
  "chicken-penne": require("@/assets/menu-images/items/chicken-penne.png"),
  "baked-lasagna": require("@/assets/menu-images/items/baked-lasagna.png"),
  "vegetarian-lasagna": require("@/assets/menu-images/items/vegetarian-lasagna.png"),
  "baked-ziti": require("@/assets/menu-images/items/baked-ziti.png"),
  ravioli: require("@/assets/menu-images/items/ravioli.png"),

  // ===== APPETIZERS =====
  "garlic-bread": require("@/assets/menu-images/items/garlic-bread.png"),
  "garlic-bread-cheese": require("@/assets/menu-images/items/garlic-bread-cheese.png"),
  breadsticks: require("@/assets/menu-images/items/breadsticks.png"),
  "cheese-breadsticks": require("@/assets/menu-images/items/cheese-breadsticks.png"),
  "mozzarella-sticks": require("@/assets/menu-images/items/mozzarella-sticks.png"),
  "jalapeno-poppers": require("@/assets/menu-images/items/jalapeno-poppers.png"),
  "onion-rings": require("@/assets/menu-images/items/onion-rings.png"),
  "chicken-tenders": require("@/assets/menu-images/items/chicken-tenders.png"),
  "chicken-nuggets": require("@/assets/menu-images/items/chicken-nuggets.png"),
  "potato-skins": require("@/assets/menu-images/items/potato-skins.png"),
  nachos: require("@/assets/menu-images/items/nachos.png"),
  "loaded-nachos": require("@/assets/menu-images/items/loaded-nachos.png"),
  samosas: require("@/assets/menu-images/items/samosas.png"),
  "spring-rolls": require("@/assets/menu-images/items/spring-rolls.png"),

  // ===== WINGS =====
  "wings-1lb": require("@/assets/menu-images/items/wings-1lb.png"),
  "wings-2lb": require("@/assets/menu-images/items/wings-2lb.png"),
  "wings-3lb": require("@/assets/menu-images/items/wings-3lb.png"),
  "wings-4lb": require("@/assets/menu-images/items/wings-4lb.png"),
  "boneless-wings-1lb": require("@/assets/menu-images/items/boneless-wings-1lb.png"),
  "boneless-wings-2lb": require("@/assets/menu-images/items/boneless-wings-2lb.png"),

  // ===== POUTINES =====
  "classic-poutine": require("@/assets/menu-images/items/classic-poutine.png"),
  "chicken-poutine": require("@/assets/menu-images/items/chicken-poutine.png"),
  "donair-poutine": require("@/assets/menu-images/items/donair-poutine.png"),
  "beef-poutine": require("@/assets/menu-images/items/beef-poutine.png"),
  "pulled-pork-poutine": require("@/assets/menu-images/items/pulled-pork-poutine.png"),
  "bacon-poutine": require("@/assets/menu-images/items/bacon-poutine.png"),
  "veggie-poutine": require("@/assets/menu-images/items/veggie-poutine.png"),

  // ===== SHAWARMA =====
  "chicken-shawarma-wrap": require("@/assets/menu-images/items/chicken-shawarma-wrap.png"),
  "beef-shawarma-wrap": require("@/assets/menu-images/items/beef-shawarma-wrap.png"),
  "mixed-shawarma-wrap": require("@/assets/menu-images/items/mixed-shawarma-wrap.png"),
  "falafel-wrap": require("@/assets/menu-images/items/falafel-wrap.png"),
  "donair-wrap": require("@/assets/menu-images/items/donair-wrap.png"),
  "chicken-shawarma-plate": require("@/assets/menu-images/items/chicken-shawarma-plate.png"),
  "beef-shawarma-plate": require("@/assets/menu-images/items/beef-shawarma-plate.png"),
  "mixed-shawarma-plate": require("@/assets/menu-images/items/mixed-shawarma-plate.png"),
  "falafel-plate": require("@/assets/menu-images/items/falafel-plate.png"),
  "donair-plate": require("@/assets/menu-images/items/donair-plate.png"),

  // ===== SUBS =====
  "meatball-sub": require("@/assets/menu-images/items/meatball-sub.png"),
  "chicken-parmesan-sub": require("@/assets/menu-images/items/chicken-parmesan-sub.png"),
  "steak-cheese-sub": require("@/assets/menu-images/items/steak-cheese-sub.png"),
  "italian-sub": require("@/assets/menu-images/items/italian-sub.png"),
  "ham-cheese-sub": require("@/assets/menu-images/items/ham-cheese-sub.png"),
  "turkey-sub": require("@/assets/menu-images/items/turkey-sub.png"),
  "veggie-sub": require("@/assets/menu-images/items/veggie-sub.png"),
  "blt-sub": require("@/assets/menu-images/items/blt-sub.png"),
  "club-sub": require("@/assets/menu-images/items/club-sub.png"),

  // ===== BURGERS =====
  "classic-burger": require("@/assets/menu-images/items/classic-burger.png"),
  cheeseburger: require("@/assets/menu-images/items/cheeseburger.png"),
  "bacon-cheeseburger": require("@/assets/menu-images/items/bacon-cheeseburger.png"),
  "mushroom-swiss-burger": require("@/assets/menu-images/items/mushroom-swiss-burger.png"),
  "chicken-burger": require("@/assets/menu-images/items/chicken-burger.png"),
  "veggie-burger": require("@/assets/menu-images/items/veggie-burger.png"),
  "double-burger": require("@/assets/menu-images/items/double-burger.png"),

  // ===== SALADS =====
  "garden-salad": require("@/assets/menu-images/items/garden-salad.png"),
  "caesar-salad": require("@/assets/menu-images/items/caesar-salad.png"),
  "greek-salad": require("@/assets/menu-images/items/greek-salad.png"),
  "chicken-caesar-salad": require("@/assets/menu-images/items/chicken-caesar-salad.png"),
  "chicken-garden-salad": require("@/assets/menu-images/items/chicken-garden-salad.png"),
  "chicken-greek-salad": require("@/assets/menu-images/items/chicken-greek-salad.png"),
  "taco-salad": require("@/assets/menu-images/items/taco-salad.png"),

  // ===== SIDES =====
  "french-fries": require("@/assets/menu-images/items/french-fries.png"),
  "curly-fries": require("@/assets/menu-images/items/curly-fries.png"),
  "sweet-potato-fries": require("@/assets/menu-images/items/sweet-potato-fries.png"),
  "potato-wedges": require("@/assets/menu-images/items/potato-wedges.png"),
  coleslaw: require("@/assets/menu-images/items/coleslaw.png"),
  rice: require("@/assets/menu-images/items/rice.png"),
  "hummus-pita": require("@/assets/menu-images/items/hummus-pita.png"),

  // ===== DESSERTS =====
  "chocolate-cake": require("@/assets/menu-images/items/chocolate-cake.png"),
  cheesecake: require("@/assets/menu-images/items/cheesecake.png"),
  tiramisu: require("@/assets/menu-images/items/tiramisu.png"),
  brownie: require("@/assets/menu-images/items/brownie.png"),
  "brownie-ice-cream": require("@/assets/menu-images/items/brownie-ice-cream.png"),
  "ice-cream": require("@/assets/menu-images/items/ice-cream.png"),

  // ===== DRINKS & DIPS =====
  "pop-can": require("@/assets/menu-images/items/pop-can.png"),
  "pop-2l": require("@/assets/menu-images/items/pop-2l.png"),
  "bottled-water": require("@/assets/menu-images/items/bottled-water.png"),
  juice: require("@/assets/menu-images/items/juice.png"),
  "iced-tea": require("@/assets/menu-images/items/iced-tea.png"),
  "dip-ranch": require("@/assets/menu-images/items/dip-ranch.png"),
  "dip-garlic": require("@/assets/menu-images/items/dip-garlic.png"),
  "dip-marinara": require("@/assets/menu-images/items/dip-marinara.png"),
  "dip-blue-cheese": require("@/assets/menu-images/items/dip-blue-cheese.png"),
  "dip-bbq": require("@/assets/menu-images/items/dip-bbq.png"),
  "dip-hot-sauce": require("@/assets/menu-images/items/dip-hot-sauce.png"),

  // ===== DEALS =====
  "small-pizza-deal": require("@/assets/menu-images/items/small-pizza-deal.png"),
  "medium-pizza-deal": require("@/assets/menu-images/items/medium-pizza-deal.png"),
  "large-pizza-deal": require("@/assets/menu-images/items/large-pizza-deal.png"),
  "xlarge-pizza-deal": require("@/assets/menu-images/items/xlarge-pizza-deal.png"),
  "triple-pizza-deal": require("@/assets/menu-images/items/triple-pizza-deal.png"),
  "pizza-wings-combo": require("@/assets/menu-images/items/pizza-wings-combo.png"),
  "family-meal": require("@/assets/menu-images/items/family-meal.png"),
  "party-pack": require("@/assets/menu-images/items/party-pack.png"),
  "super-party-pack": require("@/assets/menu-images/items/super-party-pack.png"),
  "walk-in-special": require("@/assets/menu-images/items/walk-in-special.png"),
  "lunch-special": require("@/assets/menu-images/items/lunch-special.png"),
};

export const getMenuItemImage = (itemId?: string | null): ImageSourcePropType => {
  if (!itemId) return placeholder;
  return menuItemImages[itemId] ?? placeholder;
};
