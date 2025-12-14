import HomeClient from "@/components/home-client";
import { getServerAuth } from "@/lib/auth/server";


export default async  function Home() {

  // // fetch some random promise
  // // just using delayed promise
  // const auth = await getServerAuth();
  // console.log("Home page auth:", auth);

  return <HomeClient />;
}
