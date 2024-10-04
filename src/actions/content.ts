'use server'

import Content from "@/services/content";

export async function create(cities: string[], service: string) {

    new Content().create(cities, service)
    
}