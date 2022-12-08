import bcrypt from "bcrypt";

export async function  getServerSideProps({ query }: { query: any }) {
  const que = query.que;
//Ejemplo http://localhost:3000/hash?que=123
  return {
    props: {
      val: bcrypt.hashSync(que, 10) //Responde con el hash
    },
  };
}

const hash = ({val}: {val:string}) => {
  return <>
    <p>{val}</p>
  </>

}
export default hash;