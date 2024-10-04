"use client"

import React from 'react'
import SEOForm from './seo-form'

const Form = () => {
    return (
        <div className="flex h-screen items-center justify-center" >
            <div className="w-full mx-auto flex flex-col justify-center space-y-6 sm:max-w-xl">
                <div className="flex flex-col space-y-2 text-center">
                </div>
                <SEOForm />
            </div>
        </div>
    )
}

export default Form