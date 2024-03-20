import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center flex-col gap-2">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <h4 className="text-4xl font-bold">404</h4>

      <div className="underline font-semibold text-lg">
        <Link to={"/"}>Volver al incio</Link>
      </div>
    </div>
  );
};
