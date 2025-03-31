let currentMood = '';

document.addEventListener('DOMContentLoaded', () => {
    const moodButtons = document.querySelectorAll('.mood-btn');
    const recipeContainer = document.getElementById('recipe-container');
    const newRecipeButton = document.getElementById('new-recipe');

    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentMood = button.dataset.mood;
            getRecipe(currentMood);
        });
    });

    newRecipeButton.addEventListener('click', () => {
        if (currentMood) {
            getRecipe(currentMood);
        } else {
            alert('Please select a mood first!');
        }
    });
});

async function getRecipe(mood) {
    const recipeContainer = document.getElementById('recipe-container');
    const newRecipeButton = document.getElementById('new-recipe');
    
    try {
        // Show loading state
        newRecipeButton.disabled = true;
        newRecipeButton.textContent = 'Loading...';
        
        const response = await fetch(`/api/recipe/${mood}`);
        const recipe = await response.json();
        
        if (recipe) {
            displayRecipe(recipe);
            recipeContainer.classList.remove('hidden');
            
            // Add a fade-in animation
            recipeContainer.style.opacity = '0';
            setTimeout(() => {
                recipeContainer.style.transition = 'opacity 0.5s ease-in';
                recipeContainer.style.opacity = '1';
            }, 50);
        } else {
            alert('No recipe found for this mood. Try another mood!');
        }
    } catch (error) {
        console.error('Error fetching recipe:', error);
        alert('Error fetching recipe. Please try again.');
    } finally {
        // Reset button state
        newRecipeButton.disabled = false;
        newRecipeButton.textContent = 'Get Another Recipe';
    }
}

function displayRecipe(recipe) {
    document.getElementById('recipe-name').textContent = recipe.name;
    document.getElementById('recipe-ingredients').textContent = recipe.ingredients;
    document.getElementById('recipe-instructions').textContent = recipe.instructions;
} 