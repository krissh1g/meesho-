import { useState } from "react";
import axios from "axios";
import ProductCard from "./components/ProductCard";

export default function App() {
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!url) return alert("Paste a product URL!");
    setLoading(true);
    try {
      const { data } = await axios.post("/api/process-product", { url });
      setProduct(data);
    } catch (err) {
      alert("Failed to process product");
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Product Processor</h1>
      <input
        type="text"
        placeholder="Paste product link here"
        className="border p-2 w-full mb-4"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 w-full mb-6"
        onClick={handleSubmit}
      >
        {loading ? "Processing..." : "Process Product"}
      </button>
      {product && <ProductCard product={product} />}
    </div>
  );
}
