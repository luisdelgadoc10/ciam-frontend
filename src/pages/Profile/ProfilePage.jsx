import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import InputField from "../../components/ui/InputField";
import { Save, KeyRound, UserRound, Eye, EyeOff } from "lucide-react";

export default function ProfilePage() {
  const { user, token, setUser } = useAuth();

  const [form, setForm] = useState({
    nombre: user?.nombre || "",
    apellido: user?.apellido || "",
    fecha_de_nacimiento: user?.fecha_de_nacimiento || "",
    usuario: user?.usuario || "",
    email: user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passErrors, setPassErrors] = useState({});
  const [tab, setTab] = useState("perfil");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Alertas
  const [alert, setAlert] = useState({ message: "", type: "" });
  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  // ---------------------- PERFIL ----------------------
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await axios.put(
        "https://ciam.api.munimoche.gob.pe/api/profile",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showAlert("Perfil actualizado correctamente", "success");
    } catch (error) {
      console.log(error);
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        showAlert("Revisa los campos. Hay datos inválidos.", "error");
      } else {
        showAlert("Error del servidor.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------------- CONTRASEÑA ----------------------
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    setPassErrors({});

    try {
      await axios.post(
        "https://ciam.api.munimoche.gob.pe/api/change-password",
        passwordForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      showAlert("Contraseña actualizada correctamente", "success");
    } catch (error) {
      console.log(error);
      if (error.response?.status === 422) {
        setPassErrors(error.response.data.errors || {});
        showAlert("Datos inválidos. Revisa las contraseñas.", "error");
      } else {
        showAlert("Error del servidor.", "error");
      }
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn relative">
      {/* ALERT */}
      {alert.message && (
        <div
          className={`fixed top-4 right-4 px-5 py-3 rounded-lg shadow-md z-50 text-white font-medium transition-all
          ${alert.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {alert.message}
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <UserRound className="w-10 h-10 text-blue-700" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
          <p className="text-gray-600 text-sm">
            Configura tu información personal y seguridad de tu cuenta.
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-3 border-b border-gray-200">
        {[
          { id: "perfil", label: "Información Personal", icon: Save },
          { id: "password", label: "Contraseña", icon: KeyRound },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition
              ${
                tab === item.id
                  ? "text-blue-700 border-b-2 border-blue-700 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
        {/* PERFIL */}
        {tab === "perfil" && (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                error={errors.nombre?.[0]}
              />
              <InputField
                label="Apellido"
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                error={errors.apellido?.[0]}
              />
              <InputField
                label="Usuario"
                value={form.usuario}
                onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                error={errors.usuario?.[0]}
              />
              <InputField
                label="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={errors.email?.[0]}
              />
              <InputField
                label="Fecha de nacimiento"
                type="date"
                value={form.fecha_de_nacimiento}
                onChange={(e) =>
                  setForm({ ...form, fecha_de_nacimiento: e.target.value })
                }
                error={errors.fecha_de_nacimiento?.[0]}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </form>
        )}

        {/* CONTRASEÑA */}
        {tab === "password" && (
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Contraseña actual */}
              <div className="relative">
                <InputField
                  label="Contraseña actual"
                  type={showCurrent ? "text" : "password"}
                  value={passwordForm.current_password}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      current_password: e.target.value,
                    })
                  }
                  error={passErrors.current_password?.[0]}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute top-10 right-3 text-gray-500"
                >
                  {showCurrent ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Nueva contraseña */}
              <div className="relative">
                <InputField
                  label="Nueva contraseña"
                  type={showNew ? "text" : "password"}
                  value={passwordForm.password}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      password: e.target.value,
                    })
                  }
                  error={passErrors.password?.[0]}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute top-10 right-3 text-gray-500"
                >
                  {showNew ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Confirmar contraseña */}
              <div className="relative">
                <InputField
                  label="Confirmar contraseña"
                  type={showConfirm ? "text" : "password"}
                  value={passwordForm.password_confirmation}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      password_confirmation: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute top-10 right-3 text-gray-500"
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={passLoading}
              className="px-5 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
            >
              {passLoading ? "Actualizando..." : "Cambiar Contraseña"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
