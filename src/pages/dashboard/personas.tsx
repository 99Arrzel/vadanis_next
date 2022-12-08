import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import Topbar from "../../components/topbar"
import { trpc } from "../../utils/trpc"
import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Notify } from "notiflix";
import { Modal } from "../../components/Modal";
const Personas = () => {
  const [search, setSearch] = useState("");
  const [accion, setAccion] = useState("Crear");
  /* Valores de form */
  const [estado, setEstado] = useState(true);
  const [tipo, setTipo] = useState<any>("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [ci, setCI] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [id, setId] = useState(0);
  /* Querys */
  const crearPersona = trpc.personas.crearPersona.useMutation(
    {
      onSuccess: () => {
        personas.refetch();
        Notify.success("Creado con éxito")
        setSeleccionado(null)
      },
      onError: (error) => {
        for (const i of JSON.parse(error.message)) {

          Notify.failure(`Error en: ${i.path.at(0)}, mensaje: ${i.message} `)
        }
      }
    }
  );
  const editarPersona = trpc.personas.actualizarPersona.useMutation({
    onSuccess: () => {
      personas.refetch();
      Notify.success("Creado con éxito")
      setSeleccionado(null)
    },
    onError: (error) => {
      for (const i of JSON.parse(error.message)) {

        Notify.failure(`Error en: ${i.path.at(0)}, mensaje: ${i.message} `)
      }
    }
  })

  const [seleccionado, setSeleccionado] = useState<any>(null);

  useEffect(() => {
    if (seleccionado) {
      setId(seleccionado.id);
      setNombres(seleccionado.nombres)
      setApellidos(seleccionado.apellidos)
      setCI(seleccionado.ci)
      setTelefono(seleccionado.telefono)
      setDireccion(seleccionado.direccion)
      setEstado(seleccionado.estado)
      setTipo({ name: seleccionado.tipo })
      setAccion("Editar")
    } else {
      setNombres("")
      setApellidos("")
      setCI("")
      setTelefono("")
      setDireccion("")
      setEstado(false)
      setTipo("")
      setAccion("Crear")
    }
  }, [seleccionado])

  const personas = trpc.personas.getPersonas.useQuery({ search });
  const comprasPersona = trpc.personas.comprasPersona.useQuery({ id });
  const adquisicionesPersona = trpc.personas.adquisicionesPersona.useQuery({ id });
  /* Modal states */
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  /* Detalles de compras y adquisiciones */
  const [selected1, setSelected1] = useState<any>();
  const [selected2, setSelected2] = useState<any>();
  return <>
    {/* Modal de adquisiciones */}
    <Modal
      open={open2}
      onClose={() => { setOpen2(false) }}
      titulo="Adquisiciones que proveyó esta persona"
    >
      <div className="flex">
        <DataTable value={adquisicionesPersona.data} emptyMessage="Esta persona aún no proveyó nada"
          selectionMode="single" selection={selected1} onSelectionChange={e => { setSelected1(e.value); console.log(e.value) }}>
          <Column field="fecha" header="Fecha"></Column>
          <Column field="total" header="Total"></Column>
          <Column field="estado" header="Estado"></Column>
        </DataTable>
        <DataTable value={selected1?.DetallesAdquisiciones} emptyMessage="Selecciona un detalle para ver la lista">
          <Column field="cantidad" header="Cantidad"></Column>
          <Column field="precio" header="Precio"></Column>
          <Column field="estado" header="Estado"></Column>
          <Column field="comentario" header="Comentarios"></Column>
          <Column field="marca" header="Marca"></Column>
          <Column field="producto.nombre" header="Producto"></Column>
        </DataTable>

      </div>
    </Modal>
    {/* Modal de ventas */}
    <Modal
      open={open1}
      onClose={() => { setOpen1(false) }}
      titulo="Compras que realizó esta persona"
    >
      <div className="flex">
        <DataTable value={comprasPersona.data} emptyMessage="Esta persona aún no compra nada"
          selectionMode="single" selection={selected2} onSelectionChange={e => { setSelected2(e.value); console.log(e.value) }}>
          <Column field="fecha" header="Fecha"></Column>
          <Column field="total" header="Total"></Column>
          <Column field="estado" header="Estado"></Column>
        </DataTable>
        <DataTable value={selected2?.DetallesVenta} emptyMessage="Selecciona un detalle para ver la lista">
          <Column field="cantidad" header="Cantidad"></Column>
          <Column field="precio" header="Precio"></Column>
          <Column field="descuento" header="Descuento"></Column>
          <Column field="producto.nombre" header="Nombre"></Column>
        </DataTable>
      </div>
    </Modal>
    <Topbar />
    <div className="flex flex-col m-4 justify-center">
      <div className="w-full flex gap-1 mb-2">
        <div className="p-inputgroup h-10">
          <span className="p-inputgroup-addon py-1">Nombres</span>
          <InputText className="p-inputtext-sm" placeholder="Pedrito" value={nombres} onChange={
            (e) => {
              setNombres(e.target.value);
            }
          } />
        </div>
        <div className="p-inputgroup h-10">
          <span className="p-inputgroup-addon">Apellidos</span>
          <InputText className="p-inputtext-sm" placeholder="Perez Pereira" value={apellidos} onChange={
            (e) => {
              setApellidos(e.target.value);
            }
          } />
        </div>
        <div className="p-inputgroup h-10">
          <span className="p-inputgroup-addon">CI</span>
          <InputText className="p-inputtext-sm" placeholder="45654" type={"number"} value={ci} onChange={
            (e) => {
              setCI(e.target.value);
            }
          } />
        </div>
        <div className="p-inputgroup h-10">
          <span className="p-inputgroup-addon">Telefono</span>
          <InputText className="p-inputtext-sm" placeholder="5464656" type={"number"} value={telefono} onChange={
            (e) => {
              setTelefono(e.target.value);
            }
          } />
        </div>
        <div className="p-inputgroup h-10">
          <span className="p-inputgroup-addon">Direccion</span>
          <InputText className="p-inputtext-sm" placeholder="Av. 20 de octubre" value={direccion} onChange={
            (e) => {
              setDireccion(e.target.value);
            }
          } />
        </div>


        <div className="p-inputgroup h-10">
          <span className="p-inputgroup-addon">Tipo</span>
          <Dropdown className="p-inputtext-sm" value={tipo} options={[{ name: "CLIENTE" }, { name: "PROVEEDOR" }]} onChange={(e) => { setTipo(e.value); console.log(tipo) }} optionLabel="name" placeholder="Tipo de persona" />
        </div>
        <div className="card">
          <h5>Estado</h5>
          <InputSwitch checked={estado} onChange={() => setEstado(!estado)} />
        </div>
        <button className={`p-2 ${accion === "Crear" ? "bg-green-500" : "bg-yellow-500"} text-white rounded-lg`}
          onClick={
            () => {
              if (accion.toLocaleLowerCase() == "crear") {
                crearPersona.mutate({
                  nombres,
                  apellidos,
                  ci,
                  direccion,
                  telefono,
                  estado,
                  tipo: tipo.name,
                })
              } else {
                editarPersona.mutate({
                  id,
                  nombres,
                  apellidos,
                  ci,
                  direccion,
                  telefono,
                  estado,
                  tipo: tipo.name,
                })
              }
            }
          }
        >{accion}</button>
      </div>
      {/* Tabla */}
      <div className="w-full">
        <div className="flex gap-2">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">Buscar</span>
            <InputText placeholder="Pedrito" value={search} onChange={
              (e) => {
                setSearch(e.target.value);
              }
            } />
          </div>
          <button className="p-2 bg-blue-500 text-white disabled:bg-gray-500" disabled={!seleccionado}
            onClick={() => {
              comprasPersona.refetch();
              setOpen1(true)
            }}
          >Ventas</button>
          <button className="p-2 bg-yellow-500 text-white disabled:bg-gray-500" disabled={!seleccionado} onClick={() => {
            adquisicionesPersona.refetch();
            setOpen2(true)
          }}>Adquisiciones</button>
        </div>
        <DataTable value={personas.data} emptyMessage="Sin personas" selectionMode="single" selection={seleccionado} onSelectionChange={e => { setSeleccionado(e.value); console.log(e.value) }} >
          <Column field="nombres" header="Nombres(opt)" />
          <Column field="apellidos" header="Apellidos" />
          <Column field="ci" header="Cedula" />
          <Column field="telefono" header="Telefono(opt)" />
          <Column field="direccion" header="Direccion(opt)" />
          <Column field="estado" header="Estado" body={(data) => {

            return data.estado ? <span className="text-green-500">Activo</span> : <span className="text-red-500">Inactivo</span>
          }} />
          <Column field="tipo" header="Tipo" />
        </DataTable>
      </div>
    </div>
  </>
}
export default Personas