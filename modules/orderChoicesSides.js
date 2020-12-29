import sqlite from 'sqlite-async'

/**
 *
 *
 * @class models/OrderChoicesSides
 */
class OrderChoicesSides {
	/**
	 * Creates an instance of OrderChoicesSides.
	 * @param {string} [dbName=':memory:']
	 * @function
	 * @memberof models/OrderChoicesSides
	 */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql =
            'CREATE TABLE IF NOT EXISTS orderChoicesSides\
                (sideChoiceID INTEGER PRIMARY KEY AUTOINCREMENT, \
                    choiceID INTEGER, \
                    sideDishID INTEGER, \
                    quantity INTEGER, \
                    price REAL, \
                    ingredientsCost REAL, \
                    CONSTRAINT fk_sideDish FOREIGN KEY (sideDishID) \
                    REFERENCES sideDishes(sideDishID)\
                    CONSTRAINT fk_choiceID FOREIGN KEY (choiceID) \
                    REFERENCES orderChoices(choiceID));'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * gets all the choices for a single order.
	 * @param {Integer} id order ID.
	 * @returns {Object} returns object if records exist in table.
	 * @memberof models/OrderChoicesSides
	 */
	async getOrderChoiceSides(id) {
		const sql = `SELECT * FROM orderChoicesSides WHERE choiceID = ${id};`
		const data = await this.db.all(sql)
		if(data !== undefined) return data
		else throw new Error('No matching id')
	}

	/**
	 * adds a new choice to the 'orderChoicesSides' table.
	 * @param {Object} body the object to be inserted into the database.
	 * @returns {Object} returns new Orders object.
	 * @memberof models/OrderChoicesSides
	 */
	async addSideDishChoice(body) {
		try {
		const sql =
		`INSERT INTO orderChoicesSides (choiceID, sideDishID, quantity, price, ingredientsCost)\
					 VALUES(${body.choiceID},
							${body.sideDishID}, 
							${body.quantity}, 
						   '${body.price}', 
							${body.ingredientsCost});`
		await this.db.run(sql)
		return true} catch (err) {
			return false
		}
	}

	/**
	 * closes the connection to SQLite database
	 * @memberof models/OrderChoicesSides
	 */
	async close() {
		await this.db.close()
	}
}

export { OrderChoicesSides }
