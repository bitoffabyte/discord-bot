import Discord from 'discord.js';
import Team from '../models/Team.js';
export default async function deleteTeam(msg, args, client) {
	if (args.length > 4) {
		msg.reply(
			'Please write *delete <team_name> @member1 @member2 @member3  (make sure you mention all the members)'
		);
		return;
	}
	let rolex = msg.guild.roles.cache.find((r) => r.name === 'inTeam');

	const teamName = args[0];
	args.shift();
	const beep = args.join(' ');
	var guild = msg.guild;
	try {
		const team = await Team.find({ name: teamName });
		if (team.length === 0) {
			msg.reply(
				'Team does not exist, make sure you provide the correct team name'
			);
			return;
		}
		let full = false;
		let isOwner = false;
		let members = [];
		let roleID = null;
		let delTeam = null;
		for (let iteration = 0; iteration < team.length; iteration++) {
			if (team[iteration].owner.id === msg.author.id) {
				roleID = team[iteration].id;
				isOwner = true;
				if (team[iteration].members.length >= 3) {
					full = true;
				}
				members = team[iteration].members;
				delTeam = team[iteration];
				console.log(args);

				let f = false;
				members.map((i) => {
					if (!beep.includes(i.id)) {
						msg.reply(
							'Make sure you only tag members of your own team! and all the members at once!'
						);
						f = true;
					}
				});
				if (f) {
					return;
				}
				if (args.length !== team[iteration].members.length) {
					msg.reply(
						'Make sure you tag every member of your team!\neveryone except the owner'
					);
					return;
				}

				break;
			}
		}

		if (!isOwner) {
			msg.reply('Sorry you are not the owner of the team ');
			return;
		}
		// console.log(roleID);
		msg.guild.roles.cache.find((r) => r.id === roleID).delete();
		const vcid = delTeam.vcid;
		const tcid = delTeam.tcid;

		await Team.deleteOne(delTeam);
		msg.guild.channels.cache
			.get(vcid)
			.delete()
			.catch((er) => console.log(er));
		msg.guild.channels.cache
			.get(tcid)
			.delete()
			.catch((er) => console.log(er));

		guild.members.cache.get(msg.author.id).roles.remove(rolex);
		if (args.length === 1) {
			msg.mentions.members.array()[0].roles.remove(rolex);
		}
		if (args.length === 2) {
			msg.mentions.members.array()[1].roles.remove(rolex);
			msg.mentions.members.array()[0].roles.remove(rolex);
		}
		if (args.length === 3) {
			msg.mentions.members.array()[0].roles.remove(rolex);
			msg.mentions.members.array()[1].roles.remove(rolex);
			msg.mentions.members.array()[2].roles.remove(rolex);
		}
		msg.reply('Team Deleted!');
	} catch (err) {
		console.log(err);
	}
}
// .delete <team_name>
