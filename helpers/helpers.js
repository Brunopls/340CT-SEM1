/**
 *
 * @class helpers/TimeHelpers
 */
class Helpers {

	/**
	 * calculates how many hours it's been since the user logged in.
	 * @param {Integer} date the user logged in in milliseconds
	 * @returns {Float} rounded decimal value of hours worked since the user logged in.
	 * @memberof helpers/TimeHelpers
	 */
	async getHoursWorked(loginTime) {
		return ((Date.now() - loginTime) / (1000*60*60) % 24).toFixed(2)
	}

}

export { Helpers }