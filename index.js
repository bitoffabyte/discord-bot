import Discord from 'discord.js';
import addTeam from './commands/addTeam.js';
import dotenv from 'dotenv';
import db from './config/db.js';
import joinTeam from './commands/joinTeam.js';
const client = new Discord.Client();
dotenv.config();
db();
const prefix = '.';

client.on('ready', () => {
	console.log(`loggedin as ${client.user.tag}`);
});

client.on('message', (msg) => {
	if (msg.author.bot) return;
	if (msg.channel.name === 'tc')
		if (msg.content.startsWith(prefix)) {
			const [CMD_name, ...args] = msg.content
				.trim()
				.substring(prefix.length)
				.split(/\s+/);

			// if (msg.author.username !== 'bitoffabyte') {
			// 	msg.channel.send(`Fuck you @${msg.author.username}`);
			// 	return;
			// }

			if (CMD_name === 'team') {
				// create team
				// console.log(args);
				// console.log(msg.guild.client);
				addTeam(msg, args);
			}
			if (CMD_name === 'add') {
				joinTeam(msg, args, client);
			}
			if (CMD_name === 'hi') {
				const b = msg.author.id;
				msg.channel.send(`Hi @${msg.author} How are you?`);
			}
			if (CMD_name === 'rr') {
				const b = msg.author.id;
				msg.channel.send(
					`https://tenor.com/view/rick-astley-rick-roll-dancing-dance-moves-gif-14097983`
				);
			}
		}
});

client.login(process.env.TOKEN);
