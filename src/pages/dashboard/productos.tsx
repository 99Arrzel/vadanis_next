import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import Topbar from "../../components/topbar"
import { trpc } from "../../utils/trpc"
import { useState } from 'react';
import { InputText } from "primereact/inputtext";
import { Notify } from "notiflix";
import { InputSwitch } from 'primereact/inputswitch';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from "primereact/dropdown";

const Productos = () => {
  const crearMarca = trpc.marcas.crearMarca.useMutation({
    onSuccess: () => {
      marcas.refetch();
      Notify.success("Creado con éxito")
    },
    onError: (error) => {
      Notify.failure(error.message)/* Por si acaso */
      for (const i of JSON.parse(error.message)) {
        Notify.failure(`Error en: ${i.path.at(0)}, mensaje: ${i.message} `)
      }
    }
  });
  const crearCategoria = trpc.categorias.crearCategoria.useMutation({
    onSuccess: () => {
      categorias.refetch();
      Notify.success("Creado con éxito")
    },
    onError: (error) => {
      Notify.failure(error.message)/* Por si acaso */

      for (const i of JSON.parse(error.message)) {
        Notify.failure(`Error en: ${i.path.at(0)}, mensaje: ${i.message} `)
      }
    }
  });

  const [nombreMarca, setNombremarca] = useState("")
  const [buscarMarca, setBuscarMarca] = useState("")
  const [nombreCategoria, setNombreCategoria] = useState("")
  const [buscarCategoria, setBuscarCategoria] = useState("")

  const marcas = trpc.marcas.getMarcas.useQuery({ search: buscarMarca });
  const categorias = trpc.categorias.getCategorias.useQuery({ search: buscarCategoria });
  const eliminarMarca = trpc.marcas.deleteMarca.useMutation({
    onSuccess: () => {
      marcas.refetch();
      Notify.success("Eliminado con éxito")
    },
    onError: (error) => {
      Notify.failure(error.message)/* Por si acaso */
      for (const i of JSON.parse(error.message)) {
        Notify.failure(`Error en: ${i.path.at(0)}, mensaje: ${i.message} `)
      }
    },

  });
  const eliminarCategoria = trpc.categorias.deleteCategoria.useMutation({
    onSuccess: () => {
      categorias.refetch();
      Notify.success("Eliminado con éxito")
    },
    onError: (error) => {
      Notify.failure(error.message)/* Por si acaso */
      for (const i of JSON.parse(error.message)) {
        Notify.failure(`Error en: ${i.path.at(0)}, mensaje: ${i.message} `)
      }
    },
  });
  const editarCategoria = trpc.categorias.editarCategoria.useMutation({
    onSuccess: () => {
      categorias.refetch();
      Notify.success("Editado con éxito")
    },
    onError: (error) => {
      Notify.failure(error.message)/* Por si acaso */
      for (const i of JSON.parse(error.message)) {
        Notify.failure(`Error en: ${i.path.at(0)}, mensaje: ${i.message} `)
      }
    },
  });
  const editarMarca = trpc.marcas.editarMarca.useMutation({
    onSuccess: () => {
      marcas.refetch();
      Notify.success("Editado con éxito")
    },
    onError: (error) => {
      Notify.failure(error.message)/* Por si acaso */
      for (const i of JSON.parse(error.message)) {
        Notify.failure(`Error en: ${i.path.at(0)}, mensaje: ${i.message} `)
      }
    },
  });
  /* Productos */
  const [nombreProducto, setNombreProducto] = useState("")
  const [precioProducto, setPrecioProducto] = useState<number>(0)
  const [fecha_expiracion, setFecha_expiracion] = useState<any>();
  const [marca, setMarca] = useState<any>("")
  const [categoria, setCategoria] = useState<any>("")

  const crearProducto = trpc.productos.crearProducto.useMutation({
    onSuccess: () => {
      marcas.refetch();
      Notify.success("Editado con éxito")
    },
    onError: (error) => {
      Notify.failure(error.message)/* Por si acaso */
      for (const i of JSON.parse(error.message)) {
        Notify.failure(`Error en: ${i.path.at(0)}, mensaje: ${i.message} `)
      }
    }
  });
  const productos = trpc.productos.getProductos.useQuery({ search: "" });
  const [producto, setProducto] = useState<any>()
  return (<>
    <Topbar />
    <div className="m-4 flex">
      <div className="basis-1/4 h-screen">
        <div className="h-1/2 overflow-auto">
          <p className="text-center text-2xl">Marcas</p>
          <div className="p-inputgroup h-10">
            <span className="p-inputgroup-addon ">Nombre</span>
            <InputText value={nombreMarca} onChange={(e) => { setNombremarca(e.target.value) }} type="text" />
            <button className="bg-green-500 px-2 text-white"
              onClick={() => {
                crearMarca.mutate({
                  nombre: nombreMarca
                })
              }}>+</button>
          </div>
          <div className="p-inputgroup h-10">
            <span className="p-inputgroup-addon ">Buscar</span>
            <InputText value={buscarMarca} onChange={(e) => { setBuscarMarca(e.target.value) }} type="text" />
          </div>
          <DataTable value={marcas.data} emptyMessage="No hay marcas" responsiveLayout="scroll">
            <Column header="Nombre" field="nombre" onCellEditComplete={(data) => {
              console.log(data)
              if (data.newRowData.nombre === data.rowData.nombre) return
              editarMarca.mutate({
                id: data.rowData.id,
                nombre: data.newRowData.nombre
              })
            }} editor={(options) => {
              return <InputText type="text" value={options.value} onChange={(e) => {
                if (options.editorCallback) {
                  options.editorCallback(e.target.value)
                }
              }
              } />
            }} />
            <Column header="Fecha Creación" body={(data) => data.createdAt.toLocaleDateString()} />
            <Column header="Eliminar" body={(data) => {
              return <button className="bg-red-500 p-1 text-white" onClick={() => {
                eliminarMarca.mutate({ id: data.id })
              }}>Eliminar</button>
            }} />
          </DataTable>
        </div>
        <div className="h-1/2 overflow-auto">
          <p className="text-center text-2xl">Categorías</p>

          <div className="p-inputgroup h-10">
            <span className="p-inputgroup-addon ">Nombre</span>
            <InputText value={nombreCategoria} onChange={(e) => { setNombreCategoria(e.target.value) }} type="text" />
            <button className="bg-green-500 px-2 text-white"
              onClick={() => {
                crearCategoria.mutate({
                  nombre: nombreCategoria
                })
              }}>+</button>
          </div>
          <div className="p-inputgroup h-10">
            <span className="p-inputgroup-addon ">Buscar</span>
            <InputText value={buscarCategoria} onChange={(e) => { setBuscarCategoria(e.target.value) }} type="text" />
          </div>
          <DataTable value={categorias.data} emptyMessage="No hay categorias" responsiveLayout="scroll">
            <Column header="Nombre" field="nombre" onCellEditComplete={(data) => {
              console.log(data)
              if (data.newRowData.nombre === data.rowData.nombre) return
              editarCategoria.mutate({
                id: data.rowData.id,
                nombre: data.newRowData.nombre
              })
            }} editor={(options) => {
              return <InputText type="text" value={options.value} onChange={(e) => {
                if (options.editorCallback) {
                  options.editorCallback(e.target.value)
                }
              }
              } />
            }} />
            <Column header="Fecha Creación" body={(data) => data.createdAt.toLocaleDateString()} />
            <Column header="Eliminar" body={(data) => {
              return <button className="bg-red-500 p-1 text-white" onClick={() => {
                eliminarCategoria.mutate({ id: data.id })
              }}>Eliminar</button>
            }} />
          </DataTable>
        </div>
      </div>
      {/* Acá la parte de productos */}
      <div className="basis-3/4 ">
        <p className="text-center text-2xl">Productos</p>
        <div className="flex gap-2">
          <div className="p-inputgroup  h-10">
            <span className="p-inputgroup-addon w-fit ">Nombre</span>
            <InputText value={nombreProducto} onChange={
              (e) => setNombreProducto(e.target.value)
            } />
          </div>
          <div className="p-inputgroup h-10">
            <span className="p-inputgroup-addon ">Precio</span>
            <InputText
              value={precioProducto}
              type="number"
              onChange={(e) => setPrecioProducto(Number(e.target.value))}
            />
          </div>
          <div className="p-inputgroup h-10">
            <span className="p-inputgroup-addon ">F. Expiracion</span>
            <Calendar value={fecha_expiracion} onChange={
              (e) => {
                setFecha_expiracion(e.value)

              }
            } />
          </div>
          <div className="p-inputgroup h-10">
            <span className="p-inputgroup-addon ">Marca</span>
            <Dropdown value={marca} options={marcas.data} onChange={(e) => { setMarca(e.value); console.log(e.value) }} optionLabel="nombre" filter showClear filterBy="nombre"
              placeholder="Selecciona la marca" itemTemplate={(opcion) => {
                return `${opcion.nombre}`
              }} emptyMessage="Sin resultados" />
          </div>
          <div className="p-inputgroup h-10">
            <span className="p-inputgroup-addon ">Categoria</span>
            <Dropdown value={categoria} options={categorias.data} onChange={(e) => { setCategoria(e.value); console.log(e.value) }} optionLabel="nombre" filter showClear filterBy="nombre"
              placeholder="Selecciona la categoria" itemTemplate={(opcion) => {
                return `${opcion.nombre}`
              }} emptyMessage="Sin resultados" />
          </div>
          <button className="bg-green-500 p-2 text-white"
            onClick={
              () => {
                crearProducto.mutate({
                  nombre: nombreProducto,
                  precio: precioProducto,
                  fecha_exp: fecha_expiracion,
                  marca: marca.id,
                  categoria: categoria.id
                })
              }
            }

          >Crear</button>
        </div>
        <div className="flex gap-2 py-2">
          <div className="p-inputgroup h-10">
            <span className="p-inputgroup-addon ">Buscar</span>
            <InputText />
          </div>
          <button className="bg-red-500 p-2 text-white disabled:bg-gray-500" disabled={!producto}>Eliminar</button>
        </div>
        <DataTable value={productos.data} emptyMessage="Sin productos aún">
          <Column header="Nombre" field="nombre" />
          <Column header="Fecha de expiracion" field="fecha_exp" body={
            (data) => {
              return data.fecha_exp.toLocaleDateString()
            }
          } />
          <Column header="Precio" field="precio" />
          <Column header="Stock" field="stock" />
          <Column header="Estado" field="estado" />
          <Column header="Marca" field="marca" body={
            (data) => {
              console.log(data)
              return data.Marca.nombre
            }
          } />
          <Column header="Categoria" field="categoria" body={
            (data) => {
              return data.CategoriaProductos.nombre
            }
          } />

        </DataTable>
      </div>
    </div>
  </>)
}
export default Productos