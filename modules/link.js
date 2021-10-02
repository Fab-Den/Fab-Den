// librairies import
const mariadb = require('mariadb');
const config = require('..\\json\\config.json')

// create the pool
const pool = mariadb.createPool({
    host: config.db_host, 
    user: config.db_user, 
    password: config.db_password,
    database: config.db_database,
    port: config.db_port,
    oConnectionLimit: 1
});

/*
pool.getoConnection()
.then(oConn => {
	oConn.query("INSERT INTO attempt_links VALUES (1,2)")
})
*/


/**
 * Function to get the Discord IDs already in the Attempt_links and Players database
 * 
 * @returns {Array} aUsersList
 */
function get_users_in_db(){
	var aUsersList = [];
	pool.getoConnection()
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
		for (let sRow in aRows.slice(0)){
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


async function link(sDiscordId) {
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
			console.log(typeof(sRow))
			aDiscordIdInPlayers.push(aRows[sRow]['discord'])
		}


		if (!(aDiscordIdInPlayers.includes(sDiscordId))){
			
		}
	} catch (err) {
	  throw err;
	} finally {
	  if (oConn) return oConn.end();
	}
  }



//link('423510878042849291')

getDsIdInDbALinks()
  .then(aDsIdInDb => {
	  console.log(aDsIdInDb)
  })
//console.log(getDsIdInDbPlayers())
