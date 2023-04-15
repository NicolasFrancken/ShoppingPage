//cambié el script de "package.json"
//en el terminal: "npm run dev" ejecuta el programa y lo deja ejecutado esperando cambios

const express = require("express"); //es un server que espera reuqests y devuelve responses
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");
const adminProductsRouter = require("./routes/admin/products");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");

const app = express(); //esta variable le dira a la web que requests recibirá y que hacer con ellas

app.use(express.static("public")); //hago que express linkee los archivos con el navegador. la carpeta "public" la puede ver todo el mundo

app.use(bodyParser.urlencoded({ extended: true }));
//con "app.use(bodyParser)" hago que todos los "route handlers" tengan esta funcion como middleware function. Ademas detecta solo si se esta usando un metodo "POST" o "GET" (y actua solo en el "POST")
//usar esta funcion ya creada es lo mismo que usar la funcion que creé yo ("bodyParser" mas abajo), pero esta es mas completa. agrega los datos a la propiedad "body" del objeto "req"

app.use(
  cookieSession({
    keys: ["candehermosa"],
  })
);
//con "app.use(cookieSession)" agrego una propiedad a req (req.session)
//con "keys:" encripto las cookies

app.use(authRouter);
app.use(productsRouter);
app.use(adminProductsRouter);
app.use(cartsRouter);

app.listen(3001, () => {
  console.log("listening");
});
