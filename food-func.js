const unirest = require('unirest');

const API_KEY = "***REMOVED***";
const x_api = "***REMOVED***"


function generateFood(food_string) {
    return new Promise((resolve, reject) => {
        let INGREDIENT_STRING = food_string


        let requestString = "https://api.spoonacular.com/recipes/716429/information?apiKey=***REMOVED***&includeNutrition=true"

        requestString = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=" + INGREDIENT_STRING + "&number=1&apiKey=***REMOVED***&includeNutrition=true"

        unirest.get(requestString)
            .header(API_KEY)
            .end(result => {
                if (true) {
                    console.log(result.body)
                    const scat = result.body
                    return resolve(scat[0])
                };
            });
    }
    )}

module.exports = generateFood;

