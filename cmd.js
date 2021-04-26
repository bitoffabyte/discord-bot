import Discord from 'discord.js';

const newPermMember = Discord.Permissions.DEFAULT;
const newPermNonMember = Discord.Permissions.ALL;

export async function addTeam(msg, args) {
	var guild = msg.guild;
	var teamCategory = msg.channel.parent || null;
	args.shift();
	var teamName = args.join(' ');
	var teamRole = await guild.roles
		.create({
			data: {
				name: teamName,
				color: 'RANDOM',
				permissions: Discord.Permissions.DEFAULT,
				mentionable: true,
			},
			reason: msg.author.username + ' created a team.',
		})
		.catch((err) => console.error);
	var permissionOverwrites = [
		{ id: teamRole, allow: newPermMember, type: 'role' },
		{ id: guild.roles.everyone, deny: newPermNonMember, type: 'role' },
	];
	await guild.channels.create(args.join('-').toLowerCase(), {
		type: 'text',
		topic: 'Planning',
		parent: teamCategory,
		permissionOverwrites: permissionOverwrites,
	});
	await guild.channels.create(teamName + ' VC', {
		type: 'voice',
		topic: 'Planning',
		parent: teamCategory,
		permissionOverwrites: permissionOverwrites,
	});
	guild.member(msg.author).roles.add(teamRole);

	return Promise.resolve({ msg: 'Success!' });
}

export async function joinTeam(msg, args) {
	// args.shift();
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
