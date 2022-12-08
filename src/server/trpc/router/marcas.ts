import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const marcasRouter = router({
  getMarcas: protectedProcedure
    .input(z.object({ search: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.marcas.findMany({
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
  crearMarca: protectedProcedure.input(z.object({ nombre: z.string().min(2, "Minimo 2 letras") })).mutation(({ ctx, input }) => {
    return ctx.prisma.marcas.create({
      data: {
        nombre: input.nombre
      }
    })
  }),
  deleteMarca: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => {
    return ctx.prisma.marcas.delete({
      where: {
        id: input.id
      }
    })
  }),
  editarMarca: protectedProcedure.input(z.object({ id: z.number(), nombre: z.string().min(2, "Minimo 2 letras") })).mutation(({ ctx, input }) => {
    return ctx.prisma.marcas.update({
      data: {
        nombre: input.nombre
      },
      where: {
        id: input.id
      }
    })
  })

});
