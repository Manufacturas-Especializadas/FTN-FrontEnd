import { useState } from "react";
import type { StageEntrance } from "../types/StageEntrance";

interface DeleteModalState {
    isOpen: boolean;
    plattaform: StageEntrance | null;
    isDeleting: boolean;
};

export const useDeleteModal = () => {
    const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
        isOpen: false,
        plattaform: null,
        isDeleting: false
    });

    const openDeleteModal = (plattaform: StageEntrance) => {
        setDeleteModal({
            isOpen: true,
            plattaform,
            isDeleting: false
        });
    }

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            plattaform: null,
            isDeleting: false
        });
    };

    const startDeleting = () => {
        setDeleteModal(prev => ({ ...prev, isDeleting: true }));
    };

    const stopDeleting = () => {
        setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    };

    return {
        deleteModal,
        openDeleteModal,
        closeDeleteModal,
        startDeleting,
        stopDeleting
    };
};