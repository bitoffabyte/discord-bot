import Discord from 'discord.js';
const newPermMember = Discord.Permissions.DEFAULT;
const newPermNonMember = Discord.Permissions.ALL;
import Team from '../models/Team.js';
async function addTeam(msg, args) {
	//create team and send team data to mongodb
	if (args.length < 2 || args[0] !== 'create') {
		msg.reply('Please enter the right command *team create team_name');
		return;
	}

	if (args.length > 2) {
		msg.reply('Please keep team name to one word');
		return;
	}

	var guild = msg.guild;
	var teamCategory = msg.channel.parent || null;
	args.shift();
	var teamName = args.join(' ');

	// Check if user is already in a team

	if (msg.member.roles.cache.some((role) => role.name === 'inTeam')) {
		msg.reply('You are already in a team!');
		return;
	}

	// Createteam role

	msg.reply('Creating Team...');

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
	// console.log('reamrole', teamRole.id);
	var permissionOverwrites = [
		{ id: teamRole, allow: newPermMember, type: 'role' },
		{ id: guild.roles.everyone, deny: newPermNonMember, type: 'role' },
	];

	// Create vc and tc

	const vc = await guild.channels.create(args.join('-').toLowerCase(), {
		type: 'text',
		topic: 'Planning',
		parent: teamCategory,
		permissionOverwrites: permissionOverwrites,
	});
	const tc = await guild.channels.create(teamName + ' VC', {
		type: 'voice',
		topic: 'Planning',
		parent: teamCategory,
		permissionOverwrites: permissionOverwrites,
	});
	// console.log(vc.id, tc.id);

	// Add Role

	let role = msg.guild.roles.cache.find((r) => r.name === 'inTeam');
	// console.log(role);
	guild
		.member(msg.author)
		.roles.add(role)
		.catch((err) => console.log(err));
	guild.member(msg.author).roles.add(teamRole);
	// console.log(msg.author.id, msg.author.username);

	// Update Database

	const team = new Team({
		id: teamRole.id,
		name: teamRole.name,
		owner: {
			id: msg.author.id,
			username: msg.author.username,
		},
		vcid: vc.id,
		tcid: tc.id,
	});
	const createdTeam = await team.save();
	// console.log(createdTeam);

	msg.reply('Team Created :sparkles:');
	return Promise.resolve({ msg: 'Success!' });
}

export default addTeam;
