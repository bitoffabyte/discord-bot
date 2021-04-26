import Discord from 'discord.js';
import { addTeam, joinTeam } from './cmd.js';
import dotenv from 'dotenv';
dotenv.config();
const client = new Discord.Client();
const prefix = '.';
client.on('ready', () => {
	console.log(`loggedin as ${client.user.tag}`);
});
client.on('message', (msg) => {
	console.log(msg.content.startsWith(prefix));
	if (msg.author.bot) return;
	if (msg.content.startsWith(prefix)) {
		const [CMD_name, ...args] = msg.content
			.trim()
			.substring(prefix.length)
			.split(/\s+/);
		console.log(CMD_name, args);
		if (CMD_name === 'team') {
			// create team
			msg.channel.send('team created');
			// console.log(args);
			// console.log(msg.guild.client);
			addTeam(msg, args);
		}
		if (CMD_name === 'join') {
			// create team
			msg.channel.send('Joining');
			// console.log(args);
			// console.log(msg.guild.client);
			joinTeam(msg, args);
		}
	}
});
client.commands = new Discord.Collection();

client.login(process.env.TOKEN);
// console.log(process.env.TOKEN);
