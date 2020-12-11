import sqlite from 'sqlite-async'

class Orders {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql =
            'CREATE TABLE IF NOT EXISTS orders\
                (orderID INTEGER PRIMARY KEY AUTOINCREMENT, \
                    tableNumber INTEGER, \
                    numDiners INTEGER, \
                    statusCode INTEGER, \
                    time DATE, \
                    totalPrice REAL, \
                    totalIngredientsCost REAL, \
                    CONSTRAINT fk_statusCode \
                    FOREIGN KEY (statusCode) \
                    REERENCES statusCodes(id)\
                    );'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * gets all records in the 'roles' table.
	 * @returns {Object} returns object if records exist in table.
	 */
	async getOrders() {
		const sql = 'SELECT * FROM orders;'
		const data = await this.db.all(sql)
		if(data !== undefined) return data
		else throw new Error('No records found in \'orders\'.\'')
	}

	/**
	 * gets a single record from the 'roles' table with matching role ID.
	 * @param {Integer} the role ID.
	 * @returns {Object} returns object if records exist in table.
	 */
	async getOrder(id) {
		const sql = `SELECT * FROM orders WHERE id = ${id};`
		const data = await this.db.get(sql)
		if(data !== undefined) return data
		else throw new Error('No matching id')
	}

	async close() {
		await this.db.close()
	}
}

export { Orders }
