import sqlite from 'sqlite-async'

class MainDishSides {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql =
            'CREATE TABLE IF NOT EXISTS mainDishSides\
                (combinationID INTEGER PRIMARY KEY AUTOINCREMENT, \
                    mainDishID INTEGER, \
                    sideDishID INTEGER, \
                    CONSTRAINT fk_mainDish \
                    FOREIGN KEY (mainDishID) \
                    REFERENCES mainDishes(mainDishID)\
                    CONSTRAINT fk_sideDish \
                    FOREIGN KEY (sideDishID) \
                    REFERENCES sideDishes(sideDishID)\
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
	async getOrderChoice(id) {
		const sql = `SELECT * FROM mainDishSides WHERE orderID = ${id};`
		const data = await this.db.all(sql)
		if(data !== undefined) return data
		else throw new Error('No matching id')
	}

	/**
	 * adds a new choice to the 'mainDishSides' table.
	 * @param {Object} body the object to be inserted into the database.
	 * @returns {Object} returns new Orders object.
	 */
	async addMainDishChoice(body) {
		const sql = `INSERT INTO mainDishSides (mainDishID, orderID, quantity, price, ingredientsCost)\
					 VALUES(${body.mainDishID}, ${body.orderID}, ${body.quantity}, '${body.price}', ${body.ingredientsCost});`
		await this.db.run(sql)
		return true
	}
}

export { MainDishSides }
