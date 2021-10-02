// For a next version:
client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
    if (interaction.isButton()){
        if (interaction.message.embeds[0].title == "Help" ){
            let help_page = parseInt(interaction.customId)

            if (help_embeds.length > help_page){
                let new_row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setStyle('PRIMARY')
                        .setEmoji('⏮️')
                        .setCustomId(String(help_page-1))
                    )
                .addComponents(
                    new Discord.MessageButton()
                        .setEmoji('⏭️')
                        .setStyle('PRIMARY')
                        .setCustomId(String(help_page+1))
                    );

                if (help_page > 0){
                    new_row.components[0].setDisabled(false)
                }else{
                    new_row.components[0].setDisabled(true)
                }

                if (help_page < (help_embeds.length - 1)){
                    new_row.components[1].setDisabled(false)
                }else{
                    new_row.components[1].setDisabled(true)
                }
                
                interaction.message.edit({embeds:[help_embeds[help_page]], components: [new_row]})
            }
        }

    }

    console.log(interaction.customId);
	console.log(interaction.message);
    interaction.deferUpdate();

    client.api.applications(client.user.id).guilds('858963788563742750').commands.post({data: {
        name: 'ping',
        description: 'ping pong!'
    }});
});