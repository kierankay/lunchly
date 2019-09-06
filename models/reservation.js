/** Reservation for Lunchly */

const moment = require("moment");

const db = require("../db");


/** A reservation for a party */

class Reservation {
  constructor({id, customerId, numGuests, startAt, notes}) {
    this.id = id;
    this.customerId = customerId;
    // this.numGuests = numGuests;
    this.startAt = Date(startAt);
    this.notes = notes;
    this.numGuests = numGuests
    
    
  }


  set numGuests(numGuests){
    if(numGuests < 1){
      throw Error
    } else {
      this._numGuests = numGuests
    }
  }

  get numGuests(){
    return this._numGuests
  }


  set startAt(val){
    if(val instanceof Date){
      throw Error 
    } else {
      this._startAt = new Date(val) 
    }
  }

  get startAt(){
    let newStart = new Date(this._startAt)
    return newStart
  }







  /** formatter for startAt */
  
  getformattedStartAt() {
    return moment(this.startAt).format('MMMM Do YYYY, h:mm a');
  }

  /** given a customer id, find their reservations. */

  static async getReservationsForCustomer(customerId) {
    const results = await db.query(
          `SELECT id, 
           customer_id AS "customerId", 
           num_guests AS "numGuests", 
           start_at AS "startAt", 
           notes AS "notes"
         FROM reservations 
         WHERE customer_id = $1`,
        [customerId]
    );

    return results.rows.map(row => new Reservation(row));
  }

  async save() {
    let result = await db.query(
      `INSERT INTO reservations (customer_id, start_at, num_guests, notes) 
      VALUES ($1, $2, $3, $4)
      RETURNING id`,
      [this.customerId, this.startAt, this.numGuests, this.notes]
    )
    this.id = result.rows[0].id;
  }
}


module.exports = Reservation;
