"use client";

import React from "react";
import { X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SIZE_GUIDE_DATA, MEASUREMENT_DESCRIPTIONS } from "@/constants";

interface SizeGuideModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
                                                                  open,
                                                                  onOpenChange,
                                                              }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                {/* Header */}
                <DialogHeader className="sticky top-0 bg-white z-10 border-b border-gray-200 px-6 sm:px-10 py-6">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg sm:text-xl font-normal tracking-wide uppercase">
                            SIZE GUIDE
                        </DialogTitle>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Close"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="px-6 sm:px-10 py-6 space-y-8">
                    {/* Size Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                                    Size
                                </th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                                    36
                                </th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                                    38
                                </th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                                    40
                                </th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">
                                    42
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="border-b border-gray-200">
                                <td className="py-3 px-4 text-sm text-gray-900 font-medium bg-gray-50">
                                    Waist
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700 text-center">
                                    36
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700 text-center">
                                    38.5
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700 text-center">
                                    41
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700 text-center">
                                    43.5
                                </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-3 px-4 text-sm text-gray-900 font-medium bg-gray-50">
                                    Hips
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700 text-center">
                                    62
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700 text-center">
                                    64.5
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700 text-center">
                                    67
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700 text-center">
                                    69.5
                                </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-3 px-4 text-sm text-gray-900 font-medium bg-gray-50">
                                    Inseam
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700 text-center">
                                    76
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700 text-center">
                                    77
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700 text-center">
                                    78
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700 text-center">
                                    79
                                </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="py-3 px-4 text-sm text-gray-900 font-medium bg-gray-50">
                                    Outseam
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700 text-center">
                                    102
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700 text-center">
                                    104
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700 text-center">
                                    106
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700 text-center">
                                    108
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Measurement Descriptions */}
                    <div className="space-y-4">
                        {MEASUREMENT_DESCRIPTIONS.map((measurement, index) => (
                            <div key={index} className="text-sm leading-relaxed">
                <span className="font-semibold text-gray-900">
                  {measurement.label}
                </span>{" "}
                                <span className="text-gray-700">{measurement.description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};