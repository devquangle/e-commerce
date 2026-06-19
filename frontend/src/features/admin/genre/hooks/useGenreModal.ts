import { useState } from "react";
import type { GenreResponse } from "../types/genre.type";

export const useGenreModal = () => {
  const [selectedGenre, setSelectedGenre] = useState<GenreResponse | null>(
    null,
  );

  const [openSaveModal, setOpenSaveModal] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return {
    selectedGenre,
    setSelectedGenre,

    openSaveModal,
    setOpenSaveModal,

    openDeleteModal,
    setOpenDeleteModal,
  };
};
