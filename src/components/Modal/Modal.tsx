import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { FiX } from "react-icons/fi";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
};
export const Modal = ({ isOpen, onClose, title, children }: Props) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30" />
                </TransitionChild>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">

                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white text-left
                                align-middle shadow-xl transition-all">
                                <div className="flex items-center justify-between p-4 border-b">
                                    <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        {title}
                                    </DialogTitle>
                                    <button
                                        type="button"
                                        className="p-1 rounded-full text-gray-400 hover:bg-gray-100 
                                            hover:text-gray-600 hover:cursor-pointer"
                                        onClick={onClose}
                                    >
                                        <FiX className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    {children}
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};