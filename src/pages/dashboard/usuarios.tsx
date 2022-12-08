import Topbar from '../../components/topbar';
import { trpc } from '../../utils/trpc';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { InputSwitch } from 'primereact/inputswitch';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { useSession } from 'next-auth/react';
import { Modal } from '../../components/Modal';


const UsuariosBoard = () => {
  const [accion, setAccion] = useState("Crear");
  const [seleccionado, setSeleccionado] = useState<any>(null);
  const [admin, setAdmin] = useState(false);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const usuarios = trpc.usuarios.getUsuarios.useQuery();
  const { data: sessionData } = useSession();
  const [modal, setModal] = useState(false);
  const ventasUsuario = trpc.usuarios.getVentas.useQuery({ id });
  const eliminarUsuario = trpc.usuarios.eliminarUsuario.useMutation(
    {
      onSuccess: () => {
        usuarios.refetch();
        Notify.success("Eliminado con éxito")
        setSeleccionado(null)
      },
      onError: (error) => {
        for (const i of JSON.parse(error.message)) {

          Notify.failure(`Error en: ${i.path.at(0)}, mensaje: ${i.message} `)
        }
      }
    }
  );
  const crearUsuario = trpc.usuarios.crearUsuario.useMutation({
    onSuccess: () => {
      usuarios.refetch();
      Notify.success("Guardado con éxito")
    },
    onError: (error) => {
      for (const i of JSON.parse(error.message)) {

        Notify.failure(`Error en: ${i.path.at(0)}, mensaje: ${i.message} `)
      }
    }
  });
  const editarUsuario = trpc.usuarios.editarUsuario.useMutation({
    onSuccess: () => {
      usuarios.refetch();
      Notify.success("Guardado con éxito")
      setSeleccionado(null)
    },
    onError: (error) => {
      for (const i of JSON.parse(error.message)) {

        Notify.failure(`Error en: ${i.path.at(0)}, mensaje: ${i.message} `)
      }
    }
  });
  useEffect(() => {
    if (seleccionado) { //Si es diferente de null
      setId(seleccionado.id);
      setNombre(seleccionado.name);
      setCorreo(seleccionado.email);
      setAccion("Editar")
      if (seleccionado.tipo == "USUARIO") {
        setAdmin(false)
      }
      else {
        setAdmin(true)
      }
    } else {
      setNombre("");
      setCorreo("");
      setPassword("");
      setAccion("Crear");
      setAdmin(false);
    }
  }, [seleccionado])
  return <>
    <Modal
      open={modal}
      titulo="Ventas del usuario"
      onClose={() => setModal(false)}
    >
      <DataTable value={ventasUsuario.data} emptyMessage="No tiene ventas">
        {/* Fecha, total y estado nomas */}
        <Column field='fecha' header="Fecha" />
        <Column field='total' header="Total" />
        <Column field='estado' header="Estado" />
      </DataTable>
    </Modal>
    <Topbar />
    <div className='flex sm:flex-row flex-col mx-4 gap-2'>
      <div className='basis-1/2'>
        <p className='text-center'>Lista de Usuarios</p>
        <div className='flex gap-2'>
          <button className='bg-red-500 p-2 text-white rounded-lg disabled:bg-gray-500'
            onClick={() => {
              if (sessionData?.user?.id == id) {
                Notify.failure("No podes editarte vos mismo");

                return;
              }
              eliminarUsuario.mutate({ id });
            }}

            disabled={!seleccionado}>Eliminar</button>
          <button className='bg-blue-500 p-2 text-white rounded-lg disabled:bg-gray-500'
            onClick={() => {
              ventasUsuario.refetch();
              setModal(true);
            }}

            disabled={!seleccionado}>Ver ventas</button>
        </div>
        <DataTable value={usuarios.data} selectionMode="single" selection={seleccionado} onSelectionChange={e => { setSeleccionado(e.value); console.log(e.value) }} >
          <Column field="id" header="ID"></Column>
          <Column field="name" header="Nombre"></Column>
          <Column field='email' header="Email"></Column>
          <Column field="tipo" header="Nivel"></Column>
        </DataTable>
      </div>
      <div className='basis-1/2 flex flex-col gap-2'>
        <p className='text-center'><strong>{accion}</strong> usuario</p>
        {/* Creamos usuario, necesitamos nombre, correo y contraseña */}

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">Nombre</span>
          <InputText placeholder="Andres" value={nombre} onChange={
            (e) => {
              setNombre(e.target.value);
            }
          } />
        </div>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">Correo</span>
          <InputText placeholder="nose@gmail.com" type={"email"} value={correo} onChange={
            (e) => {
              setCorreo(e.target.value);
            }
          } />
        </div>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">Password</span>
          <InputText type={"password"} value={password} onChange={
            (e) => {
              setPassword(e.target.value);
            }
          } />
        </div>

        <div>
          <div className="card">
            <h5>¿Admin?</h5>
            <InputSwitch checked={admin} onChange={() => setAdmin(!admin)} />
          </div>
        </div>
        {accion === "Crear" ? <button className='bg-green-500 p-2 text-white'
          onClick={
            () => {
              crearUsuario.mutate({
                nombre,
                password,
                email: correo,
                nivel: admin
              })
            }
          }

        >Crear</button> : <button className='bg-yellow-500 p-2 text-white'
          onClick={
            () => {
              console.log(sessionData)
              if (sessionData?.user?.id == id) {
                Notify.failure("No podes editarte vos mismo");
                return;
              }
              editarUsuario.mutate({
                id,
                nombre,
                password,
                email: correo,
                nivel: admin
              })
            }
          }
        >Editar</button>}

      </div>
    </div>
  </>
}
export default UsuariosBoard;
