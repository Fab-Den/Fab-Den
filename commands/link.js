//
//import("../modules/link.js")
const linkModule = require("..\\modules\\link.js")
const lang = require("..\\json\\lang.json")
module.exports = {
    name: 'link',
    description: '',
    usage: '',

    async execute(client, msg, args) {
        
        sLinkReturn = await linkModule.linktest(String(msg.author.id))

        if(sLinkReturn){
            try{
                await msg.author.send(lang.link_link_code+"\n**"+sLinkReturn+"**")
            }catch(err){
                console.log("[discord][cmd_link][error]", err)
            }
        }else{
            try{
                await msg.author.send(lang.link_already_linked)
            }catch(err){
                console.log("[discord][cmd_link][error]", err)
            }
        }
    }
}