// librairies import
const mariadb = require('mariadb');
const config = require('..\\json\\config.json')
const discord = require("discord.js")
const lang = require("..\\json\\lang.json")

module.exports = {
	link, updateRankRole, linktest
}

// create the pool
const pool = mariadb.createPool({
    host: config.db_host, 
    user: config.db_user, 
    password: config.db_password,
    database: config.db_database,
    port: config.db_port,
    oConnectionLimit: 1
});


/**
 * Function to get the Discord IDs already in the Attempt_links and Players database
 * 
 * @returns {Array} aUsersList
 */
function get_users_in_db(){
	var aUsersList = [];
	pool.getConnection()
		.then(oConn => {
			oConn.query('SELECT discord FROM attempt_links')
				.then(rows => {
					for (let row in rows.slice(0)){
						aUsersList.push(rows[row]['discord'])
					}
				})
			oConn.query('SELECT discord FROM players')
				.then(rows => {
					for (let row in rows.slice(0)){
						aUsersList.push(rows[row]['discord'])
					}
				})
		})
	return aUsersList;
}


async function getDsIdInDbALinks(){
	let aDsIdInDb = []
	let oConn 
	try {
		oConn = await pool.getConnection();
		let aRows = await oConn.query('SELECT discord FROM attempt_links')
		for (let sRow in aRows.slice(0)){ // à changer !
			aDsIdInDb.push(aRows[sRow]['discord'])
		}
	}catch(err){
		throw err
	}finally{
		if (oConn) oConn.end();
	}
	console.log(aDsIdInDb)
	return aDsIdInDb
}
async function getDsIdInDbPlayers(){
	let aDsIdInDb = []
	let oConn = await pool.getConnection();
	let aRows = await oConn.query('SELECT discord FROM players')
	for (let sRow in aRows.slice(0)){
		aDsIdInDb.push(aRows[sRow]['discord'])
	}
	return aDsIdInDb
}


async function linktest(sDiscordId) {
	let oConn;
	let aRows;
	try {
		oConn = await pool.getConnection();

		var aDiscordIdInALinks = []
		aRows = await oConn.query('SELECT discord FROM attempt_links')
		for (let sRow in aRows.slice(0)){
			aDiscordIdInALinks.push(aRows[sRow]['discord'])
		}

		var aDiscordIdInPlayers = []
		aRows = await oConn.query('SELECT discord FROM players')
		for (let sRow in aRows.slice(0)){
			aDiscordIdInPlayers.push(aRows[sRow]['discord'])
		}

		if (!(aDiscordIdInPlayers.includes(sDiscordId))){
			if(aDiscordIdInALinks.includes(sDiscordId)){
				aRows = await oConn.query(`SELECT code FROM attempt_links WHERE discord=${sDiscordId}`)
				return aRows[0]["code"];
			}else{
				let lCodeAlreadyUsed = await oConn.query(`SELECT code FROM attempt_links`)
				lCodeAlreadyUsed = lCodeAlreadyUsed.filter(dic => dic["code"]).map(dic => dic["code"])
				console.log("lCodeAlreadyUsed , ",lCodeAlreadyUsed)

				let sCode = String(Math.floor(Math.random()*10000000000))
				while(sCode.length < 10 || lCodeAlreadyUsed.includes(sCode)){
					sCode = String(Math.floor(Math.random()*10000000000))
				}
				console.log(sCode, typeof(sCode))

				await oConn.query(`INSERT INTO attempt_links VALUES ('${sCode}', '${sDiscordId}')`)
				

				return sCode;
			}
		}else{
			return ;
		}


	} catch (err) {
		throw err;
	} finally {
		//return bRes;
	}
}



async function link(sDiscordId){
	
	let sCode2 = await pool.getConnection().then(oConn => {
		return oConn.query(`SELECT code FROM attempt_links`).then(lCodeAlreadyUsed => {
			lCodeAlreadyUsed = lCodeAlreadyUsed.filter(dic => dic["code"]).map(dic => dic["code"])
			let sCode = String(Math.floor(Math.random()*10000000000))
			while(sCode.length < 10 || lCodeAlreadyUsed.includes(sCode)){
				sCode = String(Math.floor(Math.random()*10000000000))
			}
			console.log(sCode, typeof(sCode))

			oConn.query(`INSERT INTO attempt_links VALUES ('${sCode}', '${sDiscordId}')`)

			return sCode
		})		
	})
	console.log(sCode2)
	return sCode2
}



async function updateRankRole(guild){
	console.log("Launching of updateRankRole")
	pool.getConnection().then(oConn => async function(){

		dRolesInConfig = {}

		for (role in config.roles){
			dRolesInConfig[role] = guild.roles.cache.find(r => String(r.id) == config.roles[role])
		}
		
		let lDicordInPlayersDB = []
		await oConn.query("SELECT discord FROM players").then(result => {lDicordInPlayersDB=result.map(r => r["discord"])}) // ça c la bonne solution

		let lDiscordInALinksDB = []
		await oConn.query("SELECT discord FROM attempt_links").then(result => {lDiscordInALinksDB=result.map(r => r["discord"])})



		let members = guild.members.cache
		console.log( typeof(members))
		members.forEach(element => {
			if (lDicordInPlayersDB.includes(String(element.user.id))){
				// On enleve le role visiteur si il l'a.
				if (element._roles.includes(config.visitor_role)){
					element.roles.remove(guild.roles.cache.find(role => String(role.id) === config.visitor_role))
				}

				// On recupère le rôle dans la base de donnée
				oConn.query(`SELECT global_rank FROM players WHERE discord='${String(element.user.id)}'`).then(result => {
					// On récupère le rang du rôle par rapport à l'ordre prédéfinit
					let rankIndex = config.role_order.indexOf(result.map(r => r["global_rank"])[0])
					
					// Grâce au rang on sépare les rôles à donner et ceux à retirer
					role_id_to_give = config.role_order.slice(0, rankIndex+1).map(value => config.roles[value])
					role_id_to_remove = config.role_order.slice(rankIndex+1).map(value => config.roles[value])

					role_id_to_give.forEach(roleid => {
						element.roles.add(guild.roles.cache.find(role => BigInt(role.id) === BigInt(roleid)))
					})

					role_id_to_remove.forEach(roleid => {
						element.roles.remove(guild.roles.cache.find(role => BigInt(role.id) === BigInt(roleid)))
					})

				})
			}else if (lDiscordInALinksDB.includes(String(element.user.id))){
				element.roles.add(guild.roles.cache.find(role => String(role.id) === config.visitor_role))
				role_id_to_remove = config.role_order.map(value => config.roles[value])
				role_id_to_remove.forEach(roleid => {
					element.roles.remove(guild.roles.cache.find(role => BigInt(role.id) === BigInt(roleid)))
				})

			}else{
				link(element.user.id).then(r => {
					console.log(r)
					element.user.send(lang.link_link_code+"\n**"+r+"**").catch(console.error)
				})
			}
		});

	}())
}




//link('42351087804284929').then(res => {console.log("Res : ", res)})

/*
getDsIdInDbALinks()
  .then(aDsIdInDb => {
	  console.log(aDsIdInDb)
  })*/
//console.log(getDsIdInDbPlayers())
