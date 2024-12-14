"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/hook/api";
import { getSession } from "next-auth/react";

interface Siswa {
  Nama: string;
  Nis: string;
  Jurusan: string;
  Kelas: string;
}

async function fetchWithAuth(endpoint: string) {
  const session = await getSession();
  if (!session || !session.accessToken) {
    throw new Error(
      "User is not authenticated or session is missing accessToken"
    );
  }
  const { ApiBackend } = api();
  const url = ApiBackend(endpoint);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return await response.json();
}

export default function SiswaPage() {
  const [siswaData, setSiswaData] = useState<Siswa[]>([]);
  const [jurusanList, setJurusanList] = useState<string[]>([]);
  const [kelasList, setKelasList] = useState<string[]>([]);
  const [jurusan, setJurusan] = useState("");
  const [kelas, setKelas] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(38);

  const GetPage = usePathname();
  const BaseUrl = `${GetPage}`;

  useEffect(() => {
    async function fetchData() {
      try {
        if (jurusanList.length === 0 || kelasList.length === 0) {
          const { jurusan, kelas } = await fetchWithAuth(
            "api/auth/GetdataSiswa?unique=true"
          );

          const sortedJurusan = jurusan.sort((a: string, b: string) =>
            a.localeCompare(b)
          );
          setJurusanList(sortedJurusan);

          const sortedKelas = kelas.sort((a: string, b: string) => {
            const kelasA = a.match(/([A-Za-z]+) (\d+)/);
            const kelasB = b.match(/([A-Za-z]+) (\d+)/);
            if (kelasA && kelasB) {
              const jurusanA = kelasA[1];
              const jurusanB = kelasB[1];
              if (jurusanA !== jurusanB) {
                return jurusanA.localeCompare(jurusanB);
              }
              const kelasNomorA = parseInt(kelasA[2], 10);
              const kelasNomorB = parseInt(kelasB[2], 10);
              return kelasNomorA - kelasNomorB;
            }
            return 0;
          });
          setKelasList(sortedKelas);
        }

        const siswaData = await fetchWithAuth(
          `api/auth/GetdataSiswa?jurusan=${jurusan}&kelas=${kelas}`
        );

        const sortedSiswaData = siswaData.sort((a: Siswa, b: Siswa) => {
          const jurusanA = a.Jurusan.split(" ")[0];
          const jurusanB = b.Jurusan.split(" ")[0];

          if (jurusanA !== jurusanB) {
            return jurusanA.localeCompare(b.Jurusan);
          }

          const kelasA = a.Kelas.match(/(\d+)/);
          const kelasB = b.Kelas.match(/(\d+)/);

          if (kelasA && kelasB) {
            const kelasNomorA = parseInt(kelasA[0], 10);
            const kelasNomorB = parseInt(kelasB[0], 10);
            if (kelasNomorA !== kelasNomorB) {
              return kelasNomorA - kelasNomorB;
            }
          }

          return a.Nama.localeCompare(b.Nama);
        });

        setSiswaData(sortedSiswaData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [jurusan, kelas, jurusanList.length, kelasList.length]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = siswaData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(siswaData.length / itemsPerPage);

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
                    <button className="p-2 bg-red-500 text-white rounded-lg">
                      Hapus
                    </button>
                    <Link
                      href={`/update-siswa/${siswa.Nis}`}
                      className="p-2 bg-blue-500 text-white rounded-lg"
                    >
                      Edit
                    </Link>
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
