import axios from "axios";
import FormData from "form-data";
import OpenAI from "openai";
import cheerio from "cheerio";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Product URL required" });

  try {
    // --- 1. Scrape product info ---
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const title = $('meta[property="og:title"]').attr('content') || "Product Title";
    const image = $('meta[property="og:image"]').attr('content') || "";
    const price = $('meta[property="product:price:amount"]').attr('content') || "N/A";

    // --- 2. Remove background using remove.bg ---
    const form = new FormData();
    form.append("image_url", image);
    form.append("size", "auto");

    const removeBgResponse = await axios.post("https://api.remove.bg/v1.0/removebg", form, {
      headers: {
        ...form.getHeaders(),
        "X-Api-Key": process.env.REMOVE_BG_API_KEY,
      },
      responseType: "arraybuffer",
    });

    // Convert image to base64 for easy frontend display
    const base64Image = `data:image/png;base64,${Buffer.from(removeBgResponse.data).toString("base64")}`;

    // --- 3. Generate description with OpenAI ---
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `Write a catchy, Meesho-style e-commerce product description for: ${title}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const description = completion.choices[0].message.content;

    res.status(200).json({ title, price, description, image: base64Image });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to process product" });
  }
}
