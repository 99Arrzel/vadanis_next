import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const personasRouter = router({
  getProveedores: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.personas.findMany({
      where: {
        tipo: "PROVEEDOR"
      }
    })
  }),
  getPersonas: protectedProcedure.input(z.object(
    {
      search: z.string()
    }
  )).query(({ ctx, input }) => {
    return ctx.prisma.personas.findMany({
      where: {
        OR: [
          {
            nombres: {
              contains: input.search,
              mode: "insensitive",
            },
          },
          {
            apellidos: {
              contains: input.search,
              mode: "insensitive",
            },
          },
          {
            ci: {
              contains: input.search,
              mode: "insensitive",
            },
          },
        ],
      },

    });
  }),
  crearPersona: protectedProcedure.input(z.object({
    nombres: z.string().min(3, "El nombre es muy corto, minimo 3 letras.").nullish(),
    apellidos: z.string().min(3, "El apellido es muy corto, minimo 3 letras."),
    ci: z.string().min(3, "La cedula es muy corta, minimo 3 letras."),
    telefono: z.string().min(3, "El telefono es muy corto, minimo 3 letras.").nullish(),
    direccion: z.string().min(3, "La direccion es muy corta, minimo 3 letras.").nullish(),
    estado: z.boolean(),
    tipo: z.enum(["CLIENTE", "PROVEEDOR"])
  })).mutation(async ({ ctx, input }) => {
    return ctx.prisma.personas.create({
      data: {
        nombres: input.nombres,
        apellidos: input.apellidos,
        ci: input.ci,
        telefono: input.telefono,
        direccion: input.direccion,
        estado: input.estado,
        tipo: input.tipo,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: undefined,

      },
    });
  }),
  actualizarPersona: protectedProcedure.input(z.object({
    id: z.number(),
    nombres: z.string().min(3, "El nombre es muy corto, minimo 3 letras.").nullish(),
    apellidos: z.string().min(3, "El apellido es muy corto, minimo 3 letras."),
    ci: z.string().min(3, "La cedula es muy corta, minimo 3 letras."),
    telefono: z.string().min(3, "El telefono es muy corto, minimo 3 letras.").nullish(),
    direccion: z.string().min(3, "La direccion es muy corta, minimo 3 letras.").nullish(),
    estado: z.boolean(),
    tipo: z.enum(["CLIENTE", "PROVEEDOR", "PERSONAL"])
  })).mutation(async ({ ctx, input }) => {
    return ctx.prisma.personas.update({
      where: { id: input.id },
      data: {
        nombres: input.nombres,
        apellidos: input.apellidos,
        ci: input.ci,
        telefono: input.telefono,
        direccion: input.direccion,
        estado: input.estado,
        tipo: input.tipo,
        updatedAt: new Date(),
      },
    });
  }),
  eliminarPersona: protectedProcedure.input(z.object({
    id: z.number()
  })).mutation(async ({ ctx, input }) => {
    return ctx.prisma.personas.delete({
      where: { id: input.id },
    });
  }),
  adquisicionesPersona: protectedProcedure.input(z.object({
    id: z.number()
  })).query(async ({ ctx, input }) => {
    return ctx.prisma.adquisiciones.findMany({
      where: { personaId: input.id },
      include: {
        DetallesAdquisiciones: true,
      }
    });
  }),
  comprasPersona: protectedProcedure.input(z.object({
    id: z.number()
  })).query(async ({ ctx, input }) => {
    return ctx.prisma.ventas.findMany({
      where: { personaId: input.id },
      include: {
        DetallesVenta: true,
      }
    });
  }
  ),
});
