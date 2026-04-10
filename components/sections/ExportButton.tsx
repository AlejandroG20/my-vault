"use client"

import { useSearchParams } from "next/navigation"
import { Download } from "lucide-react"

export default function ExportButton() {
    const searchParams = useSearchParams()

    function buildExportUrl() {
        const params = new URLSearchParams()
        const type = searchParams.get("type")
        const category = searchParams.get("category")
        const dateFrom = searchParams.get("dateFrom")
        const dateTo = searchParams.get("dateTo")
        if (type) params.set("type", type)
        if (category) params.set("category", category)
        if (dateFrom) params.set("dateFrom", dateFrom)
        if (dateTo) params.set("dateTo", dateTo)
        return `/api/export/transactions?${params.toString()}`
    }

    return (
        <a
            href={buildExportUrl()}
            download
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary-200 text-primary-600 text-sm font-medium hover:bg-primary-50 transition-colors"
        >
            <Download size={14} />
            Exportar CSV
        </a>
    )
}
