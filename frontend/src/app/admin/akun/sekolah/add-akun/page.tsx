"use client";
import { AddAkunStrukturSekolah } from "@/hook/usePost";
export default function AddAkunSekolah() {
  const {
    FormData,
    posisi,
    materiList,
    handleChange,
    handleSubmit,
    setPosisi,
    handleAddMateri,
    handleMateriChange,
    setFormData,
  } = AddAkunStrukturSekolah();

  return (
    <>
      <div className="w-full h-full bg-white rounded-2xl shadow-md">
        <div className="p-6 max-h-full overflow-y-auto">
          <div className="w-full flex justify-center mb-4">
            <h1 className="text-gray-900 text-lg font-semibold">
              Add Akun Sekolah
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="Nuptk"
              >
                NUPTK
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="Nuptk"
                type="text"
                placeholder="Masukan NUPTK"
                name="Nuptk"
                value={FormData.Nuptk || ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="Nip"
              >
                NIP
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="Nip"
                type="text"
                placeholder="Masukan NIP"
                name="Nip"
                value={FormData.Nip || ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="Nama"
              >
                Nama
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="Nama"
                type="text"
                placeholder="Masukan Nama"
                name="Nama"
                value={FormData.Nama || ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="Posisi"
              >
                Posisi
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="Posisi"
                name="Posisi"
                value={posisi}
                onChange={(e) => setPosisi(e.target.value)}
              >
                <option value="" disabled>
                  Pilih Posisi
                </option>
                <option value="Guru">Guru</option>
                <option value="Staff">Staff</option>
                <option value="Tata Usaha">Tata Usaha</option>
                <option value="Wakil Kepala Sekolah">
                  Wakil Kepala Sekolah
                </option>
                <option value="Kepala Sekolah">Kepala Sekolah</option>
              </select>
            </div>

            {posisi === "Guru" && (
              <>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="Kelas"
                  >
                    Kelas
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="Kelas"
                    type="text"
                    placeholder="Masukan Kelas"
                    name="Kelas"
                    value={FormData.Kelas || ""}
                    onChange={handleChange}
                  />
                </div>

                {materiList.map((materi, index) => (
                  <div className="mb-4 " key={index}>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor={`Materi-${index}`}
                    >
                      Materi {index + 1}
                    </label>
                    <div className="flex items-center space-x-10">
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id={`Materi-${index}`}
                        type="text"
                        placeholder={`Masukan Materi ${index + 1}`}
                        name="Materi"
                        value={materi}
                        onChange={(e) =>
                          handleMateriChange(index, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded flex-shrink-0"
                        onClick={handleAddMateri}
                      >
                        Add Materi
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}

            <div className="w-full flex justify-end space-x-8">
              <button
                type="reset"
                className="bg-red-500 hover:bg-red-700 rounded-lg shadow-md px-4 py-2 text-white font-semibold"
                onClick={() => {
                  setFormData({
                    Nuptk: "",
                    Nip: "",
                    Nama: "",
                    Posisi: "",
                    Kelas: "",
                    Materi: [],
                  });
                }}
              >
                Reset
              </button>
              <button
                type="submit"
                className="bg-[#3a3086] hover:bg-[#0095da] rounded-lg shadow-md px-4 py-2 text-white font-semibold"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
