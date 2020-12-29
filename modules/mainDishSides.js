import sqlite from 'sqlite-async'

/**
 *
 *
 * @class models/MainDishSides
 */
class MainDishSides {
	/**
	 * Creates an instance of MainDishSides.
	 * @param {string} [dbName=':memory:']
	 * @function
	 * @memberof models/MainDishSides
	 */
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
	 * gets all sides for a given main dish
	 * @param {Integer} id main dish ID
	 * @returns {Object} returns object if records exist in table.
	 * @memberof models/MainDishSides
	 */
	async getMainDishSides(id) {
		const sql = `SELECT * FROM mainDishSides WHERE mainDishID = ${id};`
		const data = await this.db.all(sql)
		if(data !== undefined && data.length > 0) return data
		else throw new Error('No matching id')
	}

	/**
	 * adds a new choice to the 'mainDishSides' table.
	 * @param {Object} body the object to be inserted into the database.
	 * @returns {Object} returns new Orders object.
	 * @memberof models/MainDishSides
	 */
	async addMainDishSide(body) {
		const sql = `INSERT INTO mainDishSides (mainDishID, sideDishID)\
					 VALUES(${body.mainDishID}, 
							${body.sideDishID}
							);`
		await this.db.run(sql)
		return true
	}

	/**
	 * closes the connection to SQLite database
	 * @memberof models/MainDishSides
	 */
	async close() {
		await this.db.close()
	}
}

export { MainDishSides }
