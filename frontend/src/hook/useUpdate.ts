import { useEffect } from "react";
import { getSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface FormData {
  id: string;
  Value: string;
  Text: string;
}

export const UpdateChatBot = () => {
  const { register, setValue, handleSubmit } = useForm<FormData>();
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname ? pathname.split("/").pop() : "";

  const handleTextareaInput = (text: string) => {
    const textarea = document.getElementById("TextChat") as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.value = text;
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  async function getDataChat(id: string) {
    const session = await getSession();
    if (!session || !session.accessToken) {
      throw new Error(
        "User is not authenticated or session is missing accessToken"
      );
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/UpdateDataChat/${id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch data");
    }

    return await response.json();
  }

  async function updateDataChat(id: string, data: FormData) {
    const session = await getSession();
    if (!session || !session.accessToken) {
      throw new Error(
        "User is not authenticated or session is missing accessToken"
      );
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/UpdateDataChat/${id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update data");
    }

    return await response.json();
  }

  useEffect(() => {
    if (id) {
      getDataChat(id)
        .then((data) => {
          setValue("Value", data.data.Value);
          setValue("Text", data.data.Text);
          handleTextareaInput(data.data.Text);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to fetch data");
        });
    }
  }, [id, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      if (!id) throw new Error("ID is missing");
      const success = await updateDataChat(id, data);

      toast.success(success.message, {
        onClose: () => {
          router.push(success.redirect);
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update data");
    }
  };

  return {
    register,
    handleSubmit,
    handleTextareaInput,
    onSubmit,
  };
};
