# Game Deals Bot Discord
A Discord Bot that scrapes [r/GameDeals](https://www.reddit.com/r/GameDeals/) on Reddit for discounts or free deals on Games.\

## Installation
### Setup
Download the project or<br /> Clone using
```
git clone https://github.com/JamesCrr/Discord-GameDeals-Bot.git
```
### Install required packages
Make sure you have npm installed and run the following command to install package dependencies
```
npm install
``` 
### Create your config.json file 
Fill in the required variables
```
{
    "botKey": "Replace with your Bot Key"
}
```
### Run on Local machine
Starts up local host
```
npm run index.js
// OR
node index.js
```

## Discord Related
### Running the Bot on your Server
Because of hosting costs and the project scope, the bot is **not** hosted publicly. If you wish to have a bot that does something similar on your server, check out [mikolajkalwa's bot](https://github.com/mikolajkalwa/GamesDealsBot) which is hosted publicly and open source.
<br/>

### Bot Commands
| Command       | About                                                                                |
| ------------- | ------------------------------------------------------------------------------------ |
| target        | Bot will send info about deals to this channel where the command was issused.        |
| rmtarget      | Bot will NO longer send deals to this channel.                                       |
| latest        | Returns the latest deal.                                                              |
| help          | Displays all possible commands, and what they do.                                    |
| debuglog      | Debug Information.                                                                   |
