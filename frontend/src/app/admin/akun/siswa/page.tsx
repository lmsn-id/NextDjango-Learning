"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetDataSiswa } from "@/hook/useGet";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function SiswaPage() {
  const {
    jurusanList,
    kelasList,
    jurusan,
    kelas,
    currentPage,
    setJurusan,
    setKelas,
    setCurrentPage,
    currentItems,
    totalPages,
    setRefreshKey,
  } = useGetDataSiswa();

  const GetPage = usePathname();
  const BaseUrl = `${GetPage}`;
  const router = useRouter();

  const handleEditClick = async (Nis: string) => {
    const url = `${BaseUrl}/update/${Nis}`;
    router.push(url);
  };

  const handleDelete = async (Nis: string, Nama: string) => {
    const session = await getSession();
    if (!session || !session.accessToken) {
      throw new Error(
        "User  is not authenticated or session is missing accessToken"
      );
    }

    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: `Apakah Anda yakin ingin menghapus Data Siswa dengan Nis ${Nis} Nama ${Nama}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/deleteSiswa/${Nis}/`;
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (response.ok) {
          toast.success("Data siswa berhasil dihapus", {
            onClose: () => {
              setRefreshKey((prevKey) => prevKey + 1);
            },
          });
        } else {
          const data = await response.json();
          toast.error(data.error || "Gagal menghapus data siswa");
        }
      } catch (error) {
        console.error("Error deleting data:", error);
        toast.error("Terjadi kesalahan saat menghapus data siswa");
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md">
      <div className="p-6">
        <div className="w-full flex justify-center mb-4">
          <h1 className="text-gray-900 text-lg font-semibold">
            Tabel Akun Siswa
          </h1>
        </div>
        <div className="header">
          <div className="w-full flex justify-between mb-4 items-center">
            <div className="sortir flex gap-4">
              <select
                name="sortByJurusan"
                id="sortByJurusan"
                className="p-2 border rounded-lg bg-[#3a3086] text-white"
                value={jurusan}
                onChange={(e) => setJurusan(e.target.value)}
              >
                <option value="">Sort By Jurusan</option>
                {jurusanList.map((jurusanItem, index) => (
                  <option key={index} value={jurusanItem}>
                    {jurusanItem}
                  </option>
                ))}
              </select>

              <select
                name="sortByKelas"
                id="sortByKelas"
                className="p-2 border rounded-lg bg-[#3a3086] text-white"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
              >
                <option value="">Sort By Kelas</option>
                {kelasList.map((kelasItem, index) => (
                  <option key={index} value={kelasItem}>
                    {kelasItem}
                  </option>
                ))}
              </select>
            </div>
            <div className="add">
              <Link
                href={`${BaseUrl}/add-siswa`}
                className="p-2 border rounded-lg bg-[#3a3086] text-white"
              >
                Add Siswa
              </Link>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-medium">
              <tr>
                <th className="px-6 py-3 border-b border-gray-300 text-center text-lg">
                  No
                </th>
                <th className="px-6 py-3 border-b border-gray-300 text-center text-lg">
                  Nama
                </th>
                <th className="px-6 py-3 border-b border-gray-300 text-center text-lg">
                  Nis
                </th>
                <th className="px-6 py-3 border-b border-gray-300 text-center text-lg">
                  Jurusan{" "}
                </th>
                <th className="px-6 py-3 border-b border-gray-300 text-center text-lg">
                  Kelas
                </th>
                <th className="px-6 py-3 border-b border-gray-300 flex justify-center text-lg">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="overflow-y-auto max-h-[400px]">
              {currentItems.map((siswa, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="px-6 py-3 text-center font-semibold text-lg">
                    {index + 1}
                  </td>
                  <td className="px-6 py-3 text-center font-semibold text-lg">
                    {siswa.Nama}
                  </td>
                  <td className="px-6 py-3 text-center font-semibold text-lg">
                    {siswa.Nis}
                  </td>
                  <td className="px-6 py-3 text-center font-semibold text-lg">
                    {siswa.Jurusan}
                  </td>
                  <td className="px-6 py-3 text-center font-semibold text-lg">
                    {siswa.Kelas}
                  </td>
                  <td className="px-6 py-3 text-center font-semibold text-lg space-x-6">
                    <button
                      onClick={() => handleDelete(siswa.Nis, siswa.Nama)}
                      className="p-2 bg-red-500 text-white rounded-lg"
                    >
                      Hapus
                    </button>
                    <button
                      onClick={() => handleEditClick(siswa.Nis)}
                      className="p-2 bg-blue-500 text-white rounded-lg"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-blue-500 text-white rounded-lg"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2 bg-blue-500 text-white rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
