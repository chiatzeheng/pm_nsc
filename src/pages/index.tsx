import { useGlobalContext } from "@/context";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { isAuth } = useGlobalContext();
  const router = useRouter();
  if (isAuth) {
    router.replace("/dashboard").catch(console.error);
  } else {
    router.replace("/authenticate").catch(console.error);
  }
  return (
    <>
      <Head>
        <title>PracticeMe - Home</title>
        <meta
          name="description"
          content="PracticeMe - A platform for the FOP module for Singapore Polytechnic"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

export default Home;
