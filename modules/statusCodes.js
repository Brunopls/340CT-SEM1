import sqlite from 'sqlite-async'

class StatusCodes {
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
	 */
	async getStatusCodes() {
		const sql = 'SELECT * FROM statusCodes;'
		const data = await this.db.all(sql)
		if(data !== undefined) return data
		else throw new Error('No records found in \'statusCodes\'.\'')
	}

	/**
	 * gets a single record from the 'statusCodes' table with matching status code ID.
	 * @param {Integer} id the status code ID.
	 * @returns {Object} returns object if records exist in table.
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
	 */
	async getStatusCodeByName(name) {
		const sql = `SELECT * FROM statusCodes WHERE name LIKE '%${name}%';`
		const data = await this.db.get(sql)
		if(data !== undefined) return data
		else throw new Error('No matching id')
	}

	async close() {
		await this.db.close()
	}
}

export { StatusCodes }
