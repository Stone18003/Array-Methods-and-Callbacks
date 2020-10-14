import {
    fifaData
} from './fifa.js';
console.log(fifaData);

console.log('its working');
// ⚽️ M  V P ⚽️ //

/* Task 1: Investigate the data above. Practice accessing data by console.log-ing the following pieces of data 

(a) Home Team name for 2014 world cup final
(b) Away Team name for 2014 world cup final
(c) Home Team goals for 2014 world cup final
(d) Away Team goals for 2014 world cup final
(e) Winner of 2014 world cup final */

console.log(fifaData.find(fifa => fifa.Year === 2014 && fifa.Stage === "Final")["Home Team Name"]);
console.log(fifaData.find(fifa => fifa.Year === 2014 && fifa.Stage === "Final")["Away Team Name"]);
console.log(fifaData.find(fifa => fifa.Year === 2014 && fifa.Stage === "Final")["Home Team Goals"]);
console.log(fifaData.find(fifa => fifa.Year === 2014 && fifa.Stage === "Final")["Away Team Goals"]);
console.log(fifaData.find(fifa => fifa.Year === 2014 && fifa.Stage === "Final")["Away Team Name"]);

/* Task 2: Create a function called  getFinals that takes `data` as an argument and returns an array of objects with only finals data */

function getFinals(data) {
    return data.filter(fifa => fifa.Stage === "Final");

};
// console.log(JSON.stringify(getFinals(fifaData), null, 2));

/* Task 3: Implement a higher-order function called `getYears` that accepts the callback function `getFinals`, and returns an array called `years` containing all of the years in the dataset */

function getYears(data, callBack) {
    let years = callBack(data).map(fifa => fifa.Year);
    return years;

};

console.log(JSON.stringify(getYears(fifaData, getFinals)));



/* Task 4: Implement a higher-order function called `getWinners`, that accepts the callback function `getFinals()` and determine the winner (home or away) of each `finals` game. Return the name of all winning countries in an array called `winners` */

function getWinners(data, callBack) {
    let winners = callBack(data).map(fifa => {
        if (fifa["Home Team Goals"] > fifa["Away Team Goals"]) {
            return fifa["Home Team Name"]
        } else if (fifa["Home Team Goals"] < fifa["Away Team Goals"]) {
            return fifa["Away Team Name"]
        } else {
            return "";
        }
    });
    return winners;
};

console.log(JSON.stringify(getWinners(fifaData, getFinals)));

/* Task 5: Implement a higher-order function called `getWinnersByYear` that accepts the following parameters and returns a set of strings "In {year}, {country} won the world cup!" 

Parameters: 
 * callback function getWinners
 * callback function getYears
 */

function getWinnersByYear(data, callBack1, callBack2) {
    let years = callBack2(data, getFinals);
    let winners = callBack1(data, getFinals);
    let result = [];
    for (let index = 0; index < years.length; index++) {
        const year = years[index];
        const country = winners[index];
        result.push(`In ${year}, ${country} won the world cup!`);
    }
    return result;
};

console.log(JSON.stringify(getWinnersByYear(fifaData, getWinners, getYears)));

/* Task 6: Write a function called `getAverageGoals` that accepts a parameter `data` and returns the the average number of home team goals and away team goals scored per match (Hint: use .reduce and do this in 2 steps) */

function getAverageGoals(data) {
    let averageHomeGoals = data.reduce(function(accumulator, fifa) {
        return accumulator + fifa["Home Team Goals"]
    }, 0) / data.length; //total goals divided by number of games
    let averageAwayGoals = data.reduce(function(accumulator, fifa) {
        return accumulator + fifa["Away Team Goals"]
    }, 0) / data.length; //total goals divided by number of games

    //return the averages as 2 decimal places. Since toFixed makes it a string, go ahead and parse it back to a number so we return a number not a string.
    //Since this function wants me to return 2 values. I'm returning the values as part of a JSON object.
    return {
        "Average Home Team Goals": Number(averageHomeGoals.toFixed(2)),
        "Average Away Team Goals": Number(averageAwayGoals.toFixed(2)),
    }
};

console.log(JSON.stringify(getAverageGoals(fifaData)));

/// STRETCH 🥅 //

/* Stretch 1: Create a function called `getCountryWins` that takes the parameters `data` and `team initials` and returns the number of world cup wins that country has had. 

Hint: Investigate your data to find "team initials"!
Hint: use `.reduce` */

function getCountryWins(data, initials) {
    let numberOfWorldCupWins = data.reduce(function(accumulator, fifa) {
        if (fifa["Stage"] === "Final" &&
            ((fifa["Home Team Initials"] === initials && fifa["Home Team Goals"] > fifa["Away Team Goals"]) ||
                (fifa["Away Team Initials"] === initials && fifa["Home Team Goals"] < fifa["Away Team Goals"]))
        ) {
            return accumulator + 1;
        } else {
            return accumulator;
        }

    }, 0);
    return numberOfWorldCupWins;
};

