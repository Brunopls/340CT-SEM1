import sqlite from 'sqlite-async'

class MainDishes {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql =
            'CREATE TABLE IF NOT EXISTS mainDishes\
                (mainDishID INTEGER PRIMARY KEY AUTOINCREMENT, \
                    name TEXT, \
                    photo TEXT, \
                    price REAL, \
                    ingredientsCost REAL, \
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
}

export { MainDishes }
