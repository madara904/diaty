"use client"

import { SidebarTrigger } from '@/app/components/ui/sidebar';
import React from 'react'

interface DashboardWrapperProps {
    children: React.ReactNode;
    title?: string;
}

const DashboardWrapper = ({ children, title }: DashboardWrapperProps) => {
    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex items-center gap-4 mb-6">
                <SidebarTrigger />
                {title && (
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                )}
            </div>
            <div className="flex-1">
                {children}
            </div>
        </div>
    )
}

export default DashboardWrapper 