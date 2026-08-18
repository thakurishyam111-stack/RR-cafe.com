import { useMemo } from "react";


export default function globalSearch() {

    const filteredMenus = useMemo(() => {
      return menus.filter((item) => {
        const searchTerm = search.trim().toLowerCase();
    
        const matchesCategory =
          selectedCategory === "All" ||
          item.category?.toLowerCase() === selectedCategory.toLowerCase();
    
        const matchesSearch =
          !searchTerm ||
          item.title?.toLowerCase().includes(searchTerm) ||
          item.category?.toLowerCase().includes(searchTerm) ||
          item.description?.toLowerCase().includes(searchTerm);
    
        return matchesCategory && matchesSearch;
      });
    }, [menus, search, selectedCategory]);
      
    return (
        <>


        </>
    )

}