console.log(JSON.stringify(getCountryWins(fifaData, "BRA")));


/* Stretch 3: Write a function called getGoals() that accepts a parameter `data` and returns the team with the most goals score per appearance (average goals for) in the World Cup finals */

function getGoals(data) {
    let teamFinalGoals = []; //will creat one entry for every team that appeared in the finals
    console.log(JSON.stringify(`there were ${data.length} games.`));
    for (let index = 0; index < data.length; index++) {
        const fifa = data[index];
        if (fifa.Stage === "Final") { //I only care if it's a final
            let awayTeamGoals = fifa["Away Team Goals"];
            let awayTeamName = fifa["Away Team Name"];
            let homeTeamGoals = fifa["Home Team Goals"];
            let homeTeamName = fifa["Home Team Name"];

            let existingHomeEntry = teamFinalGoals.find(element => element.team === homeTeamName); //see if we already have a entry for the home team
            let existingAwayEntry = teamFinalGoals.find(element => element.team === awayTeamName); //see if we already have a entry for the away team
            if (existingHomeEntry === undefined) { //there is no entry for this team so I have to create one
                console.log(`adding entry for ${homeTeamName}.`);
                teamFinalGoals.push({
                    team: homeTeamName,
                    goals: homeTeamGoals,
                });
            } else { //there is alreay an existing entry, have to add goals to existing goals
                console.log(`updating entry for ${homeTeamName}.`)
                existingHomeEntry.goals += homeTeamGoals;
            }

            if (existingAwayEntry === undefined) {
                console.log(`adding entry for ${awayTeamName}.`);
                teamFinalGoals.push({
                    team: awayTeamName,
                    goals: awayTeamGoals,
                });
            } else {
                console.log(`updating entry for ${awayTeamName}.`)
                existingAwayEntry.goals += awayTeamGoals;
            }
        }
    }
    console.log(JSON.stringify(`there were ${teamFinalGoals.length} teams that played in the finals.`));
    return teamFinalGoals;

};

console.log(JSON.stringify(getGoals(fifaData)));


/* Stretch 4: Write a function called badDefense() that accepts a parameter `data` and calculates the team with the most goals scored against them per appearance (average goals against) in the World Cup finals */

function badDefense(data) {
    let teamFinalGoals = []; //will creat one entry for every team that appeared in the finals
    console.log(JSON.stringify(`there were ${data.length} games.`));
    for (let index = 0; index < data.length; index++) {
        const fifa = data[index];
        if (fifa.Stage === "Final") { //I only care if it's a final
            let awayTeamGoals = fifa["Away Team Goals"];
            let awayTeamName = fifa["Away Team Name"];
            let homeTeamGoals = fifa["Home Team Goals"];
            let homeTeamName = fifa["Home Team Name"];

            let existingHomeEntry = teamFinalGoals.find(element => element.team === homeTeamName); //see if we already have a entry for the home team
            let existingAwayEntry = teamFinalGoals.find(element => element.team === awayTeamName); //see if we already have a entry for the away team
            if (existingHomeEntry === undefined) { //there is no entry for this team so I have to create one
                console.log(`adding entry for ${homeTeamName}.`);
                teamFinalGoals.push({
                    team: homeTeamName,
                    goalsScoredAgainst: awayTeamGoals,
                });
            } else { //there is alreay an existing entry, have to add goals to existing goals
                console.log(`updating entry for ${homeTeamName}.`)
                existingHomeEntry.goalsScoredAgainst += awayTeamGoals;
            }

            if (existingAwayEntry === undefined) {
                console.log(`adding entry for ${awayTeamName}.`);
                teamFinalGoals.push({
                    team: awayTeamName,
                    goalsScoredAgainst: homeTeamGoals,
                });
            } else {
                console.log(`updating entry for ${awayTeamName}.`)
                existingAwayEntry.goalsScoredAgainst += homeTeamGoals;
            }
        }
    }
    console.log(JSON.stringify(`there were ${teamFinalGoals.length} teams that played in the finals.`));
    let worstTeam = teamFinalGoals.reduce((previous, next) => (+previous.goalsScoredAgainst > +next.goalsScoredAgainst ? previous : next)); //find the object wit the maximum value
    console.log(JSON.stringify(teamFinalGoals, null, 2));
    return worstTeam;

};

console.log(JSON.stringify(badDefense(fifaData)));

/* If you still have time, use the space below to work on any stretch goals of your chosing as listed in the README file. */