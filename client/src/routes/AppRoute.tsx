import { usePocketbase } from "../hooks/usePocketbase";

export function AppRoute() {
  const { pb, login } = usePocketbase();

  return <div>ok</div>;
}
