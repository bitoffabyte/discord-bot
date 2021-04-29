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
		msg.reply('Please add members one-by-one');
		return;
	}

	let isOwner = false;
	let roleID = null;

	// Check if user is already in a team

	if (!msg.member.roles.cache.some((role) => role.name === 'inTeam')) {
		msg.reply('You are not in any team');
		return;
	}

	const teamName = args[0];
	const team = await Team.find({ name: teamName });
	console.log(team);
	if (team.length === 0) {
		msg.reply('Team does not exist');
		return;
	}
	let full = false;
	for (let iteration = 0; iteration < team.length; iteration++) {
		// console.log('asdasdas');
		console.log(team[iteration].owner.id);
		if (team[iteration].owner.id === msg.author.id) {
			roleID = team[iteration].id;
			console.log(team[iteration].owner.id === msg.author.id);
			isOwner = true;
			if (team[iteration].members.length >= 3) {
				full = true;
			}
			break;
		}
	}
	if (full) {
		msg.reply('Team Full');
	}

	if (!isOwner) {
		msg.reply('Sorry you are not the owner of the team ');
		return;
	}
	if (
		msg.mentions.members
			.first()
			.roles.cache.some((role) => role.name === 'inTeam')
	) {
		msg.reply(`${msg.mentions.members.first()} is already in a team!`);
		return;
	}
	msg.channel
		.send(
			`Hi ${msg.mentions.members.first()}, You have been invited to team ${teamName} by ${
				msg.author
			} react with 👍 to join `
		)
		.then((i) => {
			i.awaitReactions(
				(reaction, user) =>
					user.id == msg.mentions.members.first().id &&
					reaction.emoji.name == '👍',
				{ max: 1, time: 60000 }
			)
				.then((collected) => {
					if (collected.first().emoji.name == '👍') {
						const role = msg.guild.roles.cache.find(
							(role) => role.id === roleID
						);
						let rolee = msg.guild.roles.cache.find(
							(r) => r.name === 'inTeam'
						);

						const b = msg.mentions.members.first();
						msg.guild.member(b).roles.add(role);

						msg.guild.member(b).roles.add(rolee);
						console.log('after adding');
						Team.findOneAndUpdate(
							{ id: roleID },
							{
								$push: {
									members: { id: b.id },
								},
							}
						).catch((err) => console.log(err));
						console.log(b.id, i.username);
						i.reply('OK...');
					}
				})
				.catch(() => {
					i.channel.send(
						`No reaction after 60 seconds, Invite cancelled! ${msg.mentions.members.first()} `
					);
				});
		})
		.catch((err) => console.log(err));
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
// 	msg.reply('Could not find team. :cry:');
// 	return;
// }
// msg.guild.member(msg.author).roles.add(myRole.id);
