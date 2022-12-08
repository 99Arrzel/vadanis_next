import { z } from "zod";

import { router, protectedProcedure } from "../trpc";
import bcrypt from 'bcrypt';

export const usuariosRouter = router({
  getVentas: protectedProcedure.input(
    z.object({
      id: z.string()
    })
  ).query(({ ctx, input }) => {
    return ctx.prisma.ventas.findMany(
      {
        where: {
          userId: input.id
        }
      }
    )
  }),
  getUsuarios: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      select: {
        name: true,
        email: true,
        id: true,
        tipo: true
      }
    });
  }),
  crearUsuario: protectedProcedure.input(z.object({
    nombre: z.string().min(3, "El nombre es muy corto, minimo 3 letras."),
    email: z.string().email("Debes poner un correo válido."),
    password: z.string().min(3, "la password debe tener al menos 3 digitos"),
    nivel: z.boolean()
  })).mutation(async ({ ctx, input }) => {
    /* bcrypt para la password */
    const password = await bcrypt.hash(input.password, 10);
    const tipo = input.nivel ? "ADMIN" : "USUARIO";
    return ctx.prisma.user.create({
      data: {
        name: input.nombre,
        email: input.email,
        password,
        tipo
      },
    });
  }),
  editarUsuario: protectedProcedure.input(z.object({
    id: z.string(), //String porque es un cuid
    nombre: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(3),
    nivel: z.boolean()
  })).mutation(async ({ ctx, input }) => {
    /* bcrypt para la password */
    const password = await bcrypt.hash(input.password, 10);
    const tipo = input.nivel ? "ADMIN" : "USUARIO";
    return ctx.prisma.user.update({
      where: { id: input.id },
      data: {
        name: input.nombre,
        email: input.email,
        password,
        tipo
      },
    });
  }),
  eliminarUsuario: protectedProcedure.input(z.object({
    id: z.string(), //String porque es un cuid
  })).mutation(async ({ ctx, input }) => {
    /* Primero chequeamos que el usuario no tenga ventas*/
    const ventas = await ctx.prisma.ventas.findMany({
      where: {
        userId: input.id,
      },
      take: 1,
    });
    if (ventas.length > 0) {
      throw new Error("El usuario tiene ventas asociadas");
    }
    return ctx.prisma.user.delete({
      where: { id: input.id },
    });
  }),
});
