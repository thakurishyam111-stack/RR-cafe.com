// supplier.ts
import axios from "axios";

export interface SupplierData {
  _id?: string;
  supplierCode: string;
  supplierName: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  address?: string;
  panNumber?: string;
  status: "Active" | "Inactive";
  createdAt?: string;
}

// Base URL (यसको पछाडि / राख्दा पाथ जोड्न सजिलो र सुरक्षित हुन्छ)
const API_BASE_URL = "http://localhost:8080/api/supplier/"; 

/**
 * सबै Suppliers को सूची तान्ने (Get All)
 * GET: http://localhost:8080/api/suppliers/
 */
export const fetchSuppliers = async (): Promise<SupplierData[]> => {
  const res = await axios.get(`${API_BASE_URL}`);
  return res.data.suppliers || [];
};

/**
 * नयाँ Supplier थप्ने (Create)
 * POST: http://localhost:8080/api/suppliers/add
 * ✅ तपाईंको ब्याकेन्ड रूटको "/add" यहाँ थपिएको छ
 */
export const createSupplier = async (data: SupplierData): Promise<string> => {
  const res = await axios.post(`${API_BASE_URL}add`, data);
  return res.data.message || "Supplier created successfully";
};

/**
 * भइरहेको Supplier को विवरण परिमार्जन गर्ने (Update)
 * PUT: http://localhost:8080/api/suppliers/:id
 */
export const updateSupplierData = async (id: string, data: SupplierData): Promise<string> => {
  const res = await axios.put(`${API_BASE_URL}${id}`, data);
  return res.data.message || "Supplier updated successfully";
};

/**
 * Supplier हटाउने (Delete)
 * DELETE: http://localhost:8080/api/suppliers/:id
 */
export const deleteSupplierData = async (id: string): Promise<string> => {
  const res = await axios.delete(`${API_BASE_URL}${id}`);
  return res.data.message || "Supplier deleted successfully";
};