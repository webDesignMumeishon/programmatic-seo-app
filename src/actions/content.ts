'use server'

import Content from "@/services/content";

export async function create(cities: string[], service: string) {

    return await new Content().create(cities, service)
    
}