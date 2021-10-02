/*
name: main.js
version: 1.0
author: Denoyelle Fabien

description:

*/

// Librairies import
const mariadb = require('mariadb')
const Discord = require('discord.js')
const fs = require('fs');

const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_INTEGRATIONS', 'GUILD_WEBHOOKS']});

const config = require('./json/config.json');
const lang = require('./json/lang.json');
const help = require('./json/help.json')



const help_embeds = [];

// load command files
client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

console.log(client.commands.length + " commands loaded.")

// Client events
client.on("ready", () =>{
    console.log("Client ready !")
    console.log(config.guild_id)
    guild = client.guilds.cache.get(config.guild_id)
    console.log("Guild found : " + guild.name)

    // ----- generate help embeds ----- (for a next version)
    /*
    for (let i=0; i <  Math.ceil(help.commands.length/5); i++){
        
        let fields_list = []
        for (let j=i*5; j<i*5+5; j++){
            if (help.commands[j]){
            fields_list.push(
                {
                "name": "**" + help.commands[j].command + "**",
                "value": "__Description:__ " + help.commands[j].description + "\n" + "__Access:__ " + help.commands[j].access
                }
            )
            }
        }
        let embed = new Discord.MessageEmbed()
            .setTitle('Help')
            .setColor('#4274FF')    
            .setThumbnail('https://i.imgur.com/YGWYwBa.png')
            .setFields(fields_list);

        help_embeds.push(embed)
    }
    */
   
    // --To do:
    // update rank role
    // update nickname
    // check new members, link if they are not

    // setinterval

})


client.on('messageCreate', message => {
    let msg = message.content;
    console.log(msg);
    if (msg[0] == config.prefix && msg.length>1){
        splitted_msg = msg.slice(1).split(' ')
        let command=splitted_msg[0]
        if (splitted_msg.length > 1){
            let parameters = splitted_msg.slice(1);
        }else{
            let parameters = null;
        }

        switch (command) {
          
            case "test2":
                channel = guild.channels.cache.get('859045321610100746');
                console.log(help_embeds)
                channel.send({embeds: [help_embeds[0]]})
                break;

            // For a next version, coupled with the "on interationCreate"
            /*
            case "help":
                channel = message.channel;

                let help_row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setStyle('PRIMARY')
                        .setEmoji('⏮️')
                        .setCustomId("-1")
                        .setDisabled(true)
                    )
                .addComponents(
                    new Discord.MessageButton()
                        .setEmoji('⏭️')
                        .setStyle('PRIMARY')
                        .setCustomId("1")
                    );
                
                if (help_embeds.length > 1){
                    help_row.components[1].setDisabled(false)
                }else{
                    help_row.components[1].setDisabled(true)
                }
                
                channel.send({embeds: [help_embeds[0]], components: [help_row]})
                
                break;
            */

            default:
                break;
        }
    }
})




//require('./utils/handler')(client);
//module.exports = {client: client, config: config}

//setInterval(function(){console.warn("hi");}, 1000)
client.login(config.token);

/*
const pool = mariadb.createPool(
    {
        host: config.mariadb_host,
        user: config.mariadb_user,
        database: config.mariadb_database,
        port: config.mariadb_port,
        password: config.mariadb_password,
    }
);
pool.getConnection()
    .then(conn => {
        conn.query("SELECT name FROM players")
            .then((rows) => {console.log(rows)})
            .catch(err =>{
                console.log(err)
            })
    .catch(err =>{
        console.log(err)
    })
     
        
    }).catch(err => {
      console.log(err)
    });

*/

//pool.getConnection()
//    .then(conn => {
//        //setInterval(console.log(conn.query("SELECT * FROM players;")),10000)
//        console.log(rows);
//    })