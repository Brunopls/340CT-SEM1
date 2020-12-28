import sqlite from 'sqlite-async'

class SideDishes {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql =
            'CREATE TABLE IF NOT EXISTS sideDishes \
                (sideDishID INTEGER PRIMARY KEY AUTOINCREMENT, \
                    name TEXT, \
                    photo TEXT, \
                    price REAL, \
                    ingredientsCost REAL \
                    );'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * gets all records in the 'roles' table.
	 * @returns {Object} returns object if records exist in table.
	 */
	async getSideDishes() {
		const sql = 'SELECT * FROM sideDishes;'
		const data = await this.db.all(sql)
		if(data !== undefined) return data
		else throw new Error('No records found in \'sideDishes\'.\'')
	}

	/**
	 * gets a single record from the 'roles' table with matching role ID.
	 * @param {Integer} the role ID.
	 * @returns {Object} returns object if records exist in table.
	 */
	async getSideDish(id) {
		const sql = `SELECT * FROM sideDishes WHERE sideDishID = ${id};`
		const data = await this.db.get(sql)
		if(data !== undefined) return data
		else throw new Error('No matching id')
	}

	/**
	 * adds a new choice to the 'orderChoicesSides' table.
	 * @param {Object} body the object to be inserted into the database.
	 * @returns {Object} returns new Orders object.
	 */
	async addSideDish(body) {
		const sql = `INSERT INTO sideDishes (name, photo, price, ingredientsCost)
					 VALUES('${body.name}', '${body.photo}', ${body.price}, ${body.ingredientsCost});`
		await this.db.run(sql)
		return true
	}

	async close() {
		await this.db.close()
	}
}

export { SideDishes }
