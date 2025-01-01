# 6b6t afk bot
A bot that joins 6b6t and stays afk
*Only works with offline authentication accounts (cracked accounts)*

# Running the bot
1. Make sure you have [nodejs](https://nodejs.org/en) 20 or later and [git](https://git-scm.com/) installed<br>
You can do that by running the following from your console. (Both of the commands show the versions of nodejs and git, if they are installed)
```sh
node -v
git -v
```
2. Download the git repository on your machine by running the following command in your console
```sh
git clone https://github.com/CubeBeveled/6b6t-afk-bot
```
3. Install the required packages<br>
You can do that by running the following inside the `src` folder from your console.
```sh
npm i
```
4. Modify the `config.json` file found inside the `src` folder. More specifically, the [username](https://github.com/CubeBeveled/6b6t-afk-bot?tab=readme-ov-file#username) and [password](https://github.com/CubeBeveled/6b6t-afk-bot?tab=readme-ov-file#username). If you want you can also change the other options.
5. Run the following inside the src folder
```sh
node index.js
```
6. Profit

*NOTE: console is also known as command prompt, if you are on windows*
# Settings
### sendChatMessagesInConsole
If a bot should send chat messages in console

## playerLogger
### enabled
If the bot should log who enters or exits its render distance through a discord webhook

### dcWebhookUrl
The url of the webhook throught which the bot will log who enters and exits render distance

### enterRenderDistance and exitRenderDistance
The settings for when someone enters or exits the bot's render distance.<br>
*exitRenderDistance and enterRenderDistance have the same settings*

#### webhookAvatarUrl
The url of the avatar that the discord webhook will have.

#### webhookUsername
The username that the discord webhook will have.

#### message
The message that the webhook will send.

## Bot object
### username
**make sure to change this setting before running the bot**
The username that the bot will join with. If botCount is more than 1 a number will be added at the end of said username.

### password
**make sure to change this setting before running the bot**
The password that the bot will put into the /login command

### reconnectDelay
*Default: 5.5s*<br>
After how much time should the bot reconnect (in seconds).

### viewDistance
*Default: normal*<br>
The render distance of the bot. Input options for this value can be found [here](https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md#botsettingsviewdistance).

### antiAfk
If the bot should move randomly to avoid getting kicked by anti afk (not necessary on 6b atm)

*For developers* heres the [Mineflayer API documentation](https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md)

___