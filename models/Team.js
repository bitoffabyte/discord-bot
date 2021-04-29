import mongoose from 'mongoose';

const TeamSchema = mongoose.Schema({
	id: {
		type: String,
	},
	name: {
		type: String,
	},
	vcid: {
		type: String,
	},
	tcid: {
		type: String,
	},
	owner: {
		username: { type: String, required: true },
		id: { type: String, required: true },
	},
	members: [
		{
			username: { type: String },
			id: { type: String },
		},
	],
});
const Team = mongoose.model('Team', TeamSchema);

export default Team;
