module.exports = {
  getError(errors, prop) {
    //prop === "email" or "password" or "passwordConfirmation"
    try {
      return errors.mapped()[prop].msg; //"errors.mapped" cambia el array de "errors" a un objeto
      //"[prop]" se mete en el key del objeto errors y "msg" se mete en el key del objeto "prop"
    } catch (err) {
      return "";
    }
  },
};
