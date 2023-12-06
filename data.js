// Product A info
const productA = {
    emoji: "⭐",
    revenue: 200,
    commission: 50
}

// Product B info
const productB = {
    emoji: "🔥",
    revenue: 300,
    commission: 75
}

class Salesboard {
    constructor(
        revenue = 0,
        commission = 0,
        sales = [],
        achievements = {
            firstSale: {
                type: 'liveSales',
                criteria: 1,
                achieved: false,
                emoji: '🔔 '
            },
            fifteenthSale: {
                type: 'liveSales', 
                criteria: 15, 
                achieved: false, 
                emoji: '🍾 '
            },
            twentyFifthSale: {
                type: 'liveSales', 
                criteria: 25,
                achieved: false,
                emoji: '🥂 '},
            earned2500: {
                type: 'totalRevenue',
                criteria: 2500,
                achieved: false,
                emoji: '💰 '
            },
            earned5000: {
                type: 'totalRevenue',
                criteria: 5000,
                achieved: false,
                emoji: '🏆 '},
            earned3000commission: {
                type: 'totalCommission',
                criteria: 3000,
                achieved: false,
                emoji: '🤑 '
            },
            earnedAllAchievements: {
                type: 'finalAchievement',
                criteria: null,
                achieved: false,    
                emoji: '🤯 '
            }
        }
    ) {
        this.revenue = revenue
        this.commission = commission
        this.sales = sales
        this.achievements = achievements
    }
}

export {productA, productB, Salesboard}

