import sqlite from 'sqlite-async'

class OrderChoicesSides {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql =
            'CREATE TABLE IF NOT EXISTS orderChoicesSides\
                (sideChoiceID INTEGER PRIMARY KEY AUTOINCREMENT, \
                    choiceID INTEGER, \
                    sideDishID INTEGER, \
                    quantity INTEGER, \
                    price REAL, \
                    ingredientsCost REAL, \
                    CONSTRAINT fk_sideDish \
                    FOREIGN KEY (sideDishID) \
                    REFERENCES sideDishes(sideDishID)\
                    CONSTRAINT fk_choiceID \
                    FOREIGN KEY (choiceID) \
                    REFERENCES orderChoices(choiceID)\
                    );'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * gets all the choices for a single order.
	 * @param {Integer} id order ID.
	 * @returns {Object} returns object if records exist in table.
	 */
	async getOrderChoiceSides(id) {
		const sql = `SELECT * FROM orderChoicesSides WHERE orderID = ${id};`
		const data = await this.db.all(sql)
		if(data !== undefined) return data
		else throw new Error('No matching id')
	}

	/**
	 * adds a new choice to the 'orderChoicesSides' table.
	 * @param {Object} body the object to be inserted into the database.
	 * @returns {Object} returns new Orders object.
	 */
	async addSideDishChoice(body) {
		const sql = `INSERT INTO orderChoicesSides (choiceID, sideDishID, quantity, price, ingredientsCost)\
					 VALUES(${body.choiceID}, ${body.sideDishID}, ${body.quantity}, '${body.price}', ${body.ingredientsCost});`
		await this.db.run(sql)
		return true
	}
}

export { OrderChoicesSides }
