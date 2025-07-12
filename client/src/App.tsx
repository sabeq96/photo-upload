import beaver from "./assets/beaver.svg";
import { usePocketbase } from "./hooks/usePocketbase";

function App() {
  const { pb, login } = usePocketbase();

  async function sendLogin() {
    await login("test@test.com", "testtest");
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen">
      <a href="https://github.com/stevedylandev/bhvr" target="_blank">
        <img
          src={beaver}
          className="w-16 h-16 cursor-pointer"
          alt="beaver logo"
        />
      </a>
      <h1 className="text-5xl font-black">bhvr</h1>
      <h2 className="text-2xl font-bold">Bun + Hono + Vite + React</h2>
      <p>A typesafe fullstack monorepo</p>
      <div className="flex items-center gap-4">
        <button
          onClick={sendLogin}
          className="bg-black text-white px-2.5 py-1.5 rounded-md"
        >
          Call Login API
        </button>
      </div>
    </div>
  );
}

export default App;
