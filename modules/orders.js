import sqlite from 'sqlite-async'

/**
 *
 *
 * @class models/Orders
 */
class Orders {
	/**
	 * Creates an instance of Orders.
	 * @param {string} [dbName=':memory:']
	 * @function
	 * @memberof models/Orders
	 */
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
                    REFERENCES statusCodes(id)\
                    );'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * gets all records in the 'orders' table.
	 * @returns {Object} returns object if records exist in table.
	 * @memberof models/Orders
	 */
	async getOrders(id = null) {
		let sql = 'SELECT * FROM orders WHERE statusCode!=3'
		if(id) sql += ` AND statusCode=${id}`
		const data = await this.db.all(sql)
		if(data !== undefined && data.length > 0) return data
		else throw new Error('No records found in \'orders\'.\'')
	}

	/**
	 * gets a single record from the 'orders' table with matching order ID.
	 * @param {Integer} the order ID.
	 * @returns {Object} returns object if records exist in table.
	 * @memberof models/Orders
	 */
	async getOrder(id) {
		const sql = `SELECT * FROM orders WHERE orderID = ${id};`
		const data = await this.db.get(sql)
		if(data !== undefined) return data
		else throw new Error('No matching id')
	}

	/**
	 * adds a new order to the 'orders' table.
	 * @param {Object} body the object to be inserted into the database.
	 * @returns {Object} returns new Orders object.
	 * @memberof models/Orders
	 */
	async addOrder(body) {
		try{
			const sql =
			`INSERT INTO orders (tableNumber, numDiners, statusCode, time, totalPrice, totalIngredientsCost)\
					 VALUES(${body.tableNumber},
							${body.numDiners}, 
							${body.statusCode}, 
						   '${body.time}', 
							${body.totalPrice}, 
							${body.totalIngredientsCost});`
			await this.db.run(sql)
			return true
		} catch(err) {
			return false
		}
	}

	/**
	 * deletes an order from the 'orders' table.
	 * @param {Integer} id the ID of object to be deleted from the database.
	 * @return {Boolean} true if order is deleted
	 * @memberof models/Orders
	 */
	async deleteOrder(id) {
		try{
			if(id === undefined) throw new Error
			const sql = `DELETE FROM orders WHERE orderID=${id};`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw new Error('No matching id')
		}
	}

	/**
	 * updates an order in the 'orders' table.
	 * @param {Integer} id the ID of the object to be updated.
	 * @returns {Object} returns new Orders object.
	 * @memberof models/Orders
	 */
	async updateStatus(id, statusCode) {
		const sql = `UPDATE orders SET statusCode = ${statusCode} WHERE orderID = ${id};`
		await this.db.run(sql)
		return true
	}

	/**
	 * closes the connection to SQLite database
	 * @memberof models/Orders
	 */
	async close() {
		await this.db.close()
	}
}

export { Orders }
