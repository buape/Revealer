import { ApplicationCommandType, Command, Embed, MessageReferenceType, type CommandInteraction } from "@buape/carbon"

export default class PingCommand extends Command {
	name = "Reveal Forwarding Details"
	description = ""
	type = ApplicationCommandType.Message
	defer = true

	async run(interaction: CommandInteraction) {
		if (interaction.rawData.data.type !== ApplicationCommandType.Message) return

		const commandResolved = interaction.rawData.data.resolved.messages[interaction.rawData.data.target_id]

		console.log(commandResolved)

		const msg = commandResolved.message_reference

		const msgData = commandResolved.message_snapshots?.[0]
		console.log(msg, msgData, interaction.rawData)

		if (msg?.type !== MessageReferenceType.Forward) return interaction.reply({ content: "This is not a forwarded message" })
		if (!msgData) return interaction.reply({ content: "This is not a forwarded message" })

		const date = new Date(msgData.message.timestamp)
		const editedData = msgData.message.edited_timestamp ? new Date(msgData.message.edited_timestamp) : null


		const embed = new DataEmbed({
			guild_id: msg.guild_id,
			channel_id: msg.channel_id,
			date,
			edited_timestamp: editedData
		})
		return interaction.reply({ embeds: [embed] })
	}
}

class DataEmbed extends Embed {


	constructor(data: {
		guild_id?: string
		channel_id: string
		date: Date,
		edited_timestamp: Date | null
	}) {
		super({
			title: "Forwarded Message",
			footer: {
				text: "Revealer: uncovering all the details Discord doesn't show you!"
			},
			color: 0x6A8C5B
		})
		this.fields = []

		if (data.guild_id) {
			this.fields.push({ name: "Guild", value: `[The guild's ID is ${data.guild_id}. Click here to see if more details are public.](https://discordlookup.com/guild/${data.guild_id})` })
			this.fields.push({
				name: "Channel",
				value: `<#${data.channel_id}> (${data.channel_id})`
			})
		} else {
			this.fields.push({ name: "Channel", value: `DMs (DM channel ID is ${data.channel_id})` })
		}

		this.fields.push({
			name: "Timestamp",
			value: `<t:${Math.floor(new Date(data.date).getTime() / 1000)}:R> (${data.date.toUTCString()} )`
		})

		if (data.edited_timestamp) {
			this.fields.push({
				name: "Edited Timestamp",
				value: `<t:${Math.floor(new Date(data.edited_timestamp).getTime() / 1000)}:R> (${data.edited_timestamp})`
			})
		} else {
			this.fields.push({ name: "Edited Timestamp", value: "This message was not edited" })
		}
	}
}

/*

	"messageReference": {
		"type": 1,
		"channel_id": "1190839431771459756",
		"message_id": "1291793993268723813",
		"guild_id": "1080982186045493338"
	},
	"messageSnapshots": [
		{
			"message": {
				"type": 0,
				"content": "test",
				"attachments": [],
				"embeds": [],
				"timestamp": "2024-10-04T16:08:08.367Z",
				"editedTimestamp": null,
				"flags": 0,
				"components": [],
				"codedLinks": [],
				"stickers": [],
				"stickerItems": []
			}
		}
	],


*/