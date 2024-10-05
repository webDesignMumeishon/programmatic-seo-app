import { X } from 'lucide-react'
import React from 'react'

type Props = {
    keyword: string,
    remove: (city: string) => void
}

const KeywordInput = ({ keyword, remove }: Props) => {
    return (
        <span key={keyword} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {keyword}
            <button type="button" onClick={() => remove(keyword)} className="ml-1 text-blue-600 hover:text-blue-800">
                <X className="h-3 w-3" />
            </button>
        </span>
    )
}

export default KeywordInput