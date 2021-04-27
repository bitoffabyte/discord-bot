import Discord from 'discord.js';
const newPermMember = Discord.Permissions.DEFAULT;
const newPermNonMember = Discord.Permissions.ALL;

async function addTeam(msg, args) {
	//create team and send team data to mongodb

	var guild = msg.guild;
	var teamCategory = msg.channel.parent || null;
	args.shift();
	var teamName = args.join(' ');

	console.log(
		msg.member.roles.cache.some((role) => role.name === 'inTeam'),
		'asdasd'
	);
	if (msg.member.roles.cache.some((role) => role.name === 'inTeam')) {
		msg.channel.send('You are already in a team!');
		return;
	}
	msg.channel.send('Creating Team...');

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
	console.log('reamrole', teamRole.id);
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
	let role = msg.guild.roles.cache.find((r) => r.name === 'inTeam');
	guild.member(msg.author).roles.add(role);

	guild.member(msg.author).roles.add(teamRole);
	msg.channel.send('Done!');
	return Promise.resolve({ msg: 'Success!' });
}

export default addTeam;
