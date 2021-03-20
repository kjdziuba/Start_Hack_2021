const unirest = require('unirest');

const API_KEY = "***REMOVED***";
const x_api = "***REMOVED***"


function guess(food_string) {
    return new Promise((resolve, reject) => {
        let GUESS_STRING = food_string


        let requestString = "https://api.spoonacular.com/recipes/716429/information?apiKey=***REMOVED***&includeNutrition=true"

        requestString = "https://api.spoonacular.com/recipes/guessNutrition?title=" + GUESS_STRING + "&apiKey=***REMOVED***&includeNutrition=true"

        unirest.get(requestString)
            .header(API_KEY)
            .end(result => {
                if (true) {
                    console.log(result.body)
                    const scat = result.body
                    console.log("HELLLLLOOO" + scat.calories.value)
                    return resolve({kcal : scat.calories.value, fat: scat.fat.value, protein: scat.protein.value, carbs: scat.carbs.value})
                };
            });
    }
    )
}

module.exports = guess;