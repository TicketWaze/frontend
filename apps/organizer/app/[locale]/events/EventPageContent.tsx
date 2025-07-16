'use client'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

export default function EventPageContent() {
    return (
        <div>
            <Tabs defaultValue="all" className="w-full h-full">
                <TabsList className={'w-full lg:w-fit mx-auto lg:mx-0'}>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value='all'>test</TabsContent>
                <UpcomingContent />
                <HistoryContent />

            </Tabs>
        </div>
    )
}

function UpcomingContent() {
    return <TabsContent value='upcoming'>Upcoming</TabsContent>
}

function HistoryContent() {
    return (
        <TabsContent value='history'>History</TabsContent>
    )
}
