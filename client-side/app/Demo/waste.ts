"use client"
import { useEffect, useState } from "react";

 
const initialFormState = {
  name: '',
  sku: '',
  category: '',
  currentStock: 0,
  minimumStock: 0,
  costPerUnit: 0,
  sellingPrice: 0,
  unit: 'pcs',
  status: 'active',
  description: ''
};
export interface IStock {
  _id: string;
  name: string;
  sku: string;
  category: string;
  unit: 'kg' | 'grm' | 'ltr' | 'ml' | 'pcs' | 'pack';
  currentStock: number;
  minimumStock: number;
  costPerUnit: number;
  sellingPrice: number;
  expiryDate?: string | Date;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface StockSummary {
  totalItems: number;
  lowStockCount: number;
  totalValue: number;
  uniqueCategories: number;
}
export default function useStock(){
    const [stocks, setStocks] = useState<IStock[]>([]);
      const [summary, setSummary] = useState<StockSummary>({
        totalItems: 0,
        lowStockCount: 0,
        totalValue: 0,
        uniqueCategories: 0,
      });
      
      const [loading, setLoading] = useState<boolean>(true);
      const [error, setError] = useState<string | null>(null);
    
      // Search & Filter States
      const [searchQuery, setSearchQuery] = useState('');
      const [categoryFilter, setCategoryFilter] = useState('All');
      const [statusFilter, setStatusFilter] = useState('All');
    
      // Add / Edit Modal States
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [editingItem, setEditingItem] = useState<IStock | null>(null);
      const [formData, setFormData] = useState(initialFormState);
      const [formSubmitLoading, setFormSubmitLoading] = useState(false);
    
      // 1. Fetch Stocks from API
      const fetchStocks = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await fetch('http://localhost:8080/api/stocks');
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          const data = await response.json();
          const cleanData: IStock[] = Array.isArray(data) ? data : (data.stocks || data.data || []);
          setStocks(cleanData);
          updateSummaryCards(cleanData);
        } catch (err) {
          console.error("Backend fetch error:", err);
          setError("Unable to connect to database server. Please check cross-origin (CORS) headers.");
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchStocks();
      }, []);
    
      // Summary Update गर्ने common function
      const updateSummaryCards = (data: IStock[]) => {
        const lowStockItems = data.filter(item => item.currentStock <= item.minimumStock);
        const totalStockValue = data.reduce((acc, item) => acc + (item.currentStock * item.costPerUnit), 0);
        const uniqueCats = new Set(data.map(item => item.category)).size;
    
        setSummary({
          totalItems: data.length,
          lowStockCount: lowStockItems.length,
          totalValue: totalStockValue,
          uniqueCategories: uniqueCats
        });
      };
    
      // 2. Add / Edit Form Handling
      const openAddModal = () => {
        setEditingItem(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
      };
    
      const openEditModal = (item: IStock) => {
        setEditingItem(item);
        setFormData({
          name: item.name,
          sku: item.sku,
          category: item.category,
          currentStock: item.currentStock,
          minimumStock: item.minimumStock,
          costPerUnit: item.costPerUnit,
          sellingPrice: item.sellingPrice,
          unit: item.unit || 'pcs' ,
          status: item.status,
          description: item.description || ''
        });
        setIsModalOpen(true);
      };
    
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumber = ['currentStock', 'minimumStock', 'costPerUnit', 'sellingPrice'].includes(name);
        setFormData(prev => ({
          ...prev,
          [name]: isNumber ? Number(value) : value
        }));
      };
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitLoading(true);
        
        try {
          const url = editingItem 
            ? `http://localhost:8080/api/stocks/${editingItem._id}` 
            : 'http://localhost:8080/api/stocks';
          
          const method = editingItem ? 'PUT' : 'POST';
    
          // ⚠️ Senior Tip: पठाउनु अघि डेटा Format मिलेको छ कि छैन पक्का गर्ने
          const payload = {
            ...formData,
            currentStock: Number(formData.currentStock),
            minimumStock: Number(formData.minimumStock),
            costPerUnit: Number(formData.costPerUnit),
            sellingPrice: Number(formData.sellingPrice),
          };
    
          const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
    
          // यदि Backend ले ४०० वा ५०० एरर पठायो भने त्यसको विवरण निकाल्ने
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || errorData.error || `Server responded with status ${response.status}`);
          }
    
          // सफलता पूर्वक सेभ भएपछि
          await fetchStocks();
          setIsModalOpen(false);
          setFormData(initialFormState); // Form Reset गर्ने
          
        } catch (err: any) {
          console.error("❌ Form Submission Error Details:", err);
          // उपभोक्तालाई स्पष्ट एरर मेसेज देखाउने
          alert(`Error: ${err.message || "Failed to save stock. Please check console for details."}`);
        } finally {
          setFormSubmitLoading(false);
        }
      };
      // 3. Delete Handling
      const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
          try {
            const response = await fetch(`http://localhost:8080/api/stocks/${id}`, {
              method: 'DELETE',
            });
            if (!response.ok) throw new Error("Failed to delete stock");
            
            // State update safely
            const updatedStocks = stocks.filter(stock => stock._id !== id);
            setStocks(updatedStocks);
            updateSummaryCards(updatedStocks);
          } catch (err) {
            alert("Could not delete item. Check console logs.");
          }
        }
      };
    
      // Client-side Search and Filter
      const filteredStocks = stocks.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
      });
    
      const uniqueCategoriesList = Array.from(new Set(stocks.map(item => item.category)));
    


return {
  // Data
  stocks,
  summary,
  loading,
  error,

  // Search & Filter
  searchQuery,
  categoryFilter,
  statusFilter,
  filteredStocks,
  uniqueCategoriesList,

  // Modal
  isModalOpen,
  editingItem,
  formData,
  formSubmitLoading,

  // Setter
  setSearchQuery,
  setCategoryFilter,
  setStatusFilter,
  setIsModalOpen,
  setFormData,

  // Functions
  fetchStocks,
  openAddModal,
  openEditModal,
  handleInputChange,
  handleSubmit,
  handleDelete,
};
}