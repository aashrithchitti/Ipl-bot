const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = "MTQ4MjMzMTUxMzYyMTMxNTc0NA.GYJnn-.gihokutBQi0yZG0j3uJ_Y9vgPrX_-KF6Gdux7U";
const API_KEY = "4adf2dd4-785e-4173-b799-be6a8b185a37"; // optional, only needed for live matches

client.once("ready", () => {
  console.log("🏏 IPL Bot is online!");
});

// Hardcoded last 5 years stats (can be updated manually each year)
const last5YearsRuns = {
  2025: [{player:"Sai Sudharsan (GT)", runs:759}],
  2024: [{player:"Virat Kohli (RCB)", runs:741}],
  2023: [{player:"Shubman Gill (GT)", runs:890}],
  2022: [{player:"Jos Buttler (RR)", runs:863}],
  2021: [{player:"Ruturaj Gaikwad (CSK)", runs:635}]
};

const last5YearsWickets = {
  2025: [{player:"Prasidh Krishna (GT)", wickets:25}],
  2024: [{player:"Harshal Patel (PBKS)", wickets:24}],
  2023: [{player:"Mohammed Shami (GT)", wickets:28}],
  2022: [{player:"Yuzvendra Chahal (RR)", wickets:27}],
  2021: [{player:"Harshal Patel (RCB)", wickets:32}]
};

const allTimeBatsmen = [
  {player:"Virat Kohli", runs:8661},
  {player:"Shikhar Dhawan", runs:5731},
  {player:"Rohit Sharma", runs:5413}
];

const allTimeBowlers = [
  {player:"Yuzvendra Chahal", wickets:221},
  {player:"Bhuvneshwar Kumar", wickets:200},
  {player:"Sunil Narine", wickets:195}
];

client.on("messageCreate", async (message) => {

  // Show next match
  if (message.content === "!next") {
    message.channel.send("📅 Next IPL match: Sunrisers Hyderabad vs Royal Challengers Bengaluru (March 28, 2026)");
  }

  // Points table
  if (message.content === "!table" || message.content === "!ipl") {
    message.channel.send("📊 IPL table will update after the first match starts.");
  }

  // Live matches using API
  if (message.content === "!live") {
    try {
      const res = await axios.get(`https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`);
      let msg = "🏏 **Live Matches**\n\n";
      res.data.data.slice(0,5).forEach(match => {
        msg += `${match.name}\n${match.status}\n\n`;
      });
      message.channel.send(msg);
    } catch (err) {
      console.log(err);
      message.channel.send("❌ Could not fetch match data");
    }
  }

  // Year-specific stats
  if (message.content.startsWith("!stats")) {
    const parts = message.content.split(" ");
    if (parts.length < 3) return message.channel.send("Usage: !stats YEAR runs/wickets");
    const year = parseInt(parts[1]);
    const type = parts[2].toLowerCase();

    if (type === "runs") {
      if (!last5YearsRuns[year]) return message.channel.send("No data for that year.");
      let msg = `🏏 Top run scorers in IPL ${year}:\n\n`;
      last5YearsRuns[year].forEach((p,i)=> msg += `${i+1}. ${p.player} - ${p.runs} runs\n`);
      message.channel.send(msg);
    } else if (type === "wickets") {
      if (!last5YearsWickets[year]) return message.channel.send("No data for that year.");
      let msg = `🎯 Top wicket takers in IPL ${year}:\n\n`;
      last5YearsWickets[year].forEach((p,i)=> msg += `${i+1}. ${p.player} - ${p.wickets} wickets\n`);
      message.channel.send(msg);
    } else {
      message.channel.send("Type must be runs or wickets.");
    }
  }

  // All-time stats
  if (message.content === "!alltime batsmen") {
    let msg = "🏏 All-time top run scorers in IPL:\n\n";
    allTimeBatsmen.forEach((p,i)=> msg += `${i+1}. ${p.player} - ${p.runs} runs\n`);
    message.channel.send(msg);
  }

  if (message.content === "!alltime bowlers") {
    let msg = "🎯 All-time top wicket takers in IPL:\n\n";
    allTimeBowlers.forEach((p,i)=> msg += `${i+1}. ${p.player} - ${p.wickets} wickets\n`);
    message.channel.send(msg);
  }

});

client.login(TOKEN);
