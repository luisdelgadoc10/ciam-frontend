import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LockKeyhole, UserRound } from "lucide-react";
import Button from "./ui/ButtonLogin";
import Input from "./ui/InputLogin";
import loginImage from "../images/plaza.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      let errorMessage = "Error al iniciar sesión";

      if (err.response) {
        const { status, data } = err.response;
        if (status === 401)
          errorMessage = data?.message || "Credenciales incorrectas.";
        else if (status === 403)
          errorMessage = data?.message || "Usuario inactivo. Contacte al administrador.";
        else if (data?.message) errorMessage = data.message;
      } else if (err.request)
        errorMessage = "Error de conexión. Verifique su conexión a internet.";
      else errorMessage = err.message || "Error inesperado";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* 🔹 Izquierda: Imagen ilustrativa */}
      <div className="hidden md:flex md:w-1/2 relative">
        <img
          src={loginImage}
          alt="Login ilustrativo"
          className="w-full h-full object-cover brightness-90"
        />
      </div>

      {/* 🔹 Derecha: Formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 text-center bg-blue-700 text-white rounded-t-2xl">
              <div className="flex justify-center mb-2">
                <LockKeyhole className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold">Panel Administrativo</h2>
              <p className="text-sm opacity-90">
                Inicia sesión para continuar
              </p>
            </div>

            {/* Formulario */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium text-center">
                    {error}
                  </div>
                )}

                <Input
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  placeholder="ejemplo@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  highlightLabel
                />

                <Input
                  label="Contraseña"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  highlightLabel
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <UserRound className="w-5 h-5" />
                  {isLoading ? "Ingresando..." : "Ingresar"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
