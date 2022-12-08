import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import Topbar from "../../components/topbar";
import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { trpc } from "../../utils/trpc";
import { Notify } from 'notiflix';
const Adquisiciones = () => {
  /* States para adq */
  const [fecha, setFecha] = useState<any>();
  const [total, setTotal] = useState<number>(0);
  const [persona, setPersona] = useState<any>("");
  /* Detalles adquisiciones */
  const [cantidad, setCantidad] = useState<number>(0);
  const [precio, setPrecio] = useState<number>(0);
  const [producto, setProducto] = useState<any>(0);
  const [comentario, setComentario] = useState<string>("");
  const [arrayAdquisiciones, setArrayAdquisiciones] = useState<any>([]);




  const proveedores = trpc.personas.getProveedores.useQuery(); //Que traiga todo
  const productos = trpc.productos.getProductos.useQuery({ search: "" });

  const adquisiciones = trpc.adquisiciones.getAdquisiciones.useQuery();
  const crearAdquisicion = trpc.adquisiciones.crearAdquisicion.useMutation({
    onSuccess: () => {
      adquisiciones.refetch();
      Notify.success("Editado con éxito")
    },
    onError: (error) => {
      Notify.failure(error.message)/* Por si acaso */
      for (const i of JSON.parse(error.message)) {
        Notify.failure(`Error en: ${i.path.at(0)}, mensaje: ${i.message} `)
      }
    }
  });

  const [selectedAdquisicion, setSelectedAdquisicion] = useState<any>(null);

  return (
    <>
      <Topbar />
      <div className="m-4 flex gap-2 justify-center">
        {/* Tabla izquierda */}
        <div className="flex flex-col basis-1/2">
          <div>
            <button className="p-2 bg-red-500 text-white">Anular</button>
          </div>
          <p className="text-center">Adquisiciones</p>
          <DataTable value={adquisiciones.data} selectionMode="single" selection={selectedAdquisicion} onSelectionChange={e => { setSelectedAdquisicion(e.value); console.log(e.value) }}>
            <Column header="Fecha" field="fecha" body={
              (data) => {
                console.log(data)
                return new Date(data.fecha).toLocaleDateString()
              }
            } />
            <Column header="Total" field="total"></Column>
            <Column header="Estado" field="estado"></Column>
            <Column header="Persona" field="Persona.nombres"></Column>
            <Column header="Usuario" field="Usuario.name"></Column>
          </DataTable>
          <p className="text-center">Detales de adquisición</p>
          <DataTable value={selectedAdquisicion?.DetallesAdquisiciones ?? []} emptyMessage="Selecciona una adquisicion">
            <Column header="Cantidad" field="fecha"></Column>
            <Column header="Precio" field="precio"></Column>
            <Column header="Producto" field="Producto.nombre"></Column>
            <Column header="Comentario" field="comentario" ></Column>
            <Column header="P.total" body={(data) => {
              return data.precio * data.cantidad
            }}></Column>
          </DataTable>
        </div>
        {/* input derecha */}
        <div className="grid grid-cols-2 gap-2 h-fit basis-1/2">

          <div className="p-inputgroup h-10">
            <span className="p-inputgroup-addon">Fecha</span>
            <Calendar value={fecha} onChange={(e) => setFecha(e.value)}></Calendar>
          </div>
          <div className="p-inputgroup h-10">
            <span className="p-inputgroup-addon bg-green-300">Total</span>
            <InputText disabled value={total} />
          </div>
          <div className="p-inputgroup h-10">
            <span className="p-inputgroup-addon ">Vendedor</span>
            <Dropdown value={persona} options={proveedores.data} onChange={(e) => { setPersona(e.value); console.log(e.value) }} optionLabel="nombres" filter showClear filterBy="nombres,apellidos,ci"
              placeholder="Selecciona el vendedor" itemTemplate={(opcion) => {
                return `${opcion.nombres} ${opcion.apellidos} - ${opcion.ci}`
              }} />
          </div>
          <button className="bg-green-600 text-white" onClick={
            () => {
              /* Creamos la query para esto */
              crearAdquisicion.mutate({
                fecha: fecha,
                total,
                idProveedor: persona.id as number,
                detalles: arrayAdquisiciones.map((adquisicion: any) => {
                  return {
                    cantidad: adquisicion.cantidad,
                    precio: adquisicion.precio,
                    idProducto: adquisicion.producto.id,
                    comentario: adquisicion.comentario
                  }
                })
              });
              /*Reseteamos el array */
              setArrayAdquisiciones([]);
            }
          }>
            Crear Adquisición
          </button>
          <div className="col-span-2">
            <p className="text-center">Detalles</p>
          </div>
          <div className="p-inputgroup h-10">
            <span className="p-inputgroup-addon ">Cantidad</span>
            <InputText value={cantidad} onChange={(e) => { setCantidad(Number(e.target.value)) }} type="number" />
          </div>
          <div className="p-inputgroup h-10">
            <span className="p-inputgroup-addon ">Precio</span>
            <InputText value={precio} onChange={(e) => { setPrecio(Number(e.target.value)) }} type="number" />
          </div>
          <div className="p-inputgroup h-10">
            <span className="p-inputgroup-addon ">Producto</span>
            <Dropdown value={producto} options={productos.data} onChange={(e) => { setProducto(e.value); console.log(e.value) }} optionLabel="nombre" filter showClear filterBy="nombres,apellidos,ci"
              placeholder="Selecciona el producto" itemTemplate={(opcion) => {
                return `${opcion.nombre} ${opcion.Marca.nombre} - Stock:${opcion.stock}`
              }} emptyMessage="Sin resultados" />
          </div>
          <div className="p-inputgroup h-10">
            <span className="p-inputgroup-addon ">Comentario</span>
            <InputText value={comentario} onChange={(e) => { setComentario(e.target.value) }} />
          </div>

          <button className="col-span-2 p-2 bg-green-500 text-white"
            onClick={
              () => {
                if (cantidad <= 0 || precio <= 0 || producto == null) {
                  Notify.failure("Faltan datos");
                  return;
                }
                setTotal(total + (cantidad * precio));
                setArrayAdquisiciones([...arrayAdquisiciones, {
                  cantidad,
                  precio,
                  producto,
                  comentario
                }])

              }
            }
          >Agregar detalle</button>
          <div className="col-span-2">
            {/* Tabla */}
            <DataTable title="Detalles" value={arrayAdquisiciones} emptyMessage="Agrega detalles">
              <Column header="Cantidad" field="cantidad"></Column>
              <Column header="Precio" field="precio"></Column>
              <Column header="Producto" field="producto.nombre"></Column>
              <Column header="Comentario" field="comentario"></Column>
              <Column header="P.Total" body={(data) => {
                return data.cantidad * data.precio;
              }} />


            </DataTable>
          </div>
        </div>
      </div>
    </>
  )
}
export default Adquisiciones;