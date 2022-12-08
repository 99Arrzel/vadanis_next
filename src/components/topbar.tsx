import { useRouter } from 'next/router';
import { Menubar } from 'primereact/menubar';
const Topbar = () => {
  const router = useRouter();
  return <>
    <Menubar model={[
      {
        label: 'Usuarios', command() {
          router.push('/dashboard/usuarios');
        },
      },
      {
        label: 'Personas', command() {
          router.push('/dashboard/personas');
        }
      },
      {
        label: 'Adquisiciones', command() {
          router.push('/dashboard/adquisiciones');
        }
      },
      {
        label: 'Ventas', command() {
          router.push('/dashboard/ventas');
        }
      },
      {
        label: 'Productos', command() {
          router.push('/dashboard/productos');
        }
      },
    ]} />
  </>
}
export default Topbar;