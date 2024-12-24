"use client";
import Link from "next/link";
import { useGetDataSekolah } from "@/hook/useGet";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function SekolahPage() {
  const {
    dataSekolah,
    posisiList,
    kelasList,
    posisi,
    kelas,
    setPosisi,
    setKelas,
    setRefreshKey,
  } = useGetDataSekolah();

  const GetPage = usePathname();
  const BaseUrl = `${GetPage}`;
  const router = useRouter();

  const handleEditClick = async (id: string) => {
    const url = `${BaseUrl}/update/${id}`;
    router.push(url);
  };

  const handleDelete = async (id: string, Nama: string, Posisi: string) => {
    const session = await getSession();
    if (!session || !session.accessToken) {
      throw new Error(
        "User is not authenticated or session is missing accessToken"
      );
    }

    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: `Apakah Anda yakin ingin menghapus Data ${Posisi} dengan Nama ${Nama}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/deleteDataSekolah/${id}/`;
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        const success = await response.json();

        if (response.ok) {
          toast.success(success.message, {
            onClose: () => {
              setRefreshKey((prevKey) => prevKey + 1);
            },
          });
        } else {
          toast.error("Gagal menghapus struktur sekolah.");
        }
      } catch (error) {
        console.error("Error deleting struktur sekolah:", error);
        toast.error("Gagal menghapus struktur sekolah.");
      }
    }
  };

  return (
    <>
      <div className="w-full bg-white rounded-2xl shadow-md">
        <div className="p-6">
          <div className="w-full flex justify-center mb-4">
            <h1 className="text-gray-900 text-lg font-semibold">
              Tabel Struktur Sekolah
            </h1>
          </div>
          <div className="header">
            <div className="w-full flex justify-between mb-4 items-center">
              <div className="sortir flex gap-4">
                <select
                  name="sortByPosisi"
                  id="sortByPosisi"
                  className="p-2 border rounded-lg bg-[#3a3086] text-white"
                  value={posisi}
                  onChange={(e) => setPosisi(e.target.value)}
                >
                  <option value="">Sort By Posisi</option>
                  {posisiList.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
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
                  {kelasList
                    .filter((item) => item !== "")
                    .map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
              <div className="add">
                <Link
                  href={`${BaseUrl}/add-akun`}
                  className="p-2 border rounded-lg bg-[#3a3086] text-white"
                >
                  Add Struktur
                </Link>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-gray-600">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-medium">
                <tr>
                  <th className="px-6 py-3 border-b border-gray-300 text-center">
                    No
                  </th>
                  <th className="px-6 py-3 border-b border-gray-300 text-center">
                    Nama
                  </th>
                  <th className="px-6 py-3 border-b border-gray-300 text-center">
                    NIP
                  </th>
                  <th className="px-6 py-3 border-b border-gray-300 text-center">
                    NUPTK
                  </th>
                  <th className="px-6 py-3 border-b border-gray-300 text-center">
                    Posisi
                  </th>
                  <th className="px-6 py-3 border-b border-gray-300 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto max-h-[400px]">
                {dataSekolah.map((item, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="px-6 py-3 text-center font-semibold text-lg">
                      {index + 1}
                    </td>
                    <td className="px-6 py-3 text-center font-semibold text-lg">
                      {item.Nama}
                    </td>
                    <td className="px-6 py-3 text-center font-semibold text-lg">
                      {item.Nip}
                    </td>
                    <td className="px-6 py-3 text-center font-semibold text-lg">
                      {item.Nuptk}
                    </td>
                    <td className="px-6 py-3 text-center font-semibold text-lg">
                      {item.Posisi}
                    </td>
                    <td className="px-6 py-3 text-center font-semibold text-lg space-x-6">
                      <button
                        onClick={() =>
                          handleDelete(item.id, item.Nama, item.Posisi)
                        }
                        className="p-2 bg-red-500 text-white rounded-lg"
                      >
                        Delete
                      </button>
                      <button
                        className="p-2 bg-blue-500 text-white rounded-lg"
                        onClick={() => handleEditClick(item.id)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
