export default function ProductCard({ product }) {
  return (
    <div className="border p-4 rounded shadow">
      <img src={product.image} alt={product.title} className="mb-4 w-full" />
      <h2 className="text-xl font-bold">{product.title}</h2>
      <p className="text-green-600 font-semibold">{product.price}</p>
      <p className="mt-2">{product.description}</p>
    </div>
  );
}
