import Discord from 'discord.js';
import prettyFormat from 'pretty-format';
const newPermMember = Discord.Permissions.DEFAULT;
const newPermNonMember = Discord.Permissions.ALL;
import Team from '../models/Team.js';

export default async function joinTeam(msg, args, client) {
	if (args.length < 2) {
		return;
	}

	if (args.length > 2) {
		msg.channel.send('Please add members one-by-one');
		return;
	}

	let isOwner = false;
	let roleID = null;

	// Check if user is already in a team

	if (!msg.member.roles.cache.some((role) => role.name === 'inTeam')) {
		msg.channel.send('You are not a team owner!');
		return;
	}

	const teamName = args[0];
	const team = await Team.find({ name: teamName });
	console.log(team);
	if (team.length === 0) {
		msg.channel.send('Team does not exist');
		return;
	}

	for (let iteration = 0; iteration < team.length; iteration++) {
		// console.log('asdasdas');
		console.log(team[iteration].owner.id);
		if (team[iteration].owner.id === msg.author.id) {
			roleID = team[iteration].id;
			isOwner = true;
			break;
		}
	}

	if (!isOwner) {
		msg.channel.send('Sorry you are not the owner of the team ');
		return;
	}
	if (
		msg.mentions.members
			.first()
			.roles.cache.some((role) => role.name === 'inTeam')
	) {
		msg.channel.send(
			`${msg.mentions.members.first()} is already in a team!`
		);
		return;
	}
	msg.mentions.members.first().send('Hi there');
}
// client.on('messageReactionAdd', (reaction, user) => {
// 	console.log(prettyFormat(user));
// });
// var joinRole = args.join(' ');
// console.log(joinRole);
// let role = msg.guild.roles;
// const myRole = msg.guild.roles.cache.find((r) => r.name === joinRole);

// if (!myRole) {
// 	console.log(myRole);
// 	msg.channel.send('Could not find team. :cry:');
// 	return;
// }
// msg.guild.member(msg.author).roles.add(myRole.id);
