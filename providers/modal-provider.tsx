"use client"

import { StoreModal } from "@/components/modals/store-modal"
import { useEffect, useState } from "react"


//This provider is used to ensure that until the modal is mounted, it will not be displayed
//This means the SSR won't throw an hydration error
export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <>
            <StoreModal />
        </>
    )
}
