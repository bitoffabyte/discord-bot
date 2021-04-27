import Discord from 'discord.js';
import prettyFormat from 'pretty-format';
const newPermMember = Discord.Permissions.DEFAULT;
const newPermNonMember = Discord.Permissions.ALL;

export async function joinTeam(msg, args, client) {
	// args.shift();
	client.on('messageReactionAdd', (reaction, user) => {
		console.log(prettyFormat(user));
	});
	var joinRole = args.join(' ');
	console.log(joinRole);
	let role = msg.guild.roles;
	const myRole = msg.guild.roles.cache.find((r) => r.name === joinRole);

	if (!myRole) {
		console.log(myRole);
		msg.channel.send('Could not find team. :cry:');
		return;
	}
	msg.guild.member(msg.author).roles.add(myRole.id);
}
