import { API_URL, RES_PER_PAGE, RES_START_PAGE, KEY } from './config';
// import { AJAX, sendJSON, clearBookmarks } from './helpers';
import { AJAX, clearBookmarks } from './helpers';

// All things dealing with current recipe being viewed OR
// Current Search results displayed.
export const state = {
  recipe: {},
  search: {
    query: ``,
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: RES_START_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

//doesn't output anything yet. It just changes our <state> object
export const loadRecipe = async function (id) {
  try {
    //here we await data from another ASynC function, which already has its own await
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    //use let here so we can add new content later on.

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      //We set the current recipe bookmark to true
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    throw err; //this allows us to throw this error into the controller.js so we can print error message into HTML5
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    // https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = RES_START_PAGE;
  } catch (err) {
    throw err; //this allows us to throw this error into the controller.js so we can print error message into HTML5
  }
};

export const getSearchSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  });

  state.recipe.servings = newServings;
};
//Storing the bookmarks
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

//Will load at start
const init = function () {
  //Let's look into local storage to see if a stored cookie called "bookmarks" exist
  const storage = localStorage.getItem('bookmarks');
  //If localStorage item for variable "Storage" exist, then get and process via JSON
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

export const uploadRecipe = async function (newRecipe) {

  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim);
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong Ingredient Format! Please use the correct format:'
          );

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };


    //This will send the recipe back to us, so we store it as data. So see below, when stored as a constant
    // sendJSON(`${API_URL}?key=${KEY}`);

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }

  //Format ingredients captured into a format that the API can understand. Format should match what we received orginally.
  // const ingredients = 0bject.entries(newRecipe).filter(entry =>)
};
