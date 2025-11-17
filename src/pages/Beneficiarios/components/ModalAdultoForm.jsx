import React from "react";
import {
  Save,
  UserRound,
  Calendar,
  MapPin,
  Phone,
  HeartHandshake,
} from "lucide-react";
import ModalBase from "../../../components/ui/ModalBase";
import InputField from "../../../components/ui/InputField";
import SelectField from "../../../components/ui/SelectField";

export default function ModalAdultoForm({
  show,
  onClose,
  modo = "crear",
  formData = {},
  errors = {},
  sexos = [],
  estadosCiviles = [],
  parentescos = [],
  onChange,
  onSubmit,
  loading = false,
}) {
  const isEdit = modo === "editar";
  const [previewImage, setPreviewImage] = React.useState(null);
  const [hasNewImage, setHasNewImage] = React.useState(false);

  React.useEffect(() => {
    if (!show) {
      setPreviewImage(null);
      setHasNewImage(false);
      return;
    }
    if (!hasNewImage) {
      setPreviewImage(formData.foto_url || null);
    }
  }, [show, hasNewImage, formData.foto_url]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date) ? "" : date.toISOString().split("T")[0];
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setHasNewImage(false);
      setPreviewImage(formData.foto_url || null);
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setHasNewImage(true);
    onChange({
      target: { name: "foto", files: [file] },
    });
    return () => URL.revokeObjectURL(previewUrl);
  };

  const renderFooter = () => (
    <>
      <button
        type="button"
        onClick={onClose}
        className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-300 transition"
      >
        Cancelar
      </button>
      <button
        type="submit"
        onClick={onSubmit}
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-xl shadow hover:bg-blue-800 transition disabled:opacity-50"
      >
        <Save className="w-5 h-5" />
        {loading ? "Guardando..." : isEdit ? "Actualizar" : "Registrar"}
      </button>
    </>
  );

  return (
    <ModalBase
      show={show}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <UserRound className="w-6 h-6 text-blue-600" />
          {isEdit
            ? `Editar Adulto Mayor: ${formData?.nombres || ""}`
            : "Registrar Adulto Mayor"}
        </span>
      }
      width="max-w-4xl"
      footer={
        <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3 bg-white/80 dark:bg-slate-900/80 rounded-b-2xl">
          {renderFooter()}
        </div>
      }
    >
      <div className="space-y-8">
        {/* Datos personales con foto a la izquierda */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <UserRound className="w-5 h-5 text-blue-600" />
            Datos Personales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
            {/* ——— FOTO: Estilo carnet (140×190 px, proporción 3:4) ——— */}
            <div className="flex flex-col items-center justify-start gap-4">
              {/* Contenedor de foto estilo carnet */}
              <div className="w-36 h-48 flex items-center justify-center bg-gray-50 dark:bg-slate-700 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden shadow-sm">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Foto carnet"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center px-2">
                    <UserRound className="w-8 h-8 mx-auto text-gray-400 dark:text-gray-500 mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Foto carnet
                      <br />
                      (3×4 cm)
                    </p>
                  </div>
                )}
              </div>

              {/* Input de archivo */}
              <input
                type="file"
                name="foto"
                accept="image/*"
                onChange={handleFotoChange}
                className={`block w-full text-xs text-gray-700 dark:text-gray-300 
          file:mr-3 file:py-1.5 file:px-3 
          file:rounded-md file:border file:border-gray-300 
          file:text-xs file:font-medium 
          file:bg-gray-100 file:text-gray-800 
          hover:file:bg-gray-200
          dark:file:bg-slate-700 dark:file:text-gray-200 dark:hover:file:bg-slate-600
          ${errors.foto ? "border-red-500" : "border-gray-300"}
          rounded-md cursor-pointer`}
              />

              {hasNewImage && (
                <span className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                  ✓ Nueva imagen
                </span>
              )}
              {errors.foto && (
                <p className="text-red-500 text-xs mt-1">{errors.foto}</p>
              )}
            </div>

            {/* ——— CAMPOS: derecha de la foto ——— */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Nombres"
                name="nombres"
                value={formData.nombres || ""}
                onChange={onChange}
                required
                error={errors.nombres}
              />
              <InputField
                label="Apellidos"
                name="apellidos"
                value={formData.apellidos || ""}
                onChange={onChange}
                required
                error={errors.apellidos}
              />
              <InputField
                label="DNI"
                name="dni"
                value={formData.dni || ""}
                onChange={onChange}
                maxLength={8}
                required
                error={errors.dni}
                disabled={modo === "editar"}
                className={
                  modo === "editar"
                    ? "bg-gray-100 dark:bg-slate-700 cursor-not-allowed"
                    : ""
                }
              />
              <InputField
                label="Fecha de Nacimiento"
                type="date"
                name="fecha_nacimiento"
                value={formatDateForInput(formData.fecha_nacimiento)}
                onChange={onChange}
                required
                icon={<Calendar className="w-4 h-4 text-blue-600" />}
                error={errors.fecha_nacimiento}
              />
              <SelectField
                label="Sexo"
                name="sexo_id"
                value={formData.sexo_id || ""}
                onChange={onChange}
                options={sexos}
                required
                error={errors.sexo_id}
              />
              <SelectField
                label="Estado Civil"
                name="estado_civil_id"
                value={formData.estado_civil_id || ""}
                onChange={onChange}
                options={estadosCiviles}
                required
                error={errors.estado_civil_id}
              />
              <InputField
                label="Dirección"
                name="direccion"
                value={formData.direccion || ""}
                onChange={onChange}
                required
                icon={<MapPin className="w-4 h-4 text-blue-600" />}
                className="md:col-span-2"
                error={errors.direccion}
              />
              <InputField
                label="Celular"
                name="celular"
                value={formData.celular || ""}
                onChange={onChange}
                maxLength={9}
                required
                icon={<Phone className="w-4 h-4 text-blue-600" />}
                error={errors.celular}
              />
            </div>
          </div>
        </section>

        {/* Contacto de emergencia */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-red-500" />
            Contacto de Emergencia
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <InputField
              label="Nombres"
              name="contacto_emergencia_nombres"
              value={formData.contacto_emergencia_nombres || ""}
              onChange={onChange}
              required
              error={errors.contacto_emergencia_nombres}
            />
            <InputField
              label="Apellidos"
              name="contacto_emergencia_apellidos"
              value={formData.contacto_emergencia_apellidos || ""}
              onChange={onChange}
              required
              error={errors.contacto_emergencia_apellidos}
            />
            <InputField
              label="Teléfono"
              name="contacto_emergencia_telefono"
              value={formData.contacto_emergencia_telefono || ""}
              onChange={onChange}
              required
              maxLength={9}
              error={errors.contacto_emergencia_telefono}
            />
            <SelectField
              label="Parentesco"
              name="parentesco_id"
              value={formData.parentesco_id || ""}
              onChange={onChange}
              options={parentescos}
              required
              error={errors.parentesco_id}
            />
          </div>
        </section>
      </div>
    </ModalBase>
  );
}
