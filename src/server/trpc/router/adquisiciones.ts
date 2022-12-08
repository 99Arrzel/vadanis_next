import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const adquisicionesRouter = router({
  getAdquisiciones: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.adquisiciones.findMany({
        include: {
          Persona: true,
          Usuario: true,
          DetallesAdquisiciones: {
            include: {
              Producto: true,
            },
          },
        },
      });
    }),
  crearAdquisicion: protectedProcedure
    .input(z.object({
      idProveedor: z.number(),
      fecha: z.date(),
      total: z.number(),
      detalles: z.array(z.object({
        cantidad: z.number(),
        idProducto: z.number(),
        precio: z.number(),
        comentario: z.string().nullish(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      const proveedor = await ctx.prisma.personas.findUnique({
        where: {
          id: input.idProveedor,
        },
      });
      if (!proveedor?.estado) {
        throw new Error("Proveedor inactivo");
      }
      return await ctx.prisma.adquisiciones.create({
        data: {
          fecha: input.fecha,
          total: input.total,
          personaId: input.idProveedor,
          userId: ctx.session.user.id,
          DetallesAdquisiciones: {
            create: input.detalles.map((detalle) => ({
              cantidad: detalle.cantidad,
              precio: detalle.precio,
              comentario: detalle.comentario ?? "Sin comentario",
              productoId: detalle.idProducto,
            })),
          }
        },
      });
    }),

});
