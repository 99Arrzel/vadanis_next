import { CategoriaProductos } from './../../../../node_modules/.prisma/client/index.d';
import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const productosRouter = router({
  getProductos: protectedProcedure
    .input(z.object({ search: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.productos.findMany({
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
        include: {
          Marca: true,
          CategoriaProductos: true,
          ImagenesProductos: true
        }
      })
    }),
  crearProducto: protectedProcedure.input(z.object({
    nombre: z.string().min(2, "Minimo 2 letras"),
    precio: z.number(),
    fecha_exp: z.date(),
    marca: z.number(),
    categoria: z.number(),
  })).mutation(({ ctx, input }) => {
    return ctx.prisma.productos.create({
      data: {
        nombre: input.nombre,
        precio: input.precio,
        fecha_exp: input.fecha_exp,
        Marca: {
          connect: {
            id: input.marca
          }
        },
        estado: true,
        CategoriaProductos: {
          connect: {
            id: input.categoria
          }
        },
        stock: 0 //Valor inicial
      }
    })
  }),
  editarProducto: protectedProcedure.input(z.object({
    id: z.number(),
    nombre: z.string().min(2, "Minimo 2 letras"),
    precio: z.number(),
    fecha_exp: z.date(),
    marca: z.number(),
    categoria: z.number(),
  })).mutation(({ ctx, input }) => {
    return ctx.prisma.productos.update({
      data: {
        nombre: input.nombre,
        precio: input.precio,
        fecha_exp: input.fecha_exp,
        Marca: {
          connect: {
            id: input.marca
          }
        },
        CategoriaProductos: {
          connect: {
            id: input.categoria
          }
        },
      },
      where: {
        id: input.id
      }
    })
  }),
});
