const express = require("express");

const { handleErrors } = require("./middlewares");
const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireExistingEmail,
  requireExistingPassword,
} = require("./validators");

const router = express.Router(); //creo un "router" que es como el "app" del index

router.get("/signup", (req, res) => {
  //"req" sera la info que me da el usuario; "res" sera lo que la pagina le devulverá
  res.send(signupTemplate({ req })); // {req:req}
});

// const bodyParser = (req, res, next) => { //esto es una middleware function (funciones en el medio de un "request handler"). sirven para reusar codigo en "express"
//   if(req.method === "POST"){
//     req.on("data", (data) => {
//       //".on" es como un "addEventListener" y el event en este caso es "data"
//       const parsed = data.toSting("utf8").split("&"); //"data" devuelve informacion en un buffer y con "toString(utf8)" lo paso a palabras
//       const formData = {};
//       for (let parse of parsed) {
//         const [key, value] = parse.split("="); //con esta sintaxis, defino "key" = primer elemento de "parse.split" y "value" = segundo elemento de "parse.split"
//         formData[key] = value;
//       }
//       req.body = formData
//       next()
//     });
//   }else {
//     next() //"next()" es una callback function que se nos devuelve. sirve para cuando terminamos de usar la middleware function
//   }
// }

//todo esto es un "route handler"
router.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body;

    //create user in our users repo to represent a person
    const user = await usersRepo.create({ email, password }); //{ email: email, password: password }

    //store id of user inside the users cookie
    req.session.userId = user.id;

    res.redirect("/admin/products");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("Logged out");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate({})); //pongo un objeto vacio para que, cuando el programa quiera desestructurar "errors", al menos encuentre un objeto para intentar hacerlo (y no de error)
});

router.post(
  "/signin",
  [requireExistingEmail, requireExistingPassword],
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;

    res.redirect("/admin/products");
  }
);

module.exports = router; //exporto el "router"
