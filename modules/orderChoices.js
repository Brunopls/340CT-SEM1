import sqlite from 'sqlite-async'

class OrderChoices {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql =
            'CREATE TABLE IF NOT EXISTS orderChoices\
                (choiceID INTEGER PRIMARY KEY AUTOINCREMENT, \
                    mainDishID INTEGER, \
                    orderID INTEGER, \
                    quantity INTEGER, \
                    price REAL, \
                    ingredientsCost REAL, \
                    CONSTRAINT fk_mainDish \
                    FOREIGN KEY (mainDishID) \
                    REFERENCES mainDishes(mainDishID)\
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
		const sql = `SELECT * FROM orderChoices WHERE orderID = ${id};`
		const data = await this.db.all(sql)
		if(data !== undefined) return data
		else throw new Error('No matching id')
	}

	/**
	 * adds a new choice to the 'orderChoices' table.
	 * @param {Object} body the object to be inserted into the database.
	 * @returns {Object} returns new Orders object.
	 */
	async addMainDishChoice(body) {
		const sql = `INSERT INTO orderChoices (mainDishID, orderID, quantity, price, ingredientsCost)\
					 VALUES(${body.mainDishID}, ${body.orderID}, ${body.quantity}, ${body.price}, ${body.ingredientsCost});`
					 console.log(sql)
		await this.db.run(sql)
		return true
	}
}

export { OrderChoices }
