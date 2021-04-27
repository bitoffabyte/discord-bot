import Discord from 'discord.js';
import addTeam from './commands/addTeam.js';
import dotenv from 'dotenv';
import db from './config/db.js';
const client = new Discord.Client();
dotenv.config();
db();
const prefix = '.';

client.on('ready', () => {
	console.log(`loggedin as ${client.user.tag}`);
});

client.on('message', (msg) => {
	if (msg.author.bot) return;

	if (msg.content.startsWith(prefix)) {
		const [CMD_name, ...args] = msg.content
			.trim()
			.substring(prefix.length)
			.split(/\s+/);

		if (msg.author.username !== 'bitoffabyte') {
			msg.channel.send(`Fuck you @${msg.author.username}`);
			return;
		}

		if (CMD_name === 'team') {
			// create team
			// console.log(args);
			// console.log(msg.guild.client);
			addTeam(msg, args);
		}
	}
});

client.login(process.env.TOKEN);
