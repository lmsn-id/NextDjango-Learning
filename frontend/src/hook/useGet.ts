import { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface SiswaAdmin {
  id: string;
  Nama: string;
  Nis: string;
  Jurusan: string;
  Kelas: string;
}

interface StrukturSekolah {
  id: string;
  Nuptk: string;
  Nip: string;
  Nama: string;
  Posisi: string;
  Kelas: string;
}

export const useGetDataSiswa = () => {
  const [siswaData, setSiswaData] = useState<SiswaAdmin[]>([]);
  const [jurusanList, setJurusanList] = useState<string[]>([]);
  const [kelasList, setKelasList] = useState<string[]>([]);
  const [jurusan, setJurusan] = useState("");
  const [kelas, setKelas] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(38);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchWithAuth = async (endpoint: string) => {
    const session = await getSession();
    if (!session || !session.accessToken) {
      throw new Error(
        "User is not authenticated or session is missing accessToken"
      );
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`;
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
            "GetAlldataSiswa?unique=true"
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
          `GetAlldataSiswa?jurusan=${jurusan}&kelas=${kelas}`
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
  }, [jurusan, kelas, jurusanList.length, kelasList.length, refreshKey]);

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
    setRefreshKey,
  };
};

export const useGetDataLearning = () => {
  const [FormSiswa, setFormSiswa] = useState({
    Nis: "",
    Nama: "",
    Jurusan: "",
    Kelas: "",
  });

  const { data: session } = useSession();
  const username = session?.user?.username;

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;

      try {
        const session = await getSession();

        if (!session || !session.accessToken) {
          throw new Error(
            "User is not authenticated or session is missing accessToken"
          );
        }
        const url = `${process.env.NEXT_PUBLIC_API_URL}/GetDataElearning/${username}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setFormSiswa(result.data);
        } else {
          toast.error("Error fetching data");
        }
      } catch {
        toast.error("Error fetching data");
      }
    };

    fetchData();
  }, [username]);

  return {
    FormSiswa,
  };
};
export const useGetDataAkademik = () => {
  const [dataSekolah, setDataSekolah] = useState<StrukturSekolah[]>([]);
  const [posisiList, setPosisiList] = useState<string[]>([]);
  const [kelasList, setKelasList] = useState<string[]>([]);
  const [posisi, setPosisi] = useState("");
  const [kelas, setKelas] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchWithAuth = async (endpoint: string) => {
    const session = await getSession();
    if (!session || !session.accessToken) {
      throw new Error(
        "User is not authenticated or session is missing accessToken"
      );
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`;
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
        if (posisiList.length === 0 || kelasList.length === 0) {
          const { posisi, kelas } = await fetchWithAuth(
            "GetAllDataAkademik?unique=true"
          );
          setPosisiList(posisi.sort());
          setKelasList(kelas.sort());
        }

        const dataSekolah = await fetchWithAuth(
          `GetAllDataAkademik?posisi=${posisi}&kelas=${kelas}`
        );
        setDataSekolah(dataSekolah);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [posisi, kelas, posisiList.length, kelasList.length, refreshKey]);

  return {
    dataSekolah,
    posisiList,
    kelasList,
    posisi,
    kelas,
    setPosisi,
    setKelas,
    setRefreshKey,
  };
};
