const { validationResult } = require("express-validator");

module.exports = {
  handleErrors(templateFunc, dataCallback) {
    return async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let data = {}; //le doy un objeto vacio predeterminado porque, si no se ejecuta la funcion "dataCallback", el programa luego intentara hacer "...data" con "undefined"
        if (dataCallback) {
          data = await dataCallback(req);
        }
        return res.send(templateFunc({ errors, ...data }));
      }

      next(); //le dice a express que continue con los otros middlewares o los route handlers
    };
  },

  requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.redirect("/signin");
    }

    next();
  },
};
