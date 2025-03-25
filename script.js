let API_KEY = "3842fe6f66654eaf8906df5e330efecc";
let recipeCount = 15;
let currentCuisine = "";
let allRecipes = [];

let all = ["All"]

// Default recipes when the page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchRecipes();

    // Scroll event listeners
    let scrollContainer = document.getElementById("recipescroll");
    document.getElementById("rightarrow").addEventListener("click", () => {
        scrollContainer.scrollBy({ left: 300, behavior: "smooth" });
    });

    document.getElementById("leftarrow").addEventListener("click", () => {
        scrollContainer.scrollBy({ left: -300, behavior: "smooth" });
    });
});

// Fetch recipes
async function fetchRecipes(cuisine = "", query = "") {
    currentCuisine = cuisine;

    if (query) {
        // Search specific recipes
        API_URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}&number=${recipeCount}&cuisine=${cuisine}&addRecipeInformation=true`;
    } else {
        // Fetch random recipes based on cuisine
        API_URL = `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=${recipeCount}`;
        if (cuisine) {
            API_URL += `&tags=${cuisine}`;
        }
    }

    let loader = document.getElementById("loader");
    let recipeGrid = document.getElementById("recipegrids");
    let recipeScroll = document.getElementById("recipescroll");
    let viewMoreButton = document.getElementById("viewMore");

    // Show loader,clear previous content
    loader.style.display = "block";
    recipeGrid.innerHTML = "";
    recipeScroll.innerHTML = "";
    viewMoreButton.style.display = "none";

    try {
        let response = await fetch(API_URL);
        let data = await response.json();
        console.log(data);
        
        loader.style.display = "none"; // Hide loader

        let recipes = data.recipes || data.results || [];
        
                

        if (recipes.length === 0) {
            recipeGrid.innerHTML = "<p>No recipes found. Try a different search!</p>";
            return;
        }

        allRecipes = recipes;
        displayRecipes(recipes);
        displayScrollRecipes(recipes);
        viewMoreButton.style.display = "block"; // Show View More button
    } catch (error) {
        console.error("Error fetching data:", error);
        loader.style.display = "none";
        recipeGrid.innerHTML = "<p>Something went wrong. Please try again later.</p>";
    }
}

// Display recipes in the  grid
function displayRecipes(recipes) {
    let recipeGrid = document.getElementById("recipegrids");
  

    recipes.forEach((recipe) => {
        let recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");

        recipe.cuisines.forEach((elemen) => {
            if (!all.includes(elemen)) { 
                all.push(elemen);
            }
        });

        recipeDiv.innerHTML = `<div onclick="openRecipe('${recipe.image}', '${recipe.title}')">
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            </div>
        `;

        recipeGrid.appendChild(recipeDiv);
    });
let filterbtn=document.getElementById("filter-buttons");

all.forEach((valueitem)=>{
    let valueItem=document.createElement("div");
    valueItem.innerHTML=`
    <button onclick="fetchRecipes('')">${valueitem}</button>
    `;
    filterbtn.appendChild(valueItem);
});

}

// Display recipes in the horizontal scroll 
function displayScrollRecipes(recipes) {
    let recipeScroll = document.getElementById("recipescroll");
    if (!recipes || recipes.length === 0) return;

    recipes.forEach((recipe) => {
        let recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe-item");

        recipeDiv.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
            
        `;

        recipeScroll.appendChild(recipeDiv);
    });
}

// Load more recipes new recipes
async function loadMoreRecipes() {
    let API_URL = `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=15`;

    if (currentCuisine) {
        API_URL += `&tags=${currentCuisine}`;
    }

    try {
        document.getElementById("loader").style.display = "block";
        let response = await fetch(API_URL);
        let data = await response.json();
        document.getElementById("loader").style.display = "none";

        let newRecipes = data.recipes || data.results || [];
        console.log(newRecipes);
        
        if (newRecipes.length > 0) {
            allRecipes = [...allRecipes, ...newRecipes];
            displayRecipes(newRecipes);
        }
    } catch (error) {
        console.error("Error fetching more recipes:", error);
        document.getElementById("loader").style.display = "none";
    }
}

// Search cuisine or specific recipe
function searchRecipes() {
    let searchQuery = document.getElementById("searchInput").value.trim();
    if (searchQuery.length > 0) {
        fetchRecipes(currentCuisine, searchQuery);
    }
}

// Open a viewrecipe in full image
function openRecipe(imageUrl, title) {
    document.getElementById("viewrecipe").style.display = "block";
    document.getElementById("recipeimage").src = imageUrl;
    document.getElementById("recipetitle").innerText = title;
}

// Close a viewrecipe in full image
function closeRecipe() {
    document.getElementById("viewrecipe").style.display = "none";
}

// Close viewrecipe clicking outside
window.onclick = function (event) {
    let recipeItem = document.getElementById("viewrecipe");
    if (event.target === recipeItem) {
        closeRecipe();
    }
};
