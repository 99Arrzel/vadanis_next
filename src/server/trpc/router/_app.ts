import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { usuariosRouter } from './usuarios';
import { personasRouter } from './personas';
import { productosRouter } from './productos';
import { marcasRouter } from "./marcas";
import { categoriasRouter } from './categorias';
import { adquisicionesRouter } from "./adquisiciones";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  usuarios: usuariosRouter,
  personas: personasRouter,
  productos: productosRouter,
  marcas: marcasRouter,
  categorias: categoriasRouter,
  adquisiciones: adquisicionesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
