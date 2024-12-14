import { useState } from "react";
import { api } from "./api";
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
      const { ApiBackend } = api();
      const addSiswaURL = ApiBackend("api/auth/addSiswa");

      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("Session invalid or missing access token");
      }

      const response = await fetch(addSiswaURL, {
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
