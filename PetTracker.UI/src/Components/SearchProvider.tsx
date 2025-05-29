import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const SearchContext = createContext({});

export default function SearchProvider(props: { children: ReactNode }) {
    const [searchTerm, setSearchTerm] = useState('');

    const value: SearchContextProps = {
        searchTerm,
        setSearchTerm,
    };

    return (
        <SearchContext.Provider value={value}>
            {props.children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }

    return context;
};