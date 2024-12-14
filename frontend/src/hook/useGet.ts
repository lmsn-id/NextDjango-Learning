// src/hook/useGetDataSiswa.ts
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { api } from "@/hook/api";

interface Siswa {
  Nama: string;
  Nis: string;
  Jurusan: string;
  Kelas: string;
}

export const useGetDataSiswa = () => {
  const [siswaData, setSiswaData] = useState<Siswa[]>([]);
  const [jurusanList, setJurusanList] = useState<string[]>([]);
  const [kelasList, setKelasList] = useState<string[]>([]);
  const [jurusan, setJurusan] = useState("");
  const [kelas, setKelas] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(38);

  const fetchWithAuth = async (endpoint: string) => {
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
  };

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

        const sortedSiswaData = siswaData.sort(
          (
            a: { Jurusan: string; Kelas: string; Nama: string },
            b: { Jurusan: string; Kelas: string; Nama: string }
          ) => {
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
          }
        );

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

  return {
    siswaData,
    jurusanList,
    kelasList,
    jurusan,
    kelas,
    currentPage,
    itemsPerPage,
    setJurusan,
    setKelas,
    setCurrentPage,
    currentItems,
    totalPages,
  };
};
