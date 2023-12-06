import { productA, productB, Salesboard } from "./data.js"

const btnProductA = document.getElementById('btn-product-a')
const btnProductB = document.getElementById('btn-product-b')
const btnReset = document.getElementById('btn-reset')
const btnToggleTheme = document.getElementById('btn-toggle-theme')
const liveSalesEl = document.getElementById('p-live-sales')
const spanLiveSales = document.getElementById('span-live-sales')
const achievementsEl = document.getElementById('p-achievements')
const spanLiveAchievements = document.getElementById('span-live-achievements')
const totalRevenueEl = document.getElementById('p-revenue')
const totalCommissionEl = document.getElementById('p-commission')
const statisticsEls = document.querySelectorAll('.stats')

let salesData = {}

// Event listeners
btnProductA.addEventListener('click', () => {
    soldProduct(productA)
})

btnProductB.addEventListener('click', () => {
    soldProduct(productB)
})

btnReset.addEventListener('click', () => {
    localStorage.removeItem('Salesboard')
    salesData = new Salesboard()
    updateStatsDisplay()
})

btnToggleTheme.addEventListener('click', () => {
    toggleTheme()
})

// Do some start up stuff; pre-load any existing data (sales and theme)
function initSalesboard() {
    localStorage.getItem('Salesboard') ? initFromSaved() : initNew()
    // defaults to dark if no local theme set 
    localStorage.getItem('SalesboardTheme') === 'light' ? setTheme('light') : setTheme('dark')
}

// Self explanatory
function initFromSaved() {
    const localData = JSON.parse(localStorage.getItem('Salesboard'))
    salesData = new Salesboard(
                localData.revenue, 
                localData.commission,
                localData.sales,
                localData.achievements)

    // Update display with restored data
    updateStatsDisplay()
}

// Self explanatory
function initNew() {
    salesData = new Salesboard()
}

// Feel like this function is a bit ugly...but already re-factored the hell out
// of this project so it will have to do :-)
function soldProduct(product) {
    // Take care of business
    salesData.sales.push(product.emoji)
    salesData.revenue += product.revenue
    salesData.commission += product.commission

    // Does this sale qualify the user for an achievement?
    checkForAchievements()

    // Display changes to the user
    updateStatsDisplay()
    
    // Write to local storage
    saveSalesData()
}

function saveSalesData() {
    localStorage.setItem('Salesboard', JSON.stringify(salesData))
}

// Update stats, called each time a sale is made, only deals with visuals
function updateStatsDisplay() {
    // clear the decks
    clearStatsDisplay()
    // update statistics display elements
    liveSalesEl.textContent = getLiveSalesAsString()
    achievementsEl.textContent = getAchievementsAsString()
    totalRevenueEl.textContent = `$${salesData.revenue}`
    totalCommissionEl.textContent = `$${salesData.commission}`
    spanLiveSales.textContent = salesData.sales.length
    spanLiveAchievements.textContent = getAchievementCount()
}

// Does what it says on the tin
function getLiveSalesAsString() {
    return salesData.sales.toString().replaceAll(',',' ')
}

// Does what it says on the tin
function getAchievementsAsString() {
    let achievementString = ''
    const achievementsArr = Object.values(salesData.achievements)
    achievementsArr.forEach(achievement => {
        achievement.achieved ? achievementString += achievement.emoji : ''
    })
    return achievementString
}

// Loops through achievmements and counts the 'true' ones
function getAchievementCount() {
    let total = 0
    Object.values(salesData.achievements).forEach(achievement => {
        achievement.achieved ? total++ : ''
    })
    return total
}

// Does what it says on the tin
function clearStatsDisplay() {
    statisticsEls.forEach(el => el.textContent = '')
}

// Loop through achievements object, pass achievements one by one to 
// awardAchievement function which checks if the user qualifies for that
// achievement
function checkForAchievements() {
    // Make achievements obj iterable
    const achievementsArr = Object.keys(salesData.achievements)
    // Iterate and check each achievement (will be calculated in
    // awardAchievement function
    achievementsArr.forEach(key => awardAchievement(key))
}

// Pass in the achievement key/ID and we'll check if the user qualifies for that 
// particular achievement (called from checkForAchievements())
function awardAchievement(achievementID) {
    // set achievement type (sales, commission, revenue etc), 
    // and get the criteria for that ach. from the obj
    const achievementType = salesData.achievements[achievementID].type
    const achievementCriteria = salesData.achievements[achievementID].criteria
    let hasBeenAchieved = salesData.achievements[achievementID].achieved

    // Object with functions as values so we can call them by achievement type. 
    // Means we can re-use the same code for each achievement that uses the same type
    // (e.g. if achievement is based on revenue or commission we don't write the same code twice), 
    // and we can choose which code is required to calculate an achievement of given type
    const calcAchievementByType = {
        liveSales: () => {
            if (salesData.sales.length >= achievementCriteria) hasBeenAchieved = true
        },
        totalRevenue: () => {
            if (salesData.revenue >= achievementCriteria) hasBeenAchieved = true
        },
        totalCommission: () => {
            if (salesData.commission >= achievementCriteria) hasBeenAchieved = true
        },
        finalAchievement: () => {
            // The others are self explanatory but this one needs more commentary
            let achievedEverything = true
            // first filter out the 'achieved everything' achievement, if it's left in 
            // the function breaks, because achievedEverything will never be true here
            const { earnedAllAchievements, ...filteredObj } = salesData.achievements
            // Iterate over the filtered objects, if user hasn't achieved something
            // we set achievedEverything to false
            Object.values(filteredObj).forEach(achievement => {
                if (!achievement.achieved) achievedEverything = false
            })
            hasBeenAchieved = achievedEverything
        }
    }

    // Only call function if current achievement isn't already achieved, otherwise
    // reference our 'switch like' object and pass in achievement type to run the relevant
    // code
    if (!hasBeenAchieved) {
        calcAchievementByType[achievementType]()
    } else {
        return 
    }

    // Update the achievement in the global achievements object
    salesData.achievements[achievementID].achieved = hasBeenAchieved
}

/* Theme stuff */
function setTheme(theme) {
    localStorage.setItem('SalesboardTheme', theme) 
    document.documentElement.className = theme
    theme === 'dark' ? btnToggleTheme.textContent = '🌝' : btnToggleTheme.textContent = '🌚'
}

function toggleTheme() {
    localStorage.getItem('SalesboardTheme') === 'dark' ? setTheme('light') : setTheme('dark')
}

// Showtime
initSalesboard()