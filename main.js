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

const linkModule = require("./modules/link.js")

const help_embeds = [];

// load command files
client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log(command)
    if (config.persmissions[command.name]){
        client.commands.set(command.name, command);
    }
}
console.log(client.commands)
console.log(client.commands.length + " commands loaded.")

// Client events
client.on("ready", () =>{
    console.log("Client ready !")
    console.log(config.guild_id)
    guild = client.guilds.cache.get(config.guild_id)
    console.log("Guild found : " + guild.name)

   linkModule.updateRankRole(guild)


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


client.on('messageCreate', msg => {
    if (!msg.content.startsWith(config.prefix) || msg.author.bot)
        return;

    const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.find(cmd => cmd.name === command)

    if (cmd !== undefined){
        let roles = msg.member.roles.cache.map(role => role.id)

        bHasPerm = function(){
            if(config.persmissions[command].length == 0) return true;
            const filteredArray = roles.filter(role => config.persmissions[command].includes(role));
            if(filteredArray.length>0)return true; else return false;
        }
        
        if(bHasPerm()){
            console.log(`[discord][cmd_dispatcher] ${msg.author.username}[${msg.author}] invoked {${cmd.name} | ${cmd.description}}`); 
            cmd.execute(client, msg, args)
        }
    }
    setInterval(linkModule.updateRankRole)

    /*
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
          
            case "unlink":*/


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
            /*
            default:
                break;
        }
    }*/
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