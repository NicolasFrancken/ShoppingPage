const fs = require("fs");
const crypto = require("crypto"); //libreria de node
const util = require("util");
const Repository = require("./repository");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
  //con "extends", agrego lo que tenga UsersRepository. En el caso de "create()", se sobreescribe y queda la funcion de UsersRepository
  async comparePasswords(saved, supplied) {
    //saved = "hashed.salt"
    //suplied = password from user trying to sign in

    const result = saved.split(".");
    const hashed = result[0];
    const salt = result[1];
    //es lo mismo escribir "const [hashed, salt] = saved.split(".")"
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

    return hashed === hashedSuppliedBuf.toString("hex");
  }

  async create(attrs) {
    attrs.id = this.randomId();

    const salt = crypto.randomBytes(8).toString("hex"); //creo un string random
    const buf = await scrypt(attrs.password, salt, 64); //agrego el string random al password del usuario

    const records = await this.getAll();
    const record = { ...attrs, password: `${buf.toString("hex")}.${salt}` }; //agrego por segunda vez el string random pero con un punto de por medio
    records.push(record);

    await this.writeAll(records);

    return record;
  }
}

//
module.exports = new UsersRepository("users.json");
