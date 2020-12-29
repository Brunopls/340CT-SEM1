import sqlite from 'sqlite-async'

/**
 *
 *
 * @class models/Roles
 */
class Roles {
	/**
	 * Creates an instance of Roles.
	 * @param {string} [dbName=':memory:']
	 * @function
	 * @memberof models/Roles
	 */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS roles\
				(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * gets all records in the 'roles' table.
	 * @returns {Object} returns object if records exist in table.
	 * @memberof models/Roles
	 */
	async getRoles() {
		const sql = 'SELECT * FROM roles;'
		const data = await this.db.all(sql)
		if(data !== undefined && data.length > 0) return data
		else throw new Error('No records found in \'roles\'.\'')
	}

	/**
	 * gets a single record from the 'roles' table with matching role ID.
	 * @param {Integer} the role ID.
	 * @returns {Object} returns object if records exist in table.
	 * @memberof models/Roles
	 */
	async getRole(id) {
		const sql = `SELECT * FROM roles WHERE id = ${id};`
		const data = await this.db.get(sql)
		if(data !== undefined) return data
		else throw new Error('No matching id')
	}


	/**
	 * closes the connection to SQLite database
	 * @memberof models/Roles
	 */
	async close() {
		await this.db.close()
	}
}

export { Roles }
