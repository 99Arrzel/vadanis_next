import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const categoriasRouter = router({
  getCategorias: protectedProcedure
    .input(z.object({ search: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.categoriaProductos.findMany({
        where: {
          OR: [
            {
              nombre: {
                contains: input.search,
                mode: "insensitive",
              },
            },
          ],
        },
      })
    }),
  crearCategoria: protectedProcedure.input(z.object({ nombre: z.string().min(2, "Minimo 2 letras") })).mutation(({ ctx, input }) => {
    return ctx.prisma.categoriaProductos.create({
      data: {
        nombre: input.nombre
      }
    })
  }),
  deleteCategoria: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => {
    return ctx.prisma.categoriaProductos.delete({
      where: {
        id: input.id
      }
    })
  }),
  editarCategoria: protectedProcedure.input(z.object({ id: z.number(), nombre: z.string().min(2, "Minimo 2 letras") })).mutation(({ ctx, input }) => {
    return ctx.prisma.categoriaProductos.update({
      data: {
        nombre: input.nombre
      },
      where: {
        id: input.id
      }
    })
  })

});
