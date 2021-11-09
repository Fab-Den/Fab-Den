client.on('message', function(msg) {

    if (!msg.content.startsWith(prefix) || msg.author.bot || !Object.values(channels).includes(""+msg.channel.id))
        return;
  
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    if (!msg.member.roles.cache.get(permissions.admin) && !permissions.bypass.includes(command))
        return;
  



        
    // aucune idée de pourquoi j'ai fait un truc compliqué qui passe par des Promise alors que ça sert à rien
    // def getCmd qui va chercher la commande (command) ds les registered cmds (client.commands)
    const getCmd = function(client, command) {
        const cmd = client.commands.find(cmd => cmd.name === command)
        if (cmd !== undefined)
        return cmd;
        else
        return null;
    };
    

    if (getCmd!=null){

    }

    // on execute la promise crée au dessus
    getCmd(client, command).then(
      // success
      (cmd) => {
        console.log(`[discord][cmd_dispatcher] ${msg.author.username}[${msg.author}] invoked {${cmd.name} | ${cmd.description}}`); 
        cmd.execute(client, msg, args)
      },
  
      // failure
      (res) => {
        console.error(res.err);
        console.log(res.map);
      }
    );
  });