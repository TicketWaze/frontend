'use client'
import LoadingCircleSmall from '@workspace/ui/components/LoadingCircleSmall'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

export default function PageLoader({isLoading} : {isLoading : boolean}) {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="absolute top-0 left-0 w-screen h-dvh bg-neutral-400/70 z-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}       // when it first appears
                    animate={{ opacity: 1 }}       // when visible
                    exit={{ opacity: 0 }}          // when leaving
                    transition={{ duration: 0.3 }} // adjust speed
                >
                    <LoadingCircleSmall />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
