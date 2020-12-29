import sqlite from 'sqlite-async'

/**
 *
 *
 * @class models/StatusCodes
 */
class StatusCodes {
	/**
	 * Creates an instance of StatusCodes.
	 * @param {string} [dbName=':memory:']
	 * @function
	 * @memberof models/StatusCodes
	 */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql =
            'CREATE TABLE IF NOT EXISTS statusCodes\
                (id INTEGER PRIMARY KEY AUTOINCREMENT, \
                    name TEXT \
                    );'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * gets all records in the 'roles' table.
	 * @returns {Object} returns object if records exist in table.
	 * @memberof models/StatusCodes
	 */
	async getStatusCodes() {
		const sql = 'SELECT * FROM statusCodes;'
		const data = await this.db.all(sql)
		if(data !== undefined && data.length > 0) return data
		else throw new Error('No records found in \'statusCodes\'.\'')
	}

	/**
	 * gets a single record from the 'statusCodes' table with matching status code ID.
	 * @param {Integer} id the status code ID.
	 * @returns {Object} returns object if records exist in table.
	 * @memberof models/StatusCodes
	 */
	async getStatusCode(id) {
		const sql = `SELECT * FROM statusCodes WHERE id = ${id};`
		const data = await this.db.get(sql)
		if(data !== undefined) return data
		else throw new Error('No matching id')
	}

	/**
	 * gets a single record from the 'statusCodes' table with matching status name.
	 * @param {String} name role ID.
	 * @returns {Object} returns object if records exist in table.
	 * @memberof models/StatusCodes
	 */
	async getStatusCodeByName(name) {
		const sql = `SELECT * FROM statusCodes WHERE name LIKE '%${name}%';`
		const data = await this.db.get(sql)
		if(data !== undefined) return data
		else throw new Error('No matching id')
	}

	/**
	 * gets a single record from the 'statusCodes' table with matching status name.
	 * @param {String} name role ID.
	 * @returns {Object} returns object if records exist in table.
	 * @memberof models/StatusCodes
	 */
	async addStatusCode(name) {
		try {
			if(typeof name !== 'string') throw new Error('wrong data type!')
			const sql = `INSERT INTO statusCodes (name) VALUES ('${name}');`
			await this.db.run(sql)
			return true
		} catch (err) {
			return false
		}
	}

	/**
	 * closes the connection to SQLite database
	 * @memberof models/StatusCodes
	 */
	async close() {
		await this.db.close()
	}
}

export { StatusCodes }
