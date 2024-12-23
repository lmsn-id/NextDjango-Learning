import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

export const AddAkunSiswa = () => {
  const [FormData, setFormData] = useState({
    Nis: "",
    Nama: "",
    Jurusan: "",
    Kelas: "",
  });

  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...FormData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !FormData.Nis ||
      !FormData.Nama ||
      !FormData.Jurusan ||
      !FormData.Kelas
    ) {
      toast.error("Tolong Masukkan NIS, Nama, Jurusan, dan Kelas");
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/addSiswa/`;

      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("Session invalid or missing access token");
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(FormData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Siswa Berhasil Ditambahkan", {
          onClose: () => {
            router.push(data.redirect);
          },
        });
      } else {
        toast.error(data.message || "Siswa Gagal Ditambahkan");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Terjadi kesalahan saat menghubungi server");
    }
  };

  return {
    FormData,
    handleChange,
    handleSubmit,
  };
};

export const AddAkunStrukturSekolah = () => {
  const router = useRouter();
  const [posisi, setPosisi] = useState("");
  const [materiList, setMateriList] = useState([""]);
  const [FormData, setFormData] = useState({
    Nuptk: "",
    Nip: "",
    Nama: "",
    Posisi: "",
    Kelas: "",
    Materi: [],
  });

  const handleAddMateri = () => {
    setMateriList([...materiList, ""]);
  };

  const handleMateriChange = (index: number, value: string) => {
    const updatedMateriList = [...materiList];
    updatedMateriList[index] = value;
    setMateriList(updatedMateriList);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...FormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalData = { ...FormData, Posisi: posisi, Materi: materiList };

    if (!FormData.Nuptk && !FormData.Nip) {
      toast.info("NUPTK Atau NIP tidak boleh kosong");
      return;
    }

    if (!FormData.Nama || !finalData.Posisi) {
      toast.info("Data tidak boleh kosong");
      return;
    }

    if (posisi === "Guru" && materiList.some((materi) => !materi)) {
      toast.info("Materi wajib diisi!");
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/addSekolah/`;

      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("Session invalid or missing access token");
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(finalData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Akun Sekolah Berhasil Ditambahkan", {
          onClose: () => {
            router.push(data.redirect);
          },
        });
      } else {
        toast.error(data.message || "Akun Sekolah Gagal Ditambahkan");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    FormData,
    setFormData,
    posisi,
    setPosisi,
    materiList,
    setMateriList,
    handleAddMateri,
    handleMateriChange,
    handleChange,
    handleSubmit,
  };
};
