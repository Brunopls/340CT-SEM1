import sqlite from 'sqlite-async'

class MainDishes {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql =
            'CREATE TABLE IF NOT EXISTS mainDishes\
                (mainDishID INTEGER PRIMARY KEY AUTOINCREMENT, \
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
	async getMainDishes() {
		const sql = 'SELECT * FROM mainDishes;'
		const data = await this.db.all(sql)
		if(data !== undefined) return data
		else throw new Error('No records found in \'mainDishes\'.\'')
	}

	/**
	 * gets a single record from the 'roles' table with matching role ID.
	 * @param {Integer} the role ID.
	 * @returns {Object} returns object if records exist in table.
	 */
	async getMainDish(id) {
		const sql = `SELECT * FROM mainDishes WHERE mainDishID = ${id};`
		const data = await this.db.get(sql)
		if(data !== undefined) return data
		else throw new Error('No matching id')
	}

	/**
	 * adds a new choice to the 'orderChoicesSides' table.
	 * @param {Object} body the object to be inserted into the database.
	 * @returns {Object} returns new Orders object.
	 */
	async addMainDish(body) {
		const sql = `INSERT INTO mainDishes (name, photo, price, ingredientsCost)
					 VALUES('${body.name}', '${body.photo}', ${body.price}, ${body.ingredientsCost});`
		await this.db.run(sql)
		return true
	}

	/**
	 * updates an order in the 'orders' table.
	 * @param {Integer} id the ID of the object to be updated.
	 * @returns {Object} returns new Orders object.
	 */
	async updateDish(id, body) {
		const sql = `UPDATE mainDishes SET 
						name = '${body.name}',
						photo = '${body.photo}',
						price = ${body.price},
						ingredientsCost = ${body.ingredientsCost} 
						WHERE mainDishID = ${id};`
		await this.db.run(sql)
		return true
	}

	async close() {
		await this.db.close()
	}
}

export { MainDishes }